import type { Division } from "./division";
import type { Role } from "./role";

type UserAccount = {
  id: string | null;
  name: string;
  email: string;
  userId: string | null;
  roleId: string | null;
  imei?: string | null;
  pin?: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
};

export type User = {
  id: string;
  fullName: string;
  name: string;
  email?: string;
  birthDate: string | null;
  birthPlace: string | null;
  address: string | null;
  phoneNumber: string;
  imageId: string | null;
  joinAt: string;
  gender: "male" | "female";
  active: boolean;
  updatedAt: string;
  createdAt: string;
  admin?: UserAccount;
  sales?: UserAccount;
  role: Role | null;
  division?: Division | null;
};
