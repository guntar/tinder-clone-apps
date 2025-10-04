type Picture = { id: number; path: string };

type People = {
  id: number;
  name: string;
  birth_date: string;
  gender: string;
  guest_token: string;
  distance_km: number;
  location_name?: string;
  pictures: Picture[];
};
