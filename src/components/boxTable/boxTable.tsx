import React, { Fragment, useEffect, useState } from "react";
import BulkAction, { BulkActionItemModel } from "components/bulkAction/bulkAction";
import Checkbox from "components/checkbox/checkbox";
import ReactTooltip from "react-tooltip";
import { Pagination, PaginationProps } from "components/pagination/pagination";
import { IAction } from "model/OtherModel";
import Action from "./partials/action";
import "./boxTable.scss";

export interface BoxTableProps {
  name: string;
  titles: any[];
  actions?: (item: any) => IAction[];
  actionType?: "dropdown" | "inline";
  items: any[];
  className?: string;
  dataMappingArray: (item: any, index: number) => void;
  dataFormat?: string[];
  onClickRow?: (item: any) => void;
  striped?: boolean;
  isBulkAction?: boolean;
  bulkActionItems?: BulkActionItemModel[];
  isPagination?: boolean;
  dataPagination?: PaginationProps;
  listIdChecked?: number[];
  setListIdChecked?: (listId: number[]) => void;
  renderDetail?: any;
  listDetailData?: any[];
  listIdDetailShow?: number[];
  headerRow?: any[];
  bottomRow?: any[];
}

export default function BoxTable(props: BoxTableProps) {
  const {
    name,
    titles,
    actions,
    actionType,
    items,
    className,
    onClickRow,
    striped,
    isBulkAction,
    bulkActionItems,
    isPagination,
    dataPagination,
    dataMappingArray,
    dataFormat,
    listIdChecked,
    setListIdChecked,
    renderDetail,
    listDetailData,
    listIdDetailShow,
    headerRow,
    bottomRow,
  } = props;
  const [listItem, setListItem] = useState<any[]>();
  const checkAll = (isChecked: boolean) => {
    if (isChecked) {
      setListIdChecked &&
        setListIdChecked(
          items.map((i) => {
            return i.id;
          })
        );
    } else {
      setListIdChecked && setListIdChecked([]);
    }
  };

  const checkOne = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setListIdChecked && setListIdChecked([...(listIdChecked ?? []), id]);
    } else {
      setListIdChecked && setListIdChecked(listIdChecked?.filter((i) => i !== id) ?? []);
    }
  };

  const mapData = (data: any[]) => {
    return data?.map((item, index) => ({
      id: item.id,
      data: dataMappingArray(item, index),
      raw: item,
      showActionRow: false,
      onShowDetail: false,
    }));
  };

  useEffect(() => {
    setListItem(mapData(items));
    return () => {
      setListItem([]);
    };
  }, [items]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [listItem]);

  const handleShowActionRow = (id: number, isShow?: boolean) => {
    const listItemTemp = listItem?.map((item) => {
      return {
        ...item,
        showActionRow: id === 0 ? false : item.id === id ? isShow : false,
      };
    });
    setListItem(listItemTemp);
  };

  return (
    <div className="box-table">
      <div className="box-table__wrapper">
        <table className={`table${striped ? " table-striped" : ""}${isPagination ? " has-pagination" : ""}${className ? ` ${className}` : ""}`}>
          <thead>
            <tr>
              {isBulkAction && bulkActionItems && bulkActionItems?.length > 0 && listIdChecked && setListIdChecked && (
                <th className="checkbox">
                  <Checkbox
                    indeterminate={listIdChecked?.length > 0 && listIdChecked?.length < items.length}
                    checked={listIdChecked?.length === items.length}
                    onChange={(e) => checkAll(e.target.checked)}
                  />
                  <BulkAction name={name} selectedCount={listIdChecked?.length} bulkActionItems={bulkActionItems} />
                </th>
              )}
              {titles?.map((title, idx) => {
                if (Array.isArray(title)) {
                  return (
                    <th key={idx} className="text-center" colSpan={title.length-1}>
                      {title[0]}
                    </th>
                  );
                } else {
                  return (
                    <th key={idx} className={`${dataFormat ? dataFormat[idx] : ""}`} rowSpan={2}>
                      {title}
                    </th>
                  );
                }
              })}
              {actions && actions?.length > 0 && (
                <th className={`actions${!actionType || actionType === "dropdown" ? " actions-dropdown" : ""}`}></th>
              )}
            </tr>
            <tr>
              {titles.some((item) => Array.isArray(item)) &&
                titles?.map((title) => {
                  if (Array.isArray(title)) {
                    return title.map((itemSub,index) =>index!==0 && <th key={itemSub} className="text-center">{itemSub}</th>)
                  }
                })}
            </tr>
          </thead>
          <tbody>
            {headerRow &&
              headerRow.map((row, i) => (
                <tr className="header-row" key={i}>
                  {row &&
                    row.length > 0 &&
                    row.map((col, i) => (
                      <td key={i} className="header-col">
                        {col}
                      </td>
                    ))}
                </tr>
              ))}
            {listItem?.map((item, index) => {
              const isChecked = listIdChecked && setListIdChecked && listIdChecked.some((id) => id === item.id) ? true : false;
              const itemDetail = listDetailData?.find((d) => d.id === item.id);
              return (
                <Fragment key={index}>
                  <tr
                    onClick={() => onClickRow && onClickRow(item.raw)}
                    className={`${onClickRow ? "cursor-pointer" : ""}${
                      isBulkAction && bulkActionItems && bulkActionItems?.length > 0 && isChecked ? " has-choose" : ""
                    }`}
                  >
                    {isBulkAction && bulkActionItems && bulkActionItems?.length > 0 && listIdChecked && setListIdChecked && (
                      <td className="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isChecked} onChange={(e) => checkOne(item.id, e.target.checked)} />
                      </td>
                    )}
                    {item.data?.map((d: any, idx: number) => (
                      <td className={`${dataFormat ? dataFormat[idx] : ""}`} key={idx}>
                        {typeof d === "string" || typeof d === "number" ? <span>{d}</span> : d}
                      </td>
                    ))}
                    {actions && actions?.length > 0 && (
                      <td
                        className={`actions${!actionType || actionType === "dropdown" ? " actions-dropdown" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Action
                          item={item}
                          actionType={actionType}
                          handleShowActionRow={(id, value) => handleShowActionRow(id, value)}
                          actions={actions}
                        />
                      </td>
                    )}
                  </tr>
                  {itemDetail && (
                    <tr className={`row-detail${listIdDetailShow?.find((id) => id === item.id) ? "" : " d-none"}`}>
                      <td colSpan={item.data.length + (isBulkAction ? 1 : 0) + (actions ? 1 : 0)}>{renderDetail(itemDetail)}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {bottomRow &&
              bottomRow.map((row, i) => (
                <tr className="header-row" key={i}>
                  {row &&
                    row.length > 0 &&
                    row.map((col, i) => (
                      <td key={i} className="header-col">
                        {col}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isPagination && dataPagination && (
        <Pagination
          name={dataPagination.name}
          displayNumber={dataPagination.displayNumber}
          page={dataPagination.page}
          setPage={(page) => dataPagination.setPage(page)}
          sizeLimit={dataPagination.sizeLimit}
          totalItem={dataPagination.totalItem}
          totalPage={dataPagination.totalPage}
          isChooseSizeLimit={dataPagination.isChooseSizeLimit}
          chooseSizeLimit={(limit) => dataPagination.chooseSizeLimit && dataPagination.chooseSizeLimit(limit)}
        />
      )}
      <ReactTooltip />
    </div>
  );
}
