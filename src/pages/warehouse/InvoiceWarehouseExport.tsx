import React, { Fragment, useEffect, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import { IAction, IFilterItem, ISaveSearch } from "model/OtherModel";
import BoxTable from "components/boxTable/boxTable";
import Common, { isDifferenceObj } from "utils/common";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useSearchParams } from "react-router-dom";
import { ICategory } from "model/drug/response/CategoryModelResponse";
import { IGroup } from "model/drug/response/GroupModelResponse";
import _ from "lodash";
import { IUser } from "model/user/response/UserResponseModel";
import InvoiceService from "services/InvoiceService";
import { IInvoice } from "model/invoice/response/InvoiceResponseModel";
import {IInvoiceWarehouseResponse} from "model/invoiceWarehouse/response/InvoiceWarehouseResponseModel";
import moment from "moment";
import Badge from "components/badge/badge";
import { saleInvoiceStatus } from "model/invoice/DataModelInitial";
import { BulkActionItemModel } from "components/bulkAction/bulkAction";
import {formatDate} from "../../utils/dateFormat"
import Warehouse from "services/InvoiceWarehouse";

export default function InvoiceWarehouseExport({ isReturn = false, isTemp = false, isImport = false, isExport = true }) {
  document.title = isReturn ? "Hóa đơn khách trả hàng" : isTemp ? "Hóa đơn bán hàng lưu tạm" : "Hóa đơn bán hàng";
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IGroup | ICategory>(null);
  const [onShowModalDetail, setOnShowModalDetail] = useState<boolean>(false);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Tất cả phiếu xuất kho",
      is_active: true,
    },
  ]);

  const [invoiceWarehouse, setinvoiceWarehouse] = useState<IFilterItem[]>([
    ...((!isTemp
      ? [
          {
            key: "status",
            name: "Trạng thái",
            type: "radio",
            is_featured: true,
            list: Object.keys(saleInvoiceStatus)
              .map(function (key) {
                return {
                  value: key,
                  label: saleInvoiceStatus[key],
                };
              })
              .filter((item) => item.value !== "temp"),
            value: searchParams.get("status") ?? "",
          },
        ]
      : []) as IFilterItem[]),
      {
        key: "created_at",
        name: "Ngày tạo",
        type: "date-two",
        is_featured: true,
        list: [],
        value: searchParams.get("created_at") ?? "",
        // value_extra: searchParams.get("to_date") ?? "",
      },
    {
      key: "date",
      name: "Ngày nhập kho",
      type: "date-two",
      is_featured: true,
      list: [],
      value: searchParams.get("date") ?? "",
      // value_extra: searchParams.get("to_date") ?? "",
    },
  ]);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    invoice_type: isReturn ? "IV3" : "IV1",
    ...(isTemp ? { status: "temp" } : {}),
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: isReturn ? "Hóa đơn khách trả hàng" : isTemp ? "Hóa đơn bán hàng lưu tạm" : "Hóa đơn bán hàng",
    isChooseSizeLimit: true,
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
    chooseSizeLimit: (limit) => {
      setParams((prevParams) => ({ ...prevParams, limit: limit }));
    },
  });

  const abortController = new AbortController();
  const getListCategoryGroup = async (paramsSearch) => {
    setIsLoading(true);
    let response = null;
    response = await Warehouse.filter_export(paramsSearch, abortController.signal);
    console.log("abc", response)
    if (response.code === 200) {
      const result = response.result;
      setListInvoice(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (!isDifferenceObj(params, { query: "", page: 1, invoice_type: isReturn ? "IV3" : "IV1" }) && +result.total === 0) {
        setIsNoItem(true);
      }
    } else {
      Common.showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const paramsTemp = _.cloneDeep(params);
    searchParams.forEach(async (key, value) => {
      paramsTemp[value] = key;
    });
    console.log("temp param ",paramsTemp)
    setParams((prevParams) => ({ ...prevParams, ...paramsTemp }));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      getListCategoryGroup(params);
      const paramsTemp = _.cloneDeep(params);
      delete paramsTemp["invoice_type"];
      if (paramsTemp.limit === 10) {
        delete paramsTemp["limit"];
      }
      Object.keys(paramsTemp).map(function (key) {
        paramsTemp[key] === "" ? delete paramsTemp[key] : null;
      });
      if (isDifferenceObj(searchParams, paramsTemp)) {
        if (parseInt(paramsTemp.page) === 1) {
          delete paramsTemp["page"];
        }
        if (isTemp) {
          delete paramsTemp["status"];
        }
        setSearchParams(paramsTemp);
      }
    }
    return () => {
      abortController.abort();
    };
  }, [params]);

  const titleActions: ITitleActions = {
    actions: [
      ...(!isReturn
        ? [
            {
              title: "Tạo phiếu xuất kho",
              callback: () => {
                // setDataEdit(null);
                // setShowModalAdd(true);
              },
            },
          ]
        : []),
    ],
    actions_extra: [
      ...(!isTemp
        ? [
            {
              title: "Nhập phiếu xuất kho",
              icon: <Icon name="Download" />,
              callback: () => undefined,
            },
          ]
        : []),
      ...(!isReturn && !isTemp
        ? [
            {
              title: "Xuất phiếu xuất kho",
              icon: <Icon name="Upload" />,
              callback: () => undefined,
            },
          ]
        : []),
    ],
  };
  const actionsTable = (item: IInvoiceWarehouseResponse): IAction[] => [
    ...(item.status === "done"
      ? [
          {
            title: "Xem chi tiết",
            icon: <Icon name="Eye" />,
            callback: () => {
              // setIdDetail(item.id);
              // setShowModalAdd(true);
            },
          },
          {
            title: "In phiếu xuất kho",
            icon: <Icon name="Upload"  />,
            callback: () => {
              // showDialogConfirmStopBusiness(item, "delete");
            },
          },
         
        ]
      : []),

      ...(item.status === "pending"
      ? [
          {
            title: "Xem chi tiết",
            icon: <Icon name="Eye" />,
            callback: () => {
              // setIdDetail(item.id);
              // setShowModalAdd(true);
            },
          },
          // {
          //   title: "Sửa phiếu xuất kho",
          //   icon: <Icon name="Pencil" />,
          //   callback: () => {
          //     // setIdEdit(item.id);
          //     // setShowModalAdd(true);
          //   },
          // },
          {
            title: "Xác nhận xuất kho",
            icon: <Icon name="CheckedCircle" />,
            callback: () => {
              // setIdEdit(item.id);
              // setShowModalAdd(true);
            },
          },

          {
            title: "Hủy phiếu",
            icon: <Icon name="Trash" className="icon-error"  />,
            callback: () => {
              // showDialogConfirmStopBusiness(item, "delete");
            },
          },
          
        ]
      : []),
      ...(item.status === "temp"
      ? [
          {
            title: "Xem chi tiết",
            icon: <Icon name="Eye" />,
            callback: () => {
              // setIdDetail(item.id);
              // setShowModalAdd(true);
            },
          },
          {
            title: "Xuất kho",
            icon: <Icon name="Import" />,
            callback: () => {
              // setIdEdit(item.id);
              // setShowModalAdd(true);
            },
          },
          {
            title: "Hủy phiếu",
            icon: <Icon name="Trash" className="icon-error"  />,
            callback: () => {
              // showDialogConfirmStopBusiness(item, "delete");
            },
          },
          
        ]
      : []),
      ...(item.status === "delivery"
      ? [
          {
            title: "Xem chi tiết",
            icon: <Icon name="Eye" />,
            callback: () => {
              // setIdDetail(item.id);
              // setShowModalAdd(true);
            },
          },
           {
            title: "In phiếu xuất kho",
            icon: <Icon name="Upload"  />,
            callback: () => {
              // showDialogConfirmStopBusiness(item, "delete");
            },
          },
          {
            title: "Hủy phiếu",
            icon: <Icon name="Trash" className="icon-error"  />,
            callback: () => {
              // showDialogConfirmStopBusiness(item, "delete");
            },
          },
          
        ]
      : []),
      ...(item.status === "cancel"
      ? [
          {
            title: "Xem chi tiết",
            icon: <Icon name="Eye" />,
            callback: () => {
              // setIdDetail(item.id);
              // setShowModalAdd(true);
            },
          },
        ]
      : []),
  ];

  const titles = [
    "Mã Phiếu",
    "Ngày tạo",
    "Người tạo",
    "Lý do tạo",
    "Số lượng mặt hàng",
    "Trạng thái",
    "Hoạt động"
  ];

  const dataMappingArray = (item: IInvoiceWarehouseResponse) => [
    item.code,
    ...(isReturn ? [item.created_at] : []),
    formatDate(item.created_at,'DD/MM/YYYY'),
    item.created_by,
    item.reason,
    item.quantity,

    <div className="list-status" key={`invoice-status-${item.id}`}>
      <Badge
        text={item.status && item.status === 'done'
        ? 'Hoàn thành'
        : item.status && item.status === 'pending'
        ? item.type === 'import'
          ? 'Chờ nhập hàng'
          : 'Chờ xuất hàng'
        : item.status && item.status === 'temp'
        ? 'Lưu tạm'
        : item.status && item.status === 'delivery'
        ? 'Đã xuất kho'
        : 'Đã huỷ'}
        variant={item.status === "done" ? "success"  
        : item.status === "pending" || item.status === 'delivery' ? "primary" 
        : item.status === 'temp' ? 'warning'
        :"error"
        } 
       />
    </div>,
  ];
  

  const dataFormat = ["", "", "text-left", "text-center", "text-center", "text-center", "", ];

  const bulkActionList: BulkActionItemModel[] = [
    {
      title: "Ngừng kinh doanh",
      callback: () => undefined,
    },
    {
      title: "Tiếp tục kinh doanh",
      callback: () => undefined,
    },
  ];
  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction
        title={isImport ? "Danh sách phiếu nhập kho" : isExport ? "Danh sách phiếu xuất kho" : " "}
        titleActions={titleActions}
      />
      {console.log(params)}
      <div className="card-box d-flex flex-column">
        <SearchBox
          name="Đơn hàng"
          placeholderSearch="Tìm kiếm phiếu nhập kho, người tạo"
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={invoiceWarehouse}
          isShowFilterList={true}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew) ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew) : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={isImport ? "Phiếu nhập kho" : isExport ? "Phiếu xuất kho" : " "}
            titles={titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            bulkActionItems={bulkActionList}
            listIdChecked={listIdChecked}
            striped={true}
            setListIdChecked={(listId) => setListIdChecked(listId)}
            actions={actionsTable}
            actionType="inline"
            
          />
        ) : isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {isNoItem ? (
              <SystemNotification
                description={
                  <span>
                    Hiện tại nhà thuốc chưa có hóa đơn {isImport ? "nhập kho" : isExport ? "xuất kho" : ""}
                    {isImport ? " lưu tạm" : ""} nào. <br />
                    {!isReturn ? `Hãy thêm mới hóa đơn bán hàng ${isTemp ? "lưu tạm" : ""} đầu tiên nhé!` : ""}
                  </span>
                }
                type="no-item"
                titleButton={isImport ? `Tạo phiếu nhập kho` : isExport ? `Tạo phiếu xuất kho` : null}
                action={() => {
                  // if (!isReturn) {
                  //   setDataEdit(null);
                  //   setShowModalAdd(true);
                  // }
                }}
              />
            ) : (
              <SystemNotification
                description={
                  <span>
                    Không có dữ liệu trùng khớp.
                    <br />
                    Bạn hãy thay đổi tiêu chí lọc hoặc tìm kiếm nhé!
                  </span>
                }
                type="no-result"
              />
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export function InvoiceWarehouseExporttReturn() {
  return <InvoiceWarehouseExport isReturn={true} />;
}

export function InvoiceWarehouseExportTemp() {
  return <InvoiceWarehouseExport isTemp={true} />;
}
