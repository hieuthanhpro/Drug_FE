import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  filter: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.drug.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.drug.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  detail: (id: number, signal?: AbortSignal) => {
    return fetch(`${urlsApi.drug.detail}/${id}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  business: (ids: number[], type) => {
    return fetch(`${urlsApi.drug.updateStatus}`, {
      method: "POST",
      body: JSON.stringify({
        ids: ids,
        type: type,
      }),
    }).then((res) => res.json());
  },
  delete: (id: number) => {
    return fetch(`${urlsApi.drug.delete}/${id}`, {
      method: "POST",
    }).then((res) => res.json());
  },
  save: (body: FormData) => {
    return fetch(`${urlsApi.drug.save}`, {
      method: "POST",
      body: body,
    }).then((res) => res.json());
  },
  filterMasterData: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.drug.filterDrugMaster}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterForSale: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.drug.filterForSale}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  filterForWarehousing: (params: any, signal: AbortSignal) => {
    return fetch(`${urlsApi.drug.filterForWarehousing}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
};
