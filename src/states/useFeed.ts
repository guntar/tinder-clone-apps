import { atom } from "recoil";

export const feedState = atom({
  key: "feedState",
  default: [] as People[], 
});

export const lastSeenIdState = atom({
  key: "lastSeenIdState",
  default: 0,
});
