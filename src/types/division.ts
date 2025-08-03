export type Division = {
  id: string;
  name: string;
  displayName: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  accesses: AccessesOnDivision[] | [];
};

export type DivisionPayload = {
  name: string;
  displayName: string;
  active: boolean;
  accesses: { accessId: string }[] | null;
};

export type AccessesOnDivision = {
  id: string;
  accessId: string;
  accessName: string;
  divisionId: string;
  divisionName: string;
  updatedAt: string;
  createdAt: string;
};
