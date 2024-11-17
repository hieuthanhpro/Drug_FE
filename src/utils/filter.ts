import _ from "lodash";
import { IFilterItem, ISaveSearch } from "model/OtherModel";

// Tạo param từ bộ lọc và saveSearch
export function BuildObjectFilter(params: any, listFilter: IFilterItem[], saveSearch?: ISaveSearch) {
  let result = {};
  const paramsOld = _.cloneDeep(params);
  if (listFilter) {
    listFilter.map((filterItem) => {
      if (saveSearch && saveSearch.params) {
        const saveSearchCurrent = saveSearch.params.find((param) => param.key === filterItem.key);
        if (saveSearchCurrent) {
          if (filterItem.type === "date-two" || filterItem.type === "date") {
            saveSearchCurrent.value || saveSearchCurrent.value === 0
              ? (result["from_date"] = saveSearchCurrent.value)
              : delete paramsOld["from_date"];
            saveSearchCurrent.value_extra || saveSearchCurrent.value_extra === 0
              ? (result["to_date"] = saveSearchCurrent.value_extra)
              : delete paramsOld["to_date"];
          } else {
            saveSearchCurrent.value || saveSearchCurrent.value === 0
              ? (result[saveSearchCurrent.key] = saveSearchCurrent.value)
              : delete paramsOld[saveSearchCurrent.key];
          }
        } else {
          delete paramsOld[filterItem.key];
        }
      } else {
        if (filterItem.type === "date-two" || filterItem.type === "date") {
          filterItem.value || filterItem.value === 0 ? (result["from_date"] = filterItem.value) : delete paramsOld["from_date"];
          filterItem.value_extra || filterItem.value_extra === 0 ? (result["to_date"] = filterItem.value_extra) : delete paramsOld["to_date"];
        } else {
          filterItem.value || filterItem.value === 0 ? (result[filterItem.key] = filterItem.value) : delete paramsOld[filterItem.key];
        }
      }
    });
  }
  if (saveSearch && saveSearch.params) {
    const query = saveSearch.params.find((param) => param.key === "query");
    result["query"] = query?.value ?? "";
  }
  result = { ...paramsOld, ...result };
  return result;
}

// Xóa các param theo danh sách bộ lọc
export function clearFilter(params: any, listFilter: IFilterItem[]) {
  const paramsOld = _.cloneDeep(params);
  listFilter?.map((filterItem) => {
    switch (filterItem.type) {
      case "date":
        delete paramsOld["from_date"];
        break;
      case "date-two":
        delete paramsOld["from_date"];
        delete paramsOld["to_date"];
        break;
      default:
        delete paramsOld[filterItem.key];
        break;
    }
  });
  paramsOld["query"] = "";
  return paramsOld;
}
