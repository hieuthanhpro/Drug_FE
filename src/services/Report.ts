import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  filterRevenue: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.report.revenue.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },

  filterWarehouseSell: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.report.warehouseSell.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterAdminWarehouse: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.report.adminWarehouse.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterRevenueProfit: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.report.revenueProfit.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterSalePerson: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.report.salePerson.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },

  exportRevenue: (body: any) => {
    return fetch(`${urlsApi.report.revenue.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  exportRevenueProfit: (body: any) => {
    return fetch(`${urlsApi.report.revenueProfit.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },

  exportSalePerson: (body: any) => {
    return fetch(`${urlsApi.report.salePerson.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },

  exportGoodsInOut: (body: any) => {
    return fetch(`${urlsApi.report.warehouseSell.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
