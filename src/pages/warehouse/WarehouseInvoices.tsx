import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import { IAction, IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import BoxTable from "components/boxTable/boxTable";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { IUser } from "model/user/response/UserResponseModel";
import Badge from "components/badge/badge";
import WarehouseService from "services/WarehouseService";
import { isDifferenceObj, showToast } from "utils/common";
import { warehouseInvoiceExportStatus, warehouseInvoiceImportStatus } from "model/warehouse/DataModelInitial";
import { IWarehouseInvoiceResponse } from "model/warehouse/response/WarehouseInvoiceResponseModel";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import { ExportPdf } from "exports/pdf";
import TableDocDefinition from "exports/pdf/table";
import ExportModal from "components/exportModal/exportModal";

export default function WarehouseInvoices({ isImport = true, isCheck = false, isCancle = false }) {
  document.title = isImport
    ? "Phiếu nhập kho"
    : isCheck
    ? "Kiểm kho"
    : isCancle
    ? "Hóa đơn xuất hủy"
    : "Phiếu xuất kho";
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [listCheckInvoice, setListCheckInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: isImport
        ? "Tất cả phiếu nhập kho"
        : isCheck
        ? "Kiểm kho"
        : isCancle
        ? "Hóa đơn xuất hủy"
        : "Tất cả phiếu xuất kho",
      is_active: true,
    },
  ]);

  const invoiceWarehouse: IFilterItem[] = useMemo(
    () => [
      {
        key: "status",
        name: "Trạng thái",
        type: "radio",
        is_featured: true,
        list: Object.keys(isImport ? warehouseInvoiceImportStatus : warehouseInvoiceExportStatus).map(function (key) {
          return {
            value: key,
            label: isImport ? warehouseInvoiceImportStatus[key] : warehouseInvoiceExportStatus[key],
          };
        }),
        value: searchParams.get("status") ?? "",
      },
      {
        key: "created_by",
        name: "Người tạo",
        type: "select",
        list: [],
        value: searchParams.get("created_by") ?? "",
      },
      {
        key: "created_at",
        name: "Thời gian",
        type: "date-two",
        is_featured: true,
        list: [],
        value: searchParams.get("from_date") ?? "",
        value_extra: searchParams.get("to_date") ?? "",
      },
    ],
    [searchParams, isImport]
  );

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    type: isImport ? "import" : "export",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
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
    const response = await WarehouseService.filterInvoices(paramsSearch, abortController.signal);
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
      if (
        !isDifferenceObj(params, { query: "", page: 1, type: isImport ? "import" : "export" }) &&
        +result.total === 0
      ) {
        setIsNoItem(true);
      }
      0;
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const paramsTemp = _.cloneDeep(params);
    searchParams.forEach(async (key, value) => {
      paramsTemp[value] = key;
    });
    setParams((prevParams) => ({ ...prevParams, ...paramsTemp }));
  }, []);

  const getList = async (paramsSearch) => {
    const res = await WarehouseService.getCheck(paramsSearch, abortController.signal);

    setListCheckInvoice(res.RESULT);
  };
  useEffect(() => {
    getList(params);
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      getListCategoryGroup(params);
      const paramsTemp = _.cloneDeep(params);
      delete paramsTemp["type"];
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
        setSearchParams(paramsTemp);
      }
    }
    return () => {
      abortController.abort();
    };
  }, [params]);

  const titleActions: ITitleActions = {
    actions: [
      ...(isImport
        ? [
            {
              title: `Tạo phiếu ${
                isImport && !isCheck && !isCancle ? "nhập kho" : isCheck ? "kiểm kho" : isCancle ? "xuất hủy" : ""
              }`,
              callback: () => undefined,
            },
          ]
        : []),
    ],
    actions_extra: [
      {
        title:
          isImport && !isCheck && !isCancle
            ? "Xuất phiếu nhập kho"
            : isCheck
            ? "Xuất phiếu kiểm kho"
            : isCancle
            ? "Xuất phiếu xuất hủy"
            : "Xuất phiếu xuất kho",
        icon: <Icon name="Download" />,
        // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
        callback: () => !isLoading && setOnShowModalExport(true),
      },
      {
        title:
          isImport &&  !isCheck && !isCancle
            ? "Nhập phiếu nhập kho"
            : isCheck
            ? "Nhập phiếu kiểm kho"
            : isCancle
            ? "Nhập phiếu xuất hủy"
            : "Nhập phiếu xuất kho",
        icon: <Icon name="Upload" />,
        callback: () => undefined,
      },
    ],
  };

  const actionsTable = (item: IWarehouseInvoiceResponse): IAction[] => [
    {
      title: "Xem chi tiết",
      icon: <Icon name="Eye" />,
      callback: () => undefined,
    },
    ...(item.status === "pending" && isImport
      ? [
          {
            title: "Sửa phiếu nhập kho",
            icon: <Icon name="Pencil" />,
            callback: () => undefined,
          },
        ]
      : []),
    ...(item.status === "pending" && !isImport
      ? [
          {
            title: "Xác nhận xuất kho",
            icon: <Icon name="CheckedCircle" className="icon-success" />,
            callback: () => undefined,
          },
        ]
      : []),
    ...(item.status === "done" || (item.status === "delivery" && !isImport)
      ? [
          {
            title: isImport ? "In phiếu nhập kho" : "In phiếu xuất kho",
            icon: <Icon name="Print" />,
            callback: () => undefined,
          },
        ]
      : []),
    ...(item.status === "temp" && isImport
      ? [
          {
            title: "Nhập kho",
            icon: <Icon name="Upload" />,
            callback: () => undefined,
          },
        ]
      : []),
    ...(item.status !== "done" && item.status !== "cancel"
      ? [
          {
            title: "Hủy phiếu",
            icon: <Icon name="Trash" className="icon-error" />,
            callback: () => undefined,
          },
        ]
      : []),
  ];

  const titles = [
    ...(!isCheck && !isCheck && !isCancle
      ? [
          "Mã Phiếu",
          "Ngày tạo",
          isImport ? "Ngày nhập kho" : "Ngày xuất kho",
          "Người tạo",
          "Lý do tạo",
          "Số lượng mặt hàng",
          "Trạng thái",
        ]
      : []),
    ...(isImport && isCheck ? ["Mã phiếu", "Ngày tạo", "Người tạo", "Ghi chú", "Trạng thái"] : []),
    ...(isImport && isCancle
      ? [
          "Mã HĐ",
          "Loại HĐ",
          "Tổng tiền (VNĐ)",
          "VAT (VNĐ)",
          "Giảm giá (VNĐ)",
          "Đã thanh toán (VNĐ)",
          "Công nợ (VNĐ)",
          "Trạng thái",
          "Ngày tạo",
        ]
      : []),
  ];

  const dataMappingArray = (item: IWarehouseInvoiceResponse, type?: string) => {
    if (isImport && !isCheck && !isCancle) {
      return [
        item.code,
        moment(item.created_at).format("DD/MM/YYYY"),
        moment(item.date ?? item.created_at).format("DD/MM/YYYY"),
        item.created_by,
        item.reason,
        item.quantity,
        ...(type !== "export"
          ? [
              <div className="list-status" key={`invoice-status-${item.id}`}>
                <Badge
                  text={
                    isImport ? warehouseInvoiceImportStatus[item.status] : warehouseInvoiceExportStatus[item.status]
                  }
                  variant={
                    item.status === "done"
                      ? "success"
                      : item.status === "pending" || item.status === "delivery"
                      ? "primary"
                      : item.status === "temp"
                      ? "warning"
                      : "error"
                  }
                />
              </div>,
            ]
          : [isImport ? warehouseInvoiceImportStatus[item.status] : warehouseInvoiceExportStatus[item.status]]),
      ];
    } else if (isImport && isCheck) {
      return [
        item.code,
        moment(item.created_at).format("DD/MM/YYYY"),
        item.creator,
        item.note,
        ...(type !== "export"
          ? [
              <div className="list-status" key={`invoice-status-${item.id}`}>
                <Badge
                  text={isImport && isCheck ? "Hoàn thành" : warehouseInvoiceExportStatus[item.status]}
                  variant={
                    item.status
                      ? "success"
                      : item.status === "pending" || item.status === "delivery"
                      ? "primary"
                      : item.status === "temp"
                      ? "warning"
                      : "error"
                  }
                />
              </div>,
            ]
          : [isImport ? warehouseInvoiceImportStatus[item.status] : warehouseInvoiceExportStatus[item.status]]),
      ];
    } else {
      return [
        item.code,
        moment(item.created_at).format("DD/MM/YYYY"),
        moment(item.date ?? item.created_at).format("DD/MM/YYYY"),
        item.created_by,
        item.reason,
        item.quantity,
        ...(type !== "export"
          ? [
              <div className="list-status" key={`invoice-status-${item.id}`}>
                <Badge
                  text={
                    isImport ? warehouseInvoiceImportStatus[item.status] : warehouseInvoiceExportStatus[item.status]
                  }
                  variant={
                    item.status === "done"
                      ? "success"
                      : item.status === "pending" || item.status === "delivery"
                      ? "primary"
                      : item.status === "temp"
                      ? "warning"
                      : "error"
                  }
                />
              </div>,
            ]
          : [isImport ? warehouseInvoiceImportStatus[item.status] : warehouseInvoiceExportStatus[item.status]]),
      ];
    }
  };

  const dataFormat = ["", "", "", "", "", "text-center", "text-center"];

  //Export
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả hóa đơn ${isImport ? "nhập kho" : isCheck ? "kiểm kho" : isCancle ? "xuất hủy" : "xuất kho"}`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} hóa đơn ${
          isImport ? "nhập kho" : isCheck ? "kiểm kho" : isCancle ? "xuất hủy" : "xuất kho"
        } phù hợp với kết quả tìm kiếm hiện tại`,
        disabled:
          pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", type: isImport ? "import" : "export" }),
      },
    ],
    [isImport, pagination, params]
  );

  const exportCallback = async (type, extension) => {
    const response = await WarehouseService.exportInvoices({ ...params, type_export: type });
    console.log("export", response);
    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: !isImport
            ? "HoaDonXuatKho"
            : isCheck
            ? "HoaDonKiemKho"
            : isCancle
            ? "HoaDonXuatHuy"
            : "HoaDonNhapKho",
          title: !isImport
            ? "Danh sách hóa đơn xuất kho"
            : isCheck
            ? "Danh sách hóa đơn kiểm kho"
            : isCancle
            ? "Danh sách hóa đơn xuất hủy"
            : "Danh sách hóa đơn nhập kho",
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item, "export")),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: !isImport
              ? "Danh sách hóa đơn xuất kho"
              : isCheck
              ? "Danh sách hóa đơn kiểm kho"
              : isCancle
              ? "Danh sách hóa đơn xuất hủy"
              : "Danh sách hóa đơn nhập kho",
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item, "export")),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
            },
          }),
          !isImport ? "HoaDonXuatKho" : isCheck ? "HoaDonKiemKho" : isCancle ? "HoaDonXuatHuy" : "HoaDonNhapKho"
        );
      }
      showToast("Xuất file thành công", "success");
      setOnShowModalExport(false);
    } else {
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
      setOnShowModalExport(false);
    }
  };

  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction
        title={
          !isImport
            ? "Danh sách hóa đơn xuất kho"
            : isCheck
            ? "Kiểm kho"
            : isCancle
            ? "hóa đơn xuất hủy"
            : "Danh sách hóa đơn nhập kho"
        }
        titleActions={titleActions}
      />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={
            !isImport ? "Phiếu xuất kho" : isCheck ? "Phiếu kiểm kho" : isCancle ? "Phiếu xuất hủy" : "Phiếu nhập kho"
          }
          placeholderSearch={
            !isImport
              ? "Tìm kiếm phiếu xuất kho"
              : isCheck
              ? "Tìm kiếm phiếu kiểm kho"
              : isCancle
              ? "Tìm kiếm phiếu xuất hủy"
              : "Tìm kiếm phiếu nhập kho"
          }
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={invoiceWarehouse}
          isShowFilterList={true}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew)
              ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)
              : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={isImport ? "Phiếu nhập kho" : "Phiếu xuất kho"}
            titles={titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            striped={true}
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
                    Hiện tại nhà thuốc chưa có hóa đơn {isImport ? "nhập kho" : "xuất kho"} nào. <br />
                    {isImport ? "Hãy thêm mới hóa đơn nhập kho đầu tiên nhé!" : ""}
                  </span>
                }
                type="no-item"
                titleButton={isImport ? "Tạo phiếu nhập kho" : ""}
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
      <ExportModal
        name={isImport ? "Nhập kho" : "Xuất kho"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </div>
  );
}

export function WarehouseInvoicesExport() {
  return <WarehouseInvoices isImport={false} />;
}
export function WarehouseInvoicesCheck() {
  return <WarehouseInvoices isCheck={true} />;
}
export function WarehouseInvoicesCancle() {
  return <WarehouseInvoices isCancle={true} />;
}
