export type User = {
  id: string;
  name: string;
  email: string;
  divisionId: string | null;
  userId: string;
  roleId: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  division: null | {
    id: string;
    name: string;
    displayName: string;
    updatedAt: string;
    createdAt: string;
  };
  adminData: null | {
    fullName: string | null;
    name: string;
    id: string;
    gender: "male" | "female";
    joinAt: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
  };
};
