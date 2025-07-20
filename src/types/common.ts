export type Meta = {
  totalData?: number;
  totalPage?: number;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: string;
};

export type Error = {
  code: number;
  title: string;
  message: string;
};

export type ApiResponse<T> = {
  error?: Error;
  data: T;
  meta: {
    version: string;
  };
};

export type WithMeta<T> = {
  data: T;
  meta: Meta;
};

export type BaseParam<T> = {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  orderBy?: keyof T;
};
