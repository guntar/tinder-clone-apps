// components/InitApp.tsx
import { userService } from "@/src/services/userService";
import { guestToken } from "@/src/states/useUser";
import { storage } from "@/src/utils/storage";
import { useMutation } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

type InitGuestBody = {
  latitude: number;
  longitude: number;
  location_name?: string;
};

export default function InitApp({ children }: { children: React.ReactNode }) {
  const setGuestToken = useSetRecoilState(guestToken);
  const [ready, setReady] = useState(false);

  const initMutation = useMutation({
    mutationFn: async (body: InitGuestBody) => {
      console.log("[InitApp] Calling initGuest with body:", body);
      const response = await userService.initGuest(body);
      return response.data.data;
    },
    onSuccess: async (data) => {
      console.log("[InitApp] Success, guest_token:", data.guest_token);
      setGuestToken(data.guest_token);
      await storage.set("guestToken", data.guest_token);
      setReady(true);
      await SplashScreen.hideAsync();
    },
    onError: async (error) => {
      console.error("[InitApp] Error:", error);
      setReady(true);
      await SplashScreen.hideAsync();
    },
  });

  useEffect(() => {
    const initialize = async () => {
      console.log("[InitApp] Checking storage for guestToken...");
      const storedToken = await storage.get("guestToken");
      
      if (storedToken) {
        console.log("[InitApp] Found token in storage:", storedToken);
        setGuestToken(storedToken);
        
        // Validasi token dengan endpoint profile
        try {
          console.log("[InitApp] Validating token with profile endpoint...");
          const profileResponse = await userService.profile();
          
          // DEBUG: Log full response
          console.log("[InitApp] Full response:", JSON.stringify(profileResponse, null, 2));
          console.log("[InitApp] Response status:", profileResponse?.status);
          console.log("[InitApp] Response data:", profileResponse?.data);
          
          if (profileResponse?.data?.data) {
            console.log("[InitApp] Token valid, profile loaded");
            setReady(true);
            await SplashScreen.hideAsync();
          } else {
            console.log("[InitApp] Profile response empty, reinitializing...");
            await storage.remove("guestToken");
            setGuestToken(null);
            initMutation.mutate({
              latitude: 10,
              longitude: 12,
              location_name: "Jakarta",
            });
          }
        } catch (error: any) {
          console.log("[InitApp] Token invalid or profile error:", error.message);
          console.log("[InitApp] Error response:", error.response?.data);
          console.log("[InitApp] Error status:", error.response?.status);
          console.log("[InitApp] Full error:", JSON.stringify(error, null, 2));
          
          await storage.remove("guestToken");
          setGuestToken(null);
          initMutation.mutate({
            latitude: 10,
            longitude: 12,
            location_name: "Jakarta",
          });
        }
      } else {
        console.log("[InitApp] No token found, calling initGuest API...");
        initMutation.mutate({
          latitude: 10,
          longitude: 12,
          location_name: "Jakarta",
        });
      }
    };

    initialize();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}