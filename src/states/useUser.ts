import { storage } from "@/src/utils/storage";
import { atom } from "recoil";

export const guestToken = atom<string | null>({
  key: "guestToken",
  default: null,
});

export const getGuestToken = async (): Promise<string | null> => {
  return await storage.get("guestToken");
};

export const setGuestToken = async (token: string) => {
  await storage.set("guestToken", token);
};
