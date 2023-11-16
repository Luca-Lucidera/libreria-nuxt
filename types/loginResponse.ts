import type { UserVM } from "~/types/user/userVM";

export type LoginResponse = {
  user: UserVM;
  accessToken: string;
};
