import type { User } from "./user";

export type AuthLogin = {
  user: User;
  accessToken: {
    token: string;
    expiresIn: string;
  };
};
