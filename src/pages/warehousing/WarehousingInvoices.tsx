import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import BoxTable from "components/boxTable/boxTable";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { IAction, IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import _ from "lodash";
import { IUser } from "model/user/response/UserResponseModel";
import InvoiceService from "services/InvoiceService";
import { IInvoice } from "model/invoice/response/InvoiceResponseModel";
import moment from "moment";
import Badge from "components/badge/badge";
import { warehousingInvoiceStatus } from "model/invoice/DataModelInitial";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";
import ExportModal from "components/exportModal/exportModal";
import { sortDrugList, sortWarehousingStatistic } from "model/drug/DataModelInitial";
import WarehouseService from "services/WarehouseService";
import { useCookies } from "react-cookie";
import SalesInvoiceDetail from "pages/sales/partials/SalesInvoiceDetail";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import SalesReturn from "../sales/partials/SalesReturn";

export default function WarehousingInvoices({ isReturn = false, isTemp = false, isStatistical = false }) {
  document.title = isReturn
    ? "Hóa đơn trả hàng NCC"
    : isTemp
    ? "Hóa đơn nhập hàng lưu tạm"
    : isStatistical
    ? "Thống kê nhập hàng"
    : "Hóa đơn nhập hàng";
  const { name, drug_store } = useContext(UserContext) as ContextType;

  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [listSumdata, setListSumData] = useState(null);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const [itemDetailId, setItemDetailId] = useState(null);
  const [onShowModalDetail, setOnShowModalDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [showModalReturn, setShowModalReturn] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<any>(null);
  const showDialogConfirm = (id, type?: "deleteTemp") => {
    const contentDialog: IContentDialog = {
      className: "dialog-confirm",
      isCentered: true,
      isLoading: true,
      title: `Xác nhận ${type === "deleteTemp" ? "xóa" : "hủy"} hóa đơn`,
      message: `Bạn có chắc chắn ${type === "deleteTemp" ? "xóa hóa đơn" : "hủy hóa đơn"}  ${
        type !== "deleteTemp" ? (isReturn ? "trả hàng" : "nhập hàng") : ""
      }?`,
      cancelText: "Hủy",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => (type === "deleteTemp" ? handleDeleteTemp(id) : handleCancelInvoice(id)),
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };
  const handleCancelInvoice = async (id) => {
    const body = {
      id: id,
      status: "cancel",
    };
    let res = null;
    if (isReturn) {
      res = await WarehouseService.updateStatus(body);
    } else {
      res = await InvoiceService.updateInvoiceStatus(body);
    }
    res.code === 200
      ? showToast(`Hủy hóa đơn ${isReturn ? "trả hàng" : "nhập hàng"} thành công`, "success")
      : showToast("Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    setShowDialog(false);
    setUpdateStatus(!updateStatus);
  };

  const handleDeleteTemp = async (id) => {
    const res = await WarehouseService.deleteTemp(id);
    res.code === 200
      ? showToast(`Xóa hóa đơn lưu tạm thành công`, "success")
      : showToast("Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    setShowDialog(false);
    setUpdateStatus(!updateStatus);
  };
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Tất cả hóa đơn",
      is_active: true,
      params: [
        {
          key: "invoice_type",
          value: "IV2",
        },
      ],
    },
  ]);

  const warehousingInvoicesFilter = useMemo(
    () => [
      ...((!isTemp && !isReturn && !isStatistical
        ? [
            {
              key: "invoice_type",
              name: "Kiểu hóa đơn",
              type: "radio",
              is_featured: true,
              disabledDelete: true,
              list: [
                {
                  value: "IV2",
                  label: "Hóa đơn nhập hàng NCC",
                },
                {
                  value: "IV7",
                  label: "Hóa đơn nhập hàng tồn",
                },
              ],
              value:
                searchParams.get("invoice_type") && ["IV2", "IV7"].includes(searchParams.get("invoice_type"))
                  ? searchParams.get("invoice_type")
                  : "IV2",
            },
          ]
        : []) as IFilterItem[]),
      ...((!isTemp && !isReturn && !isStatistical
        ? [
            {
              key: "status",
              name: "Trạng thái",
              type: "radio",
              is_featured: true,
              list: Object.keys(warehousingInvoiceStatus)
                .map(function (key) {
                  return {
                    value: key,
                    label: warehousingInvoiceStatus[key],
                  };
                })
                .filter((item) => item.value !== "temp"),
              value: searchParams.get("status") ?? "",
            },
          ]
        : []) as IFilterItem[]),
      ...(isStatistical
        ? [
            {
              key: "date",
              name: "Thời gian",
              type: "date-two",
              is_featured: true,
              list: [],
              value: searchParams.get("from_date") ?? moment().add(-1, "months").format("YYYY-MM-DD"),
              value_extra: searchParams.get("to_date") ?? moment().format("YYYY-MM-DD"),
            },
          ]
        : ([
            {
              key: "supplier_id",
              name: "Nhà cung cấp",
              type: "select",
              is_featured: true,
              list: [],
              value: searchParams.get("supplier_id") ?? "",
            },
            {
              key: "date",
              name: isReturn ? "Ngày trả hàng" : "Ngày nhập",
              type: "date-two",
              is_featured: isReturn ? true : false,
              list: [],
              value: searchParams.get("from_date") ?? "",
              value_extra: searchParams.get("to_date") ?? "",
            },
          ] as IFilterItem[])),
    ],
    [searchParams, isReturn]
  );

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    ...(!isStatistical
      ? {
          invoice_type: isReturn
            ? "IV4"
            : searchParams.get("invoice_type") && ["IV2", "IV7"].includes(searchParams.get("invoice_type"))
            ? "IV2"
            : "IV2",
        }
      : {}),
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: isReturn ? "Hóa đơn trả hàng NCC" : isTemp ? "Đơn nhập lưu tạm" : "Hóa đơn nhập hàng",
    isChooseSizeLimit: true,
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
    chooseSizeLimit: (limit) => {
      setParams((prevParams) => ({ ...prevParams, per_page: limit }));
    },
  });
  // useEffect(() => {
  //   (async () => {
  //     if (isStatistical) {
  //       const res = await WarehouseService.statistic();

  //       setListStatistic(res.RESULT.data);
  //     }
  //   })();
  // }, [isStatistical]);

  const abortController = new AbortController();
  const getListWarehousingInvoices = async (paramsSearch) => {
    setIsLoading(true);
    let response = null;
    if (isStatistical) {
      response = await WarehouseService.statistic(paramsSearch, abortController.signal);
    } else if (isTemp) {
      response = await InvoiceService.filterTemp(paramsSearch, abortController.signal);
    } else {
      response = await InvoiceService.filter(paramsSearch, abortController.signal);
    }
    if (response.code === 200) {
      const result = response.result;
      setListSumData(result.sum_data);
      setListInvoice(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (+result.total === 0 && params.query === "" && +params.page === 1) {
        setIsNoItem(true);
      }
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
    if (
      (!paramsTemp["invoice_type"] || !["IV2", "IV7"].includes(paramsTemp["invoice_type"])) &&
      !isTemp &&
      !isReturn &&
      !isStatistical
    ) {
      paramsTemp["invoice_type"] = "IV2";
    } else {
      delete paramsTemp["invoice_type"];
    }
    setParams((prevParams) => ({ ...prevParams, ...paramsTemp }));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      getListWarehousingInvoices(params);
      const paramsTemp = _.cloneDeep(params);
      if (paramsTemp)
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
        if (!["IV2", "IV7"].includes(paramsTemp["invoice_type"]) || isStatistical || isReturn) {
          delete paramsTemp["invoice_type"];
        }
        setSearchParams(paramsTemp);
      }
    }
    return () => {
      abortController.abort();
    };
  }, [params, updateStatus]);

  const titleActions: ITitleActions = {
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
      },
      ...(cookies?.drugStore?.type === "GPP"
        ? []
        : [
            {
              title: "Nhập danh sách",
              icon: <Icon name="Upload" />,
              callback: () => undefined,
            },
          ]),
    ],
  };

  const titles = [
    ...(isStatistical ? ["Ngày nhập hàng", "Ngày hóa đơn"] : []),
    ...(!isTemp ? ["Mã HĐ"] : []),
    ...(params?.invoice_type !== "IV7" && !isStatistical && !isTemp ? ["Mã đơn đặt hàng", "Nhà cung cấp"] : []),
    ...(isReturn ? ["VAT"] : []),
    ...(!isReturn && !isStatistical && !isTemp ? ["VAT"] : []),
    ...(isStatistical
      ? [
          "Nhà cung cấp",
          "SĐT nhà cung cấp",
          "Mã số thuế",
          "Tổng tiền hàng trước thuế",
          "VAT",
          "Giảm giá",
          "Tổng tiền hàng sau VAT",
          "Tiền trả hàng NCC",
          "Thực trả",
          "Công nợ",
        ]
      : isTemp
      ? [
          "Nhà cung cấp",
          "Mã HĐ nhà cung cấp",
          "SĐT nhà cung cấp",
          "Tổng tiền",
          "VAT",
          "Giảm giá",
          "Công nợ",
          "Ngày tạo",
        ]
      : ["Tổng tiền", "Giảm giá", "Đã thanh toán", "Công nợ", "Trạng thái", "Ngày nhập"]),
  ];

  const dataMappingArray = (item: IInvoice, type?: string) =>
    !isStatistical && !isTemp
      ? [
          item.invoice_code,
          ...(params?.invoice_type !== "IV7" && !isTemp ? [item.order_code, item.supplier_name] : []),
          ...(!isTemp && !isStatistical && !isReturn ? [formatCurrency(item.vat_amount)] : []),
          ...(isTemp ? [item.order_code, item.supplier_name] : []),
          ...(isReturn ? [formatCurrency(item.vat_amount || item.vat)] : []),
          formatCurrency(+item.amount),
          formatCurrency(+item.discount + +item.discount_promotion, ","),
          formatCurrency(+item.pay_amount, ","),
          formatCurrency(
            +item.amount + +item.vat_amount - item.discount - item.pay_amount - (item.discount_promotion ?? 0) > 0
              ? +item.amount + +item.vat_amount - item.discount - item.pay_amount - (item.discount_promotion ?? 0)
              : 0,
            ","
          ),
          ...(isTemp
            ? []
            : type !== "export"
            ? [
                <Badge
                  key={`invoice-status-${item.id}`}
                  text={item.status === "cancel" ? "Đã hủy" : "Hoàn thành"}
                  variant={item.status === "cancel" ? "error" : "success"}
                />,
              ]
            : [warehousingInvoiceStatus[item.status]]),
          moment(item.receipt_date || item.created_at).format("DD/MM/YYYY"),
        ]
      : isTemp
      ? [
          item.supplier_name,
          "",
          item.supplier_phone,
          formatCurrency(+item.amount),
          formatCurrency(+item.vat_amount),
          formatCurrency(+item.discount),
          formatCurrency(+item.amount + +item.vat_amount - +item.discount - +item.pay_amount),
          moment(item.created_at).format("DD/MM/YYYY"),
        ]
      : [
          moment(item.receipt_date).format("DD/MM/YYYY"),
          moment(item.created_at).format("DD/MM/YYYY"),
          item.invoice_code,
          item.supplier_name,
          item.number_phone,
          item.tax_number,
          formatCurrency(item.amount),
          formatCurrency(item.vat_amount),
          formatCurrency(item.discount),
          formatCurrency(item.total_amount),
          formatCurrency(item.return_amount),
          formatCurrency(item.pay_amount),
          formatCurrency(item.debt_amount),
        ];

  const dataFormat = isStatistical
    ? [
        "",
        "",
        "",
        "",
        "text-right",
        "",
        "text-right",
        "text-right",
        "text-right",
        "text-right",
        "text-right",
        "text-right",
        "text-right",
      ]
    : isTemp
    ? ["", "", "", "text-right", "text-right", "text-right", "text-right", ""]
    : [
        "",
        ...(params?.invoice_type !== "IV7" ? ["", "", ""] : []),
        "text-right",
        "text-right",
        "text-right",
        "text-right",
        ...(!isReturn && !isStatistical && !isTemp ? ["text-center", "text-center"] : ["text-center"]),
        ...(isReturn ? ["text-center"] : []),
      ];

  //Export
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: "Tất cả hóa đơn",
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} hóa đơn phù hợp với kết quả tìm kiếm hiện tại`,
        disabled:
          pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", invoice_type: params["invoice_type"] }),
      },
    ],
    [pagination, params]
  );

  const exportCallback = useCallback(
    async (type, extension) => {
      let response = null;
      if (isTemp) {
        response = await InvoiceService.exportTemp({
          ...params,
          type_export: type,
        });
      } else {
        response = await InvoiceService.export({
          ...params,
          type_export: type,
        });
      }
      if (response?.result?.data || response?.data) {
        if (extension === "excel") {
          ExportExcel({
            fileName: isTemp
              ? "HoaDonNhapHangLuuTam"
              : isReturn
              ? "HoaDonTraHangNCC"
              : params["invoice_type"] === "IV7"
              ? "HoaDonNhapHangTon"
              : isStatistical
              ? "ThongKeNhapHang"
              : "HoaDonNhapHangNCC",
            title: isTemp
              ? "Hóa đơn nhập hàng lưu tạm"
              : isReturn
              ? "Hóa đơn trả hàng NCC"
              : params["invoice_type"] === "IV7"
              ? "Hóa đơn nhập hàng tồn"
              : isStatistical
              ? "Thống kê nhập hàng"
              : "Hóa đơn nhập hàng NCC",
            header: titles,
            data: isTemp
              ? response?.data.map((item) => dataMappingArray(item, "export"))
              : response?.result?.data.map((item) => dataMappingArray(item, "export")),
            info: { name, drug_store },
          });
        } else {
          ExportPdf(
            TableDocDefinition({
              info: { name, drug_store },
              title: isTemp
                ? "Hóa đơn nhập hàng lưu tạm"
                : isReturn
                ? "Hóa đơn trả hàng NCC"
                : params["invoice_type"] === "IV7"
                ? "Hóa đơn nhập hàng tồn"
                : isStatistical
                ? "Thống kê nhập hàng"
                : "Hóa đơn nhập hàng NCC",
              header: titles,
              items: response?.result?.data.map((item) => dataMappingArray(item, "export")),
              mapFooter: undefined,
              customFooter: undefined,
              options: {
                smallTable: true,
              },
            }),
            isTemp
              ? "HoaDonNhapHangLuuTam"
              : isReturn
              ? "HoaDonTraHangNCC"
              : params["invoice_type"] === "IV7"
              ? "HoaDonNhapHangTon"
              : isStatistical
              ? "ThongKeNhapHang"
              : "HoaDonNhapHangNCC"
          );
        }
        showToast("Xuất file thành công", "success");
        setOnShowModalExport(false);
      } else {
        showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
        setOnShowModalExport(false);
      }
    },
    [params]
  );

  const actionsTable = (item): IAction[] => {
    return [
      {
        title: "Xem chi tiết",
        icon: <Icon name="Eye" />,
        callback: () => {
          isTemp ? setItemDetailId(item?.id) : setItemDetailId(item?.id);
          setOnShowModalDetail(true);
        },
      },
      ...(isReturn
        ? [
            ...(cookies?.drugStore?.type !== "GDP" && item.status === "done"
              ? [
                  {
                    title: "Hủy hóa đơn",
                    icon: <Icon name="Trash" className="icon-error" />,
                    callback: () => {
                      showDialogConfirm(item.id);
                    },
                  },
                ]
              : []),
          ]
        : isTemp
        ? [
            {
              title: "Nhập hàng",
              icon: <Icon name="Login" />,
              callback: () => {
                navigate(`/warehousing/create/temp/${item.id}`);
              },
            },
            {
              title: "Xóa hóa đơn lưu tạm",
              icon: <Icon name="Trash" className="icon-error" />,
              callback: () => {
                showDialogConfirm(item.id, "deleteTemp");
              },
            },
          ]
        : [
            ...(+item.amount - +item.amount - +item.pay_amount !== 0 && item.payment_method === "vnpay"
              ? [
                  {
                    title: "Thanh toán qua VNPay",
                    icon: <Icon name="CreditCard" />,
                    callback: () => {
                      // setDataDetail(item?.invoice_code);
                      // setOnShowModalDetail(true);
                    },
                  },
                ]
              : +item.pay_amount - +item.amount - +item.discount > 0
              ? [
                  {
                    title: "Thanh toán công nợ",
                    icon: <Icon name="Money" />,
                    callback: () => {
                      // setDataDetail(item?.invoice_code);
                      // setOnShowModalDetail(true);
                    },
                  },
                ]
              : []),
            ...(item.status === "done"
              ? [
                  {
                    title: "Trả hàng NCC",
                    icon: <Icon name="Returns" />,
                    callback: () => {
                      // setDataDetail(item?.id);
                      // setShowModalReturn(!showModalReturn);
                      navigate(`/warehousing/return/${item?.id}`);
                    },
                  },
                  ...(cookies?.drugStore.type === "GDP"
                    ? []
                    : [
                        {
                          title: "Hủy hóa đơn",
                          icon: <Icon name="Trash" className="icon-error" />,
                          callback: () => {
                            showDialogConfirm(item.id);
                          },
                        },
                      ]),
                ]
              : []),
          ]),
    ];
  };

  const listBottomRows = [
    "TỔNG CỘNG",
    null,
    null,
    null,
    null,
    null,
    formatCurrency(+listSumdata?.amount),
    formatCurrency(+listSumdata?.vat_amount),
    formatCurrency(+listSumdata?.discount),
    formatCurrency(+listSumdata?.total_amount),
    formatCurrency(+listSumdata?.return_amount),
    formatCurrency(+listSumdata?.pay_amount),
    formatCurrency(+listSumdata?.debt_amount),
  ];

  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction
        title={
          isReturn
            ? "Hóa đơn trả hàng NCC"
            : isStatistical
            ? "Thống kê nhập hàng"
            : isTemp
            ? "Đơn nhập lưu tạm"
            : "Hóa đơn nhập hàng"
        }
        titleActions={titleActions}
      />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name="Đơn hàng"
          placeholderSearch="Tìm kiếm..."
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={warehousingInvoicesFilter}
          isShowFilterList={!isStatistical ? true : false}
          isSort={isStatistical ? true : false}
          listSort={isStatistical ? sortWarehousingStatistic : null}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew)
              ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)
              : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={
              isReturn
                ? "Hóa đơn trả hàng NCC"
                : isTemp
                ? "Hóa đơn nhập hàng lưu tạm"
                : isStatistical
                ? "Thống kê nhập hàng"
                : "Hóa đơn nhập hàng"
            }
            titles={titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            striped={true}
            actions={!isStatistical ? actionsTable : null}
            actionType="inline"
            totalRow={isStatistical ? listBottomRows : null}
          />
        ) : isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {isNoItem ? (
              <SystemNotification
                description={
                  <span>
                    Hiện tại nhà thuốc chưa có hóa đơn {isReturn ? "trả hàng nhà cung cấp" : "nhập hàng"}
                    {isTemp ? " lưu tạm" : ""} nào. <br />
                    {!isReturn ? `Hãy thêm mới hóa đơn bán hàng ${isTemp ? "lưu tạm" : ""} đầu tiên nhé!` : ""}
                  </span>
                }
                type="no-item"
                titleButton={!isReturn ? `Thêm hóa đơn nhập hàng` : null}
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
      {/* <Dialog content={contentDialog} isOpen={showDialog} /> */}
      <ExportModal
        name={
          isTemp
            ? "Hóa đơn nhập hàng lưu tạm"
            : isReturn
            ? "Hóa đơn trả hàng NCC"
            : params["invoice_type"] === "IV7"
            ? "Hóa đơn nhập hàng tồn"
            : "Hóa đơn nhập hàng"
        }
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
      <SalesInvoiceDetail
        onShow={onShowModalDetail}
        toggle={() => setOnShowModalDetail(!onShowModalDetail)}
        // code={!isTemp ? itemDetailId : null}
        id={itemDetailId}
        type="warehousing"
        isTemp={isTemp}
        isReturn={window.location.pathname === "/warehousing/returns" ? true : false}
        isReturnNCC={isReturn}
      />
      {showModalReturn && (
        <SalesReturn onShow={showModalReturn} toggle={() => setShowModalReturn(!showModalReturn)} id={dataDetail} />
      )}

      <Dialog content={contentDialog} isOpen={showDialog} />
    </div>
  );
}

export function WarehousingInvoicesReturn() {
  return <WarehousingInvoices isReturn={true} />;
}

export function WarehousingInvoicesTemp() {
  return <WarehousingInvoices isTemp={true} />;
}
export function WarehousingInvoicesStatistical() {
  return <WarehousingInvoices isStatistical={true} />;
}
