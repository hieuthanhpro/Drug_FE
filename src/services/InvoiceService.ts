import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  historical: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.invoice.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filter: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.invoice.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterTemp: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.invoice.filterTemp}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  tempDetail: (id: string) => {
    return fetch(`${urlsApi.invoice.tempDetail}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  historyPayment: (params: any, signal: AbortSignal, type: "IV1" | "IV2") => {
    return fetch(`${urlsApi.invoice.historyPayment}/${type}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.invoice.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  exportTemp: (body: any) => {
    return fetch(`${urlsApi.invoice.exportTemp}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  detail: (id: string, type: "code" | "id") => {
    return fetch(`${urlsApi.invoice.detail}/${type}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  detailShort: (id: string, type: "code" | "id") => {
    return fetch(`${urlsApi.invoice.detailShort}/${type}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  save: (body: any) => {
    return fetch(`${urlsApi.invoice.save}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  createIV1: (body: any) => {
    return fetch(`${urlsApi.invoice.createIV1}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  warehouseing: (body: any) => {
    return fetch(`${urlsApi.invoice.warehousing}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  warehouseingTemp: (body: any) => {
    return fetch(`${urlsApi.invoice.warehousingTemp}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  shippingShell: (id, body) => {
    return fetch(`${urlsApi.invoice.shippingShell}/${id}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  updateInvoiceStatus: (body) => {
    return fetch(`${urlsApi.invoice.updateInvoiceStatus}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  paymentDebt: (id, body) => {
    return fetch(`${urlsApi.invoice.paymentDebt}/${id}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
