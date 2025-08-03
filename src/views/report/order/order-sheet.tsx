import { BaseSheet } from "@/components/base/sheet";
import { useFormatter } from "@/hooks/useFormatter";
import type { ReportOrder } from "@/types/report";
import { useState, type ReactNode } from "react";

interface ReportOrderSheetProps {
  reportOrderData?: ReportOrder;
  loadData: () => void;
  trigger?: ReactNode;
}

export const ReportOrderSheet = ({
  reportOrderData,
  loadData,
  trigger,
}: ReportOrderSheetProps) => {
  const { formatMoney } = useFormatter();
  const [state, setState] = useState({
    show: false,
  });
  const { formatDateTime } = useFormatter();

  return (
    <BaseSheet
      open={state.show}
      onOpenChange={(isOpen) => {
        setState((prev) => ({
          ...prev,
          show: isOpen,
        }));
        loadData();
      }}
      trigger={trigger}
      headerTitle={`Detail Order ${reportOrderData?.id}`}
    >
      <div className="space-y-6 p-4 relative overflow-y-auto">
        <div className="border-b space-y-4 pb-4">
          <h1 className="text-xl font-semibold">Client Data</h1>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Client Name
            </label>
            <p>{reportOrderData?.client.name || "-"}</p>
          </div>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Client Phone Number
            </label>
            <p>{reportOrderData?.client.phoneNumber || "-"}</p>
          </div>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Client Address
            </label>
            <p>{reportOrderData?.client.address || "-"}</p>
          </div>
        </div>
        <div className="border-b space-y-4 pb-4">
          <h1 className="text-xl font-semibold">Order Data</h1>
          {reportOrderData?.orderItems.map((order) => (
            <div key={order.id} className="flex gap-2 justify-between items-end">
              <div>
                <label className="font-semibold text-sm block mb-2">
                  {order.name}
                </label>
                <p className="text-xs">
                  {formatMoney(order.price) || "0"} x {order.orderQty}
                </p>
              </div>
              <p>{formatMoney(Number(order.price * order.orderQty))}</p>
            </div>
          ))}
          <div className="flex gap-2 justify-between items-center">
            <label className="font-semibold text-sm block">
              Total Amount
            </label>
            <p>{formatMoney(reportOrderData?.totalAmount)}</p>
          </div>
        </div>
        <div className="border-b space-y-4 pb-4">
          <h1 className="text-xl font-semibold">Sales Data</h1>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Sales Name
            </label>
            <p>{reportOrderData?.sales.name || "-"}</p>
          </div>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Sales Full Name
            </label>
            <p>{reportOrderData?.sales.fullName || "-"}</p>
          </div>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Sales Email
            </label>
            <p>{reportOrderData?.sales.email || "-"}</p>
          </div>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Sales Phone Number
            </label>
            <p>{reportOrderData?.sales.phoneNumber || "-"}</p>
          </div>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            Purchased At
          </label>
          <p className="capitalize">
            {formatDateTime(reportOrderData?.purchasedAt as string) || "-"}
          </p>
        </div>
      </div>
    </BaseSheet>
  );
};
