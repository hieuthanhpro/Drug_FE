import React, { Fragment, useEffect, useState } from "react";
import Icon from "components/icon";
import Input from "components/input/input";
import { IFilterItem, ISaveSearch, ISortItem } from "model/OtherModel";
import Filter, { ListFilterChoose } from "components/filter/filter";
import SaveSearch from "components/saveSearch/saveSearch";
import Button from "components/button/button";
import _ from "lodash";
import { BuildObjectFilter, clearFilter } from "utils/filter";
import Sortby from "components/sortby/sortby";
import { SelectOptionData } from "utils/selectCommon";
import { getSearchParameters } from "utils/common";
import { useDebounce, useWindowDimensions } from "utils/hookCustom";
import "./searchBox.scss";

interface SearchBoxProps {
  name?: string;
  params: any;
  updateParams?: (params: any) => void;
  isFilter?: boolean;
  listFilterItem?: IFilterItem[];
  isShowFilterList?: boolean;
  isSaveSearch?: boolean;
  listSaveSearch?: ISaveSearch[];
  onSaveSearch?: (saveSearch: string) => void;
  isSort?: boolean;
  listSort?: ISortItem[];
  autoFocusSearch?: boolean;
  placeholderSearch?: string;
}

export default function SearchBox(props: SearchBoxProps) {
  const {
    name,
    params,
    updateParams,
    isFilter,
    listFilterItem,
    isShowFilterList,
    isSaveSearch,
    listSaveSearch,
    onSaveSearch,
    isSort,
    listSort,
    autoFocusSearch,
    placeholderSearch,
  } = props;
  const searchParams = getSearchParameters();
  const { width } = useWindowDimensions();
  const [paramsOld, setParamsOld] = useState<any>();
  const [disableSaveSearch, setDisableSaveSearch] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<IFilterItem[]>(listFilterItem);
  const [query, setQuery] = useState<string>(params?.query ?? "");
  const queryDebounce = useDebounce(query, 500);

  useEffect(() => {
    if (params !== paramsOld) {
      setParamsOld(params);
    }
  }, [params, listFilterItem]);

  useEffect(() => {
    const paramsTemp = BuildObjectFilter(params, filterItems);
    if (!_.isEqual(params, paramsTemp)) {
      updateParams({ ...paramsTemp, page: 1 });
    }
  }, [filterItems]);

  useEffect(() => {
    if (params.query !== query) {
      updateParams({ ...params, query: query, page: 1 });
    }
  }, [queryDebounce]);

  const updateFilterItemsWithParams = async () => {
    if (
      searchParams["category"] ||
      searchParams["user"] ||
      searchParams["created_by"] ||
      searchParams["sale"] ||
      searchParams["supplier"] ||
      searchParams["customer"] ||
      searchParams["group"]
    ) {
      const filterItemsFinal = [];
      for (const filterItem of listFilterItem) {
        if (
          searchParams[filterItem.key] &&
          (!filterItem.list || filterItem.list.length === 0) &&
          ["category", "user", "created_by", "sale", "supplier", "customer", "group"].includes(filterItem.key)
        ) {
          const dataOption = await SelectOptionData(filterItem.key, filterItem.params);
          if (dataOption) {
            filterItemsFinal.push({
              ...filterItem,
              list: [
                { value: "", label: `Chọn ${filterItem.name.toLowerCase()}` },
                ...(filterItem.key === "customer"
                  ? [
                      {
                        value: 0,
                        label: "Khách lẻ",
                      },
                    ]
                  : []),
                ...(dataOption.length > 0 ? dataOption : []),
              ],
              value: +searchParams[filterItem.key],
            });
          }
        } else {
          filterItemsFinal.push(filterItem);
        }
      }
      setFilterItems(filterItemsFinal);
    }
  };

  useEffect(() => {
    updateFilterItemsWithParams();
  }, []);

  const callbackSaveSearch = (saveSearch: ISaveSearch) => {
    if (saveSearch.params && saveSearch.params.length > 0) {
      const paramsTemp = BuildObjectFilter(params, filterItems, saveSearch);
      if (!_.isEqual(params, paramsTemp)) {
        const filterItemsTemp = filterItems?.map((filter) => {
          const param = saveSearch.params.find((param) => param.key === filter.key);
          if (param) {
            return {
              ...filter,
              value: param.value,
              ...(filter.type === "date-two" && param.value_extra ? { value_extra: param.value_extra } : {}),
            };
          } else {
            return {
              ...filter,
              value: "",
            };
          }
        });
        setFilterItems(filterItemsTemp);
        updateParams({ ...paramsTemp, page: 1 });
        setQuery(paramsTemp["query"] ?? "");
      }
    } else {
      const paramsTemp = clearFilter(params, filterItems);
      if (!_.isEqual(params, paramsTemp)) {
        const filterItemsTemp = filterItems?.map((filter) => {
          return {
            ...filter,
            value: "",
          };
        });
        setFilterItems(filterItemsTemp);
        updateParams({ ...paramsTemp, page: 1 });
        setQuery(paramsTemp["query"] ?? "");
      }
    }
  };

  const callbackSortby = (value: string) => {
    updateParams({ ...params, page: 1, sort_by: value });
  };

  return (
    <Fragment>
      {isSaveSearch && (
        <SaveSearch
          params={params}
          listSaveSearch={listSaveSearch}
          listFilterItem={filterItems}
          setDisabledSaveSearch={(e) => setDisableSaveSearch(e)}
          callback={(saveSearch) => callbackSaveSearch(saveSearch)}
        />
      )}
      <div
        className={`search-container d-flex align-items-center${
          isFilter && listFilterItem.length > 0 ? " has-filter" : ""
        }${isSaveSearch && onSaveSearch ? " has-save-search" : ""}`}
      >
        {isFilter && filterItems.length > 0 && (
          <Filter
            name={name}
            listFilterItem={filterItems}
            isShowFilterList={isShowFilterList}
            onChangeFilter={(listFilter) => setFilterItems(listFilter)}
          />
        )}
        <Input
          type="text"
          className="search-input"
          placeholder={placeholderSearch ? placeholderSearch : `Tìm kiếm${name ? ` ${name.toLowerCase()}` : ""}`}
          icon={<Icon name="Search" />}
          iconPosition="left"
          value={query}
          fill={true}
          autoFocus={autoFocusSearch}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSaveSearch && onSaveSearch && (
          <Button
            type="button"
            color="secondary"
            className="btn-save-search"
            disabled={disableSaveSearch}
            onClick={() => undefined}
          >
            Lưu{width > 768 ? ` bộ lọc` : ""}
          </Button>
        )}
        {isSort && listSort.length > 0 && (
          <Sortby params={params} listSort={listSort} callback={(value: string) => callbackSortby(value)} />
        )}
      </div>
      {isFilter && (
        <ListFilterChoose listFilterItem={filterItems} updateFilterItem={(listFilter) => setFilterItems(listFilter)} />
      )}
    </Fragment>
  );
}
