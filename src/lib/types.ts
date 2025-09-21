import type { SWIPE_TYPE } from "./constants";

export type SwipeType = (typeof SWIPE_TYPE)[number];

export type FunctionResult<T extends object> = { ok: false; code: number; message: string } | ({ ok: true } & T);

export interface Country {
  code: string;
  name: string;
}

export interface School {
  code: string;
  name: string;
}

export interface UserProfile {
  country: Country | null;
  school: School | null;
  classYear: number;
  bio: string | null;
}
