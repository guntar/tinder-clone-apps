import { api } from "@/src/api/api";
import { getGuestToken } from "../states/useUser";

export const userService = {
  initGuest: async (body: {
    latitude: number;
    longitude: number;
    location_name?: string;
  }) => {
    const res = await api.post("/auth", body);
    return res;
  },

  profile: async () => {
    const token = await getGuestToken();
    if (!token) throw new Error("Guest token not found");

    const res = await api.get(`/auth/profile/${token}`);

    return res;
  },
};
