import type { User } from "./user";

export type AdminPayload = {
  name: string;
  email: string;
  password?: string | null;
  gender: "male" | "female";
  phoneNumber: string | null;
  divisionId: string | null;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  divisionId: string | null;
  userId: string;
  roleId: string | null;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  user: User;
  division: string | null;
};
