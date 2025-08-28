import type { Customer } from "./customer";
import type { Sales } from "./sales";

export type OrderItems = {
  id: string;
  name: string;
  price: number;
  productSku: string;
  brandName: string;
  code: string;
  categoryName: string;
  categoryId: string;
  orderQty: number;
};

export type ReportOrder = {
  id: string;
  customerId: string;
  salesId: string;
  productIds: string[];
  totalAmount: number;
  description: string | null;
  status: "paid" | "pending" | "rejected" | "delivered" | "success";
  purchasedAt: string;
  duePaymentAt: string | null;
  isNewOrder: boolean;
  typeOrder: "cash" | "consignment" | "tempo";
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  sales: Sales;
  orderItems: OrderItems[];
};
