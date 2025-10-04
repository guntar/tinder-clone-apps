import { apiRequest } from "@/src/api/api";
import { getGuestToken } from "@/src/states/useUser";

export const feedService = {
  fetchFeed: async ({
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
    console.log('hit' + last_seen_id);
    const token = await getGuestToken();
    if (!token) throw new Error("Guest token not found");

    const params = {
      guest: token,
      limit,
      last_seen_id,
      latitude,
      longitude,
    };

    console.log("[feedService] fetchFeed params:", params);

    const res = await apiRequest.get("/feed", { params });
    console.log("[feedService] fetchFeed response:", res.data.users);

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
  },
};
