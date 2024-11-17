import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  filterInvoices: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.invoices.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterForWarehousing: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.invoices.filterForWarehousing}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  deleteTemp: (id) => {
    return fetch(`${urlsApi.warehouse.invoices.delete}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  },
  exportInvoices: (body: any) => {
    return fetch(`${urlsApi.warehouse.invoices.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  exportCancelInvoices: (body: any) => {
    return fetch(`${urlsApi.warehouse.invoices.cancelExport}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  filterInventory: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.inventory.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  exportInventory: (body: any) => {
    return fetch(`${urlsApi.warehouse.inventory.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  updateStatus: (body: any) => {
    return fetch(`${urlsApi.warehouse.updateStatus}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  voucherCheckStatus: (body: any) => {
    return fetch(`${urlsApi.warehouse.voucherCheckStatus}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  voucherCheckCreate: (body: any) => {
    return fetch(`${urlsApi.warehouse.voucherCheckCreate}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  statistic: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.statistic}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  getCheck: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.voucherCheck}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  getCheckById: (id) => {
    return fetch(`${urlsApi.warehouse.voucherCheckById}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  getCheckDetail: (id) => {
    return fetch(`${urlsApi.warehouse.voucherCheck}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  getCancle: (params: any, signal: AbortSignal) => {
    return fetch(`https://apidev.sphacy.vn/api/v2/invoice/list${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  inOut: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.warehouse.inOut}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },

};
