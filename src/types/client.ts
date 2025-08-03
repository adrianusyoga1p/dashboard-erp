export type Client = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string | null;
  address: string;
  latitude: number;
  longitude: number;
  storeName: string;
  updateAt: string;
  createdAt: string;
};

export type ClientPayload = {
  name: string;
  phoneNumber: string;
  email: string | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  storeName: string;
};
