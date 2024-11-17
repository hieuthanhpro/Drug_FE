import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  drugStore: () => {
    return fetch("https://apidev.sphacy.vn/api/v2/admin/drugstore/listBySource?source=gdp", {
      method: "GET",
    }).then((res) => res.json());
  },
  filterDrug: (page: number, drug_store_id?: number, is_drug?: string, is_inventory?: string, search?: string) => {
    return fetch(`https://apidev.sphacy.vn/api/v2/drug/filterDrugByCriteria?${page && `page=${page}&per_page=16`}${drug_store_id && `&drug_store_id=${drug_store_id}`}${search ? `&search_text=${search}` : "&search_text="}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  getWarningOrder: () => {
    return fetch(`${urlsApi.order.warningOrder}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  save: (body: any) => {
    return fetch(`${urlsApi.order.save}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
