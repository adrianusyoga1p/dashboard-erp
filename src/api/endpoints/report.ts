import type { ApiResponse, BaseParam, WithMeta } from "@/types/common";
import type { ReportOrder } from "@/types/report";
import apiClient from "../client";

export const apiGetListReportOrder = (params: BaseParam<ReportOrder>) => {
  return apiClient<ApiResponse<WithMeta<ReportOrder[]>>>({
    method: "GET",
    url: "/api/v1/order/report",
    params,
  });
};
