export type Access = {
  id: string;
  name: string;
  description: string;
  resource: string;
  updatedAt: string;
  createdAt: string;
  action: "create" | "read" | "update" | "delete";
};
