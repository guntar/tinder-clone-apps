import { api, apiRequest } from "@/src/api/api";
import { storage } from "@/src/utils/storage";

const getAuthBody = async (body: any) => {
  const token = await storage.get("guestToken");
  console.log('[matcherService] Guest token:', token);
  return {
    ...body,
    liker: token,
  };
};

export const matcherService = {
  likeUser: async (body: { liked: number }) => {
    console.log('[matcherService] likeUser called with:', body);
    try {
      const authBody = await getAuthBody(body);
      console.log('[matcherService] likeUser request body:', authBody);
      
      const res = await api.post("/matcher/like", authBody);
      
      console.log('[matcherService] likeUser response:', res.data);
      return res;
    } catch (error: any) {
      console.error('[matcherService] likeUser error:', error);
      console.error('[matcherService] likeUser error response:', error.response?.data);
      throw error;
    }
  },

  passUser: async (body: { liked: number }) => {
    console.log('[matcherService] passUser called with:', body);
    try {
      const authBody = await getAuthBody(body);
      console.log('[matcherService] passUser request body:', authBody);
      
      const res = await api.post("/matcher/pass", authBody);
      
      console.log('[matcherService] passUser response:', res.data);
      return res;
    } catch (error: any) {
      console.error('[matcherService] passUser error:', error);
      console.error('[matcherService] passUser error response:', error.response?.data);
      throw error;
    }
  },

  fetchLiked: async ({
  limit = 10,
  last_seen_id = 0,
  latitude = 0,
  longitude = 0,
}: {
  limit?: number;
  last_seen_id?: number;
  latitude?: number;
  longitude?: number;
}) => {
  console.log('[matcherService] fetchLiked called with last_seen_id:', last_seen_id);
  
  try {
    const token = await storage.get("guestToken");
    if (!token) throw new Error("Guest token not found");

    const params = {
      guest: token,
      limit,
      last_seen_id,
      latitude,
      longitude,
    };

    console.log("[matcherService] fetchLiked params:", params);

    const res = await apiRequest.get("/matcher/liked", { params });
    console.log("[matcherService] fetchLiked response count:", res.data.users.length);

    const mappedUsers: People[] = res.data.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      age: new Date().getFullYear() - new Date(u.birth_date).getFullYear(),
      distance_km: u.distance_km,
      pictures: u.pictures.map((p: any) => ({ path: p.url || p.path })),
    }));

    return {
      users: mappedUsers,
      last_seen_id: res.data.last_seen_id,
    };
  } catch (error: any) {
    console.error('[matcherService] fetchLiked error:', error);
    console.error('[matcherService] fetchLiked error response:', error.response?.data);
    throw error;
  }
}
};