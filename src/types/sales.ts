import type { User } from "./user";

export type SalesPayload = {
  name: string | null;
  fullName: string | null;
  email: string;
  password?: string | null;
  pin: string;
  phoneNumber: string;
  birthDate: string | null;
  birthPlace: string | null;
  address: string | null;
  gender: "male" | "female";
  active: boolean;
};

export type Sales = {
  id: string;
  userId: string | null;
  roleId: string | null;
  name: string;
  pin: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  phoneNumber?: string | null;
  email?: string | null;
  fullName?: string | null;
  user: User;
};
