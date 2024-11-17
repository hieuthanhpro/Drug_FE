import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import BoxTable from "components/boxTable/boxTable";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import _ from "lodash";
import { IUser } from "model/user/response/UserResponseModel";
import InvoiceService from "services/InvoiceService";
import { IInvoice } from "model/invoice/response/InvoiceResponseModel";
import moment from "moment";
import Badge from "components/badge/badge";
import { saleInvoiceStatus } from "model/invoice/DataModelInitial";
import ExportModal from "components/exportModal/exportModal";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";

export default function SalesInvoices({ isReturn = false, isTemp = false, isMoney = false, isHistorical = false }) {
  document.title = isReturn
    ? "Hóa đơn khách trả hàng"
    : isTemp
    ? "Hóa đơn bán hàng lưu tạm"
    : isMoney
    ? "Thống kê doanh thu"
    : isHistorical
    ? "Lịch sử bán hàng"
    : "Hóa đơn bán hàng";
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  // const [dataDetail, setDataDetail] = useState<IGroup | ICategory>(null);
  // const [onShowModalDetail, setOnShowModalDetail] = useState<boolean>(false);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Tất cả hóa đơn",
      is_active: true,
    },
  ]);

  const salesInvoicesFilter: IFilterItem[] = useMemo(
    () =>
      !isMoney
        ? [
            ...((!isTemp && !isReturn && !isMoney
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
              key: "created_by",
              name: "Dược sĩ",
              type: "select",
              list: [],
              value: searchParams.get("created_by") ?? "",
            },
            !isHistorical && {
              key: "customer",
              name: "Khách hàng",
              type: "select",
              is_featured: true,
              list: [],
              value: searchParams.get("customer") ?? "",
            },
            {
              key: "date",
              name: isReturn ? "Ngày trả hàng" : isHistorical ? "Ngày" : "Ngày bán",
              type: "date-two",
              is_featured: true,
              list: [],
              value: searchParams.get("from_date") ?? "",
              value_extra: searchParams.get("to_date") ?? "",
            },
            {
              key: "sale",
              name: "Sale bán hàng",
              type: "select",
              list: [],
              value: searchParams.get("sale") ?? "",
              params: { user_role: "sale" },
            },
          ]
        : [
            [] as IFilterItem[],
            {
              key: "date",
              name: isReturn ? "Ngày trả hàng" : "Ngày bán",
              type: "date-two",
              is_featured: true,
              list: [],
              value: searchParams.get("from_date") ?? "",
              value_extra: searchParams.get("to_date") ?? "",
            },
          ],
    [searchParams, isReturn, isTemp]
  );

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    invoice_type: isReturn ? "IV3" : "IV1",
    ...(isTemp ? { status: "temp" } : {}),
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: isReturn ? "Hóa đơn khách trả hàng" : isTemp ? "Hóa đơn bán hàng lưu tạm" : isHistorical ? "Lịch sử bán hàng" : "Hóa đơn bán hàng",
    isChooseSizeLimit: true,
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
    chooseSizeLimit: (limit) => {
      setParams((prevParams) => ({ ...prevParams, limit: limit }));
    },
  });

  const abortController = new AbortController();
  const getListSalesInvoices = async (paramsSearch) => {
    setIsLoading(true);
    let response = null;
    response = await InvoiceService.filter(paramsSearch, abortController.signal);
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
      if (!isDifferenceObj(params, { query: "", invoice_type: isReturn ? "IV3" : "IV1" }) && +result.total === 0) {
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
    setParams((prevParams) => ({ ...prevParams, ...paramsTemp }));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      getListSalesInvoices(params);
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
    actions: !isMoney
      ? [
          ...(!isReturn && !isHistorical
            ? [
                {
                  title: "Tạo hóa đơn",
                  callback: () => {
                    navigate("/sales/create");
                    // setDataEdit(null);
                    // setShowModalAdd(true);
                  },
                },
              ]
            : []),
        ]
      : [],
    actions_extra: [
      ...(!isTemp
        ? [
            {
              title: "Xuất danh sách",
              icon: <Icon name="Download" />,
              // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
              //Không có hóa đơn thì export ra file rỗng
              callback: () => !isLoading && setOnShowModalExport(true),
            },
          ]
        : []),
      ...(!isReturn && !isTemp && !isHistorical
        ? [
            {
              title: "Nhập danh sách",
              icon: <Icon name="Upload" />,
              callback: () => undefined,
            },
          ]
        : []),
    ],
  };

  const titles = [
    !isMoney ? "Mã HĐ" : "Ngày",
    ...(isReturn ? ["Mã HĐ bán hàng"] : isMoney ? ["Thu tiền mặt"] : []),
    !isMoney ? "Khách hàng" : "Thu qua Chuyển khoản/Ví/Thẻ",
    ...(isReturn ? [] : isMoney ? ["Doanh thu bán trực tiếp"] : ["SĐT"]),
    !isMoney ? "Tổng tiền" : "Doanh thu bán Online/COD",
    !isMoney ? "Giảm giá" : "Tổng VAT",
    ...(!isTemp && !isMoney ? ["Đã thanh toán", "Công nợ"] : isMoney ? ["Doanh thu trước giảm giá"] : []),
    !isMoney ? "DS xuất bán" : "Giảm giá",
    !isMoney ? "Sale bán hàng" : "Doanh thu chưa công nợ",
    !isMoney ? "Trạng thái" : "Công nợ",
    ...(isReturn ? ["Ngày trả hàng"] : isTemp ? ["Ngày tạo"] : isMoney ? ["Tổng doanh thu"] : ["Ngày bán"]),
  ];
  const titleHistorical = ["Mã hóa đơn", "Tổng tiền thanh toán", "Ngày thanh toán", "Khách hàng", "Hình thức thanh toán", "Trạng thái"];

  const dataMappingArray = (item: IInvoice, type?: string) => [
    item.invoice_code,
    ...(isReturn ? [item.ref_invoice_code] : []),
    item.is_order ? item.supplier_name : item.customer_name || "Khách lẻ",
    ...(isReturn ? [] : [item.is_order ? item.supplier_phone : item.customer_phone || ""]),
    formatCurrency(+item.amount + +item.vat_amount, ","),
    formatCurrency(+item.discount + +item.discount_promotion, ","),
    ...(!isTemp
      ? [
          formatCurrency(+item.pay_amount, ","),
          formatCurrency(
            +item.amount + +item.vat_amount - item.discount - item.pay_amount - (item.discount_promotion ?? 0) > 0
              ? +item.amount + +item.vat_amount - item.discount - item.pay_amount - (item.discount_promotion ?? 0)
              : 0,
            ","
          ),
        ]
      : []),
    item.created_name,
    item.sale_name,
    ...(type !== "export"
      ? [
          <div className="list-status" key={`invoice-status-${item.id}`}>
            <Badge
              text={saleInvoiceStatus[item.status]}
              variant={item.status === "done" ? "success" : item.status === "processing" ? "primary" : item.status === "temp" ? "warning" : "error"}
            />
            {item.has_return ? <Badge text="Trả hàng" variant="warning" /> : null}
          </div>,
        ]
      : [`${saleInvoiceStatus[item.status]}${item.has_return ? ", Trả hàng" : ""}`]),
    moment(item.receipt_date).format("DD/MM/YYYY"),
  ];

  const dataFormat = ["", "", "", "text-right", "text-right", ...(!isTemp ? ["text-right", "text-right"] : []), "", "text-center", "text-center"];

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
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", invoice_type: params["invoice_type"] }),
      },
    ],
    [pagination, params]
  );

  const exportCallback = useCallback(
    async (type, extension) => {
      const response = await InvoiceService.export({ ...params, type_export: type });
      if (response?.result?.data) {
        if (extension === "excel") {
          ExportExcel({
            fileName: isTemp ? "HoaDonBanHangLuuTam" : isReturn ? "HoaDonKhachTraHang" : "HoaDonBanHang",
            title: isTemp ? "Hóa đơn bán hàng lưu tạm" : isReturn ? "Hóa đơn khách trả hàng" : "Hóa đơn bán hàng",
            header: titles,
            data: response?.result?.data.map((item) => dataMappingArray(item, "export")),
            info: { name, drug_store },
          });
        } else {
          ExportPdf(
            TableDocDefinition({
              info: { name, drug_store },
              title: isTemp ? "Hóa đơn bán hàng lưu tạm" : isReturn ? "Hóa đơn khách trả hàng" : "Hóa đơn bán hàng",
              header: titles,
              items: response?.result?.data.map((item) => dataMappingArray(item, "export")),
              mapFooter: undefined,
              customFooter: undefined,
              options: {
                smallTable: true,
              },
            }),
            isTemp ? "HoaDonBanHangLuuTam" : isReturn ? "HoaDonKhachTraHang" : "HoaDonBanHang"
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
  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction
        title={
          isReturn
            ? "Hóa đơn khách trả hàng"
            : isTemp
            ? "Hóa đơn bán hàng lưu tạm"
            : isMoney
            ? "Thống kê doanh thu"
            : isHistorical
            ? "Lịch sử bán hàng"
            : "Hóa đơn bán hàng"
        }
        titleActions={titleActions}
      />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={!isMoney ? "Đơn hàng" : "Doanh thu"}
          placeholderSearch="Tìm kiếm mã hóa đơn, mã thuốc/tên thuốc, số lô"
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={salesInvoicesFilter}
          // isShowFilterList={true}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew) ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew) : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={isReturn ? "Hóa đơn khách trả hàng" : isTemp ? "Hóa đơn bán hàng lưu tạm" : "Hóa đơn bán hàng"}
            titles={isHistorical ? titleHistorical : titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            striped={true}
          />
        ) : isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {isNoItem ? (
              <SystemNotification
                description={
                  <span>
                    Hiện tại nhà thuốc chưa có hóa đơn {isReturn ? "trả hàng" : "bán hàng"}
                    {isTemp ? " lưu tạm" : ""} nào. <br />
                    {!isReturn ? `Hãy thêm mới hóa đơn bán hàng ${isTemp ? "lưu tạm" : ""} đầu tiên nhé!` : ""}
                  </span>
                }
                type="no-item"
                titleButton={!isReturn && !isHistorical ? `Tạo hóa đơn bán hàng` : null}
                action={() => {
                  navigate("/sales/create");
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
        name={isTemp ? "Hóa đơn bán hàng lưu tạm" : isReturn ? "Hóa đơn khách trả hàng" : "Hóa đơn bán hàng"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </div>
  );
}

export function SalesInvoicesReturn() {
  return <SalesInvoices isReturn={true} />;
}

export function SalesInvoicesTemp() {
  return <SalesInvoices isTemp={true} />;
}
export function SalesInvoicesMoney() {
  return <SalesInvoices isMoney={true} />;
}
export function SalesHistorical() {
  return <SalesInvoices isHistorical={true} />;
}
