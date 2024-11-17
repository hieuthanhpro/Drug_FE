import BoxTable from "components/boxTable/boxTable";
import Icon from "components/icon";
import Loading from "components/loading";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { excelEditCell, ExportExcel, worksheetAddRow } from "exports/excel";

import { printBill } from "exports/pdf";
import { ISaleInvoiceDetail } from "model/invoice/response/SalesInvoiceModelResponse";
import { IActionModal } from "model/OtherModel";
import moment from "moment";
import QRCode from "qrcode.react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import InvoiceService from "services/InvoiceService";
import OrderService from "services/OrderService";
import { formatCurrency, showToast } from "utils/common";
import "./SalesInvoiceDetail.scss";
import SupplierService from "services/SupplierService";
import { getInvoiceDetailExcelDoc } from "exports/excel/invoice";

interface SalesInvoiceDetailProps {
  onShow: boolean;
  toggle: any;
  invoice?: any;
  id?: string;
  type?: "sales" | "warehousing" | "order" | "return";
  code?: string;
  isTemp?: boolean;
  isReturn?: boolean;
  isTest?: boolean;
  isReturnNCC?: boolean;
  invoiceTestData?: any;
  handleSubmitTest?: any;
}

export default function SalesInvoiceDetail(props: SalesInvoiceDetailProps) {
  const {
    onShow,
    toggle,
    id,
    type,
    invoice,
    code,
    isTemp,
    isReturn,
    isTest,
    invoiceTestData,
    handleSubmitTest,
    isReturnNCC,
  } = props;


  const [invoiceInfo, setInvoiceInfo] = useState<ISaleInvoiceDetail>(null);
  const [invoiceDetail, setInvoiceDetail] = useState([]);
  const [invoiceCombo, setInvoiceCombo] = useState([]);
  const [invoiceDoctor, setInvoiceDoctor] = useState([]);
  const [invoiceItem, setInvoiceItem] = useState(null);
  const [dataDoctor, setDataDoctor] = useState();
  const [typePrint, setTypePrint] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [totalBeforeVat, setTotalBeforeVat] = useState(0);

  const [cookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (invoiceDetail) {
      let totalTemp = 0;
      invoiceDetail.forEach((item) => (totalTemp += +item.cost * +item.quantity));
      setTotal(totalTemp);
    }
  }, [id, code]);

  const getInvoiceDetail = async (id, typeItem) => {
    setIsLoading(true);
    let res;
    if (type === "order") {
      res = await OrderService.detail(id);
    } else if (type === "warehousing" && isTemp) {
      res = await InvoiceService.tempDetail(id);
    } else {
      res = await InvoiceService.detail(id, typeItem);
    }
    setInvoiceItem(res.result);
    if (res.code === 200) {
      if (type !== "order") {
        setInvoiceInfo(res.result.invoice);
        setInvoiceDetail(res.result.invoice_detail.filter((item) => item.drug_id !== -1));
        setInvoiceDoctor(res.result.invoice_detail.filter((item) => item.invoice_detail.combo_name == "Đơn thuốc"));
        setInvoiceCombo(
          res.result.invoice_detail.filter(
            (item) =>
              item.invoice_detail.combo_name !== "Đơn thuốc" &&
              item.invoice_detail.combo_name !== "" &&
              item.invoice_detail.combo_name !== null
          )
        );

        //Tính thông tin thanh toán nhập hàng
        let totalTemp = 0;
        res.result.invoice_detail.map((item) => (totalTemp += +item.cost * +item.quantity));
        setTotal(totalTemp);
        // setTotalBeforeVat(totalTemp - +res.result.invoice.amount);
        if (res.result?.v_clinic_data) {
          setDataDoctor(res.result?.v_clinic_data[0]);
        }
      } else {
        setInvoiceInfo(res.result.order);
        setInvoiceDetail(res.result.order_detail);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getInvoiceDetail(id, "id");
    } else if (invoice) {
      setInvoiceInfo(invoice.invoice);
      setInvoiceDetail(invoice.invoice_detail.filter((item) => item.drug_id !== -1));
    } else if (code) {
      getInvoiceDetail(code, "code");
    }
    setTypePrint("");
  }, [invoice, id, code, onShow]);

  const titles =
    type === "order"
      ? ["Mã thuốc", "Tên thuốc", "ĐVT", "Số lượng", "Giá bán", "Giảm giá", "Thành tiền", "Ghi chú"]
      : [
          "Mã thuốc",
          "Tên mặt hàng",
          "Số lô",
          "Hạn dùng",
          "ĐVT",
          type === "warehousing" ? "Giá nhập" : "Giá bán",
          "Giảm giá",
          "Số lượng",
          "VAT(%)",
          "Thành tiền",
          ...(type === "warehousing" ? [] : ["Ghi chú"]),
        ];

  const dataMappingArray = (item) =>
    isTemp
      ? [
          item.drug_code,
          item.drug_name,
          item.number,
          moment(item.expiry_date).format("DD/MM/YYYY"),
          item.unit_name,
          formatCurrency(item?.current_cost),
          formatCurrency(item?.discount_promotion ?? 0),
          formatCurrency(item?.amount, ",", ""),
          formatCurrency(item?.vat),
          formatCurrency(+item.amount * +item.current_cost),
          item.note,
        ]
      : isTest
      ? [
          item.drug_code,
          item.drug_name,
          item.number,
          moment(item.expiry_date).format("DD/MM/YYYY"),
          item.unit_name,
          formatCurrency(item?.current_cost),
          formatCurrency(item?.discount_promotion ?? 0),
          formatCurrency(item?.amount, ",", ""),
          formatCurrency(item?.vat),
          formatCurrency(+item.amount * +item.current_cost),
          item.note,
        ]
      : [
          item.invoice_detail.drug_code,
          item.invoice_detail.drug_name,
          item.invoice_detail.number,
          moment(item.invoice_detail.expiry_date).format("DD/MM/YYYY"),
          item.invoice_detail.unit_name,
          item.invoice_detail.current_cost !== 0
            ? formatCurrency(item.invoice_detail.current_cost)
            : formatCurrency(item.invoice_detail.org_cost),
          0,
          item.invoice_detail.quantity,
          item.invoice_detail.vat,
          formatCurrency(
            (item.invoice_detail.current_cost !== 0 ? item.invoice_detail.current_cost : item.invoice_detail.org_cost) *
              item.invoice_detail.quantity
          ),
          item.invoice_detail.note,
        ];

  const invoiceDetailDataMappingArray = (item) =>
    type === "order" && !isTest
      ? [
          item.order_detail?.drug?.drug_code,
          item.order_detail?.drug?.name,
          item.order_detail?.unit_name,
          formatCurrency(item.order_detail?.out_quantity, ",", ""),
          formatCurrency(+item.order_detail.out_price > 0 ? +item.order_detail.out_price : item.order_detail.in_price),
          formatCurrency(item.order_detail.discount_promotion),
          formatCurrency(
            +item.order_detail.out_quantity * +item.order_detail.out_price > 0
              ? +item.order_detail.out_price
              : item.order_detail.in_price - +item.order_detail.discount_promotion,
            ","
          ),
          item.order_detail.note,
        ]
      : type === "order" && isTest
      ? [
          item?.drug_code,
          item?.drug_name,
          item?.unit_name,
          formatCurrency(item?.quantity, ",", ""),
          formatCurrency(item?.in_price ?? 0),
          0,
          formatCurrency(+item?.quantity * +item?.in_price),
          item?.note,
        ]
      : isTest
      ? [
          item?.drug_code,
          item?.drug_name,
          item?.number,
          moment(item?.expiry_date).format("DD/MM/YYYY"),
          item?.unit_name,
          formatCurrency(item?.current_cost),
          formatCurrency(item?.discount_promotion ?? 0),
          formatCurrency(item?.amount || item?.quantity, ",", ""),
          formatCurrency(item?.vat),
          formatCurrency(+item?.amount || +item?.quantity * +item?.current_cost),
          ...(type === "warehousing" ? [] : [item.invoice_detail?.note]),
        ]
      : [
          item.invoice_detail?.drug_code,
          item.invoice_detail?.drug_name,
          item.invoice_detail?.number,
          moment(item.invoice_detail?.expiry_date).format("DD/MM/YYYY") ?? "",
          item.invoice_detail?.unit_name,
          formatCurrency(item.invoice_detail?.cost),
          formatCurrency(item.invoice_detail?.discount_promotion),
          formatCurrency(item.invoice_detail?.quantity, ",", ""),
          formatCurrency(item.invoice_detail?.vat),
          formatCurrency(+item.invoice_detail?.cost * +item.invoice_detail?.quantity),
          ...(type === "warehousing" ? [] : [item.invoice_detail?.note]),
        ];

  const dataFormat = [
    "",
    "",
    "",
    type === "order" ? ["text-right", "text-right"] : ["", ""],
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "",
  ];

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrint76MM = async () => {
    const res = await InvoiceService.detail(id, "id");
    if (res.result) {
      printBill(cookies?.drugStore, res.result);
    } else {
      showToast("Chức năng này đang lỗi. Vui lòng thử lại sau.", "error");
    }
  };

  const actions = useMemo<IActionModal>(
    () => ({
      actions_left: { buttons: [] },
      actions_right: {
        buttons:
          type === "warehousing" && !isTest
            ? [
                ...(isTemp || isReturnNCC
                  ? []
                  : [
                      {
                        title: "Copy",
                        color: "primary",
                        variant: "outline",
                        callback: () => {
                          navigate(`/warehousing/copy/${id || code}`);
                          toggle();
                        },
                      },
                    ]),
                ...(isReturnNCC
                  ? []
                  : [
                      {
                        title: "Xuất Excel",
                        type: "button",
                        variant: "outline",
                        color: "primary",
                        callback: async () => {
                          handleExport(id, "id");
                        },
                      },
                    ]),
                {
                  title: "In hóa đơn A4/A5",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint();
                  },
                },
              ]
            : type === "order" && !isTest
            ? [
                {
                  title: "In hóa đơn A4/A5",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint();
                  },
                },
              ]
            : type === "return"
            ? [
                {
                  title: "In hóa đơn 76MM",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint76MM();
                  },
                },
                {
                  title: "In hóa đơn A4/A5",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint();
                  },
                },
              ]
            : isTest
            ? [
                {
                  title: "Quay lại",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    toggle();
                  },
                },
                {
                  title: "Xác nhận",
                  color: "primary",
                  callback: () => {
                    handleSubmitTest();
                  },
                },
              ]
            : [
                {
                  title: "Copy",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    navigate(`/sales/copy/${id || code}`);
                    toggle();
                  },
                },
                {
                  title: "Xuất Excel",
                  type: "button",
                  variant: "outline",
                  color: "primary",
                  callback: () => {
                    handleExport(id, "id");
                  },
                },
                {
                  title: "Khách trả hàng",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    navigate(`/sales/return/${id}`);
                    toggle();
                  },
                },
                {
                  title: "In hóa đơn 76MM",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint76MM();
                  },
                },
                {
                  title: "In hóa đơn A4/A5",
                  color: "primary",
                  variant: "outline",
                  callback: () => {
                    handlePrint();
                  },
                },
                ...(cookies?.drugStore?.type === "GPP"
                  ? []
                  : [
                      {
                        title: "In phiếu xuất kho",
                        color: "primary",
                        variant: "outline",
                        callback: () => {
                          setTypePrint("export");
                          setTimeout(handlePrint, 1000);
                        },
                      },
                      {
                        title: "In giao hàng",
                        color: "primary",
                        variant: "outline",
                        callback: () => {
                          setTypePrint("shipping");
                          setTimeout(handlePrint, 1000);
                        },
                      },
                    ]),
              ],
      },
    }),
    [onShow]
  );

  const handleExport = async (code: string, typeExport: "id" | "code") => {
    let res = null;
    if (type === "warehousing" && isTemp) {
      res = await InvoiceService.tempDetail(code);
    } else {
      res = await InvoiceService.detail(code, typeExport);
    }
    if (res.code === 200) {
      ExportExcel(await getInvoiceDetailExcelDoc(res.result));
    } else {
      showToast("Chức năng này đang bị lỗi. Vui lòng thử lại sau", "error");
    }
  };

  const congNo = +invoiceInfo?.amount - +invoiceInfo?.discount - +invoiceInfo?.pay_amount;

  useEffect(() => {
    const getCustomerName = async () => {
      const res = await SupplierService.listFilter({ per_page: 3500 });
      setCustomerName(res.result.data.find((i) => i.id === invoiceTestData?.customer_id)?.name);
    };

    getCustomerName();
  }, [invoiceTestData?.customer_id]);

  return (
    <div className="sales-invoice-detail">
      <Modal
        isOpen={onShow}
        className="modal-drug"
        isFade={true}
        staticBackdrop={false}
        toggle={toggle}
        isCentered={true}
      >
        <ModalHeader title="" toggle={toggle} />
        <div ref={componentRef}>
          <ModalBody>
            <div className="sales-detail__header">
              <div className="sales-detail__header__logo">
                <Icon name="LogoGPP" />
              </div>
              <div className="sales-detail__header__name">
                <h4>{cookies?.drugStore?.name}</h4>
                <span>
                  Địa chỉ: <b>{cookies?.drugStore?.address}</b>
                </span>
                <span>
                  SĐT: <b>{cookies?.drugStore?.phone}</b>
                </span>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <div className="sales-detail__body">
                {typePrint === "export" ? (
                  <>
                    <h2 className="title">PHIẾU XUẤT KHO</h2>
                    <h4 className="text-center">
                      {"Ngày " +
                        moment().format("DD/MM/YYYY").split("/")[0] +
                        " tháng " +
                        moment().format("DD/MM/YYYY").split("/")[1] +
                        " năm " +
                        moment().format("DD/MM/YYYY").split("/")[2]}
                    </h4>
                    <div className="w-100 text-center">Số: XK100574</div>
                  </>
                ) : isReturn ? (
                  <h2 className="title">THÔNG TIN HÓA ĐƠN TRẢ HÀNG NHÀ CUNG CẤP</h2>
                ) : (
                  <h2 className="title">{`${isTest ? "Kiểm tra" : ""} Thông tin hóa đơn ${
                    type === "warehousing" ? "nhập" : type === "order" ? "đặt" : type === "return" ? "khách trả" : "bán"
                  } hàng ${isTemp ? "lưu tạm" : ""}`}</h2>
                )}

                {typePrint === "export" && (
                  <>
                    <div className="mt-4">
                      <strong>Ngày xuất kho: </strong>
                    </div>
                    <div>
                      <strong>Lý do xuất kho: </strong>
                      <span className="ml-3">
                        Xuất kho bán hàng theo hóa đơn {invoiceInfo?.invoice_code ?? invoiceInfo?.order_code}
                      </span>
                    </div>
                  </>
                )}
                {typePrint === "export" ? null : (
                  <div className="row">
                    <div className="col-10">
                      {type === "warehousing" || (type === "order" && !isTest) ? (
                        <div className="row">
                          <div className="col-4 invoice-info">
                            <span>
                              Nhà cung cấp:{" "}
                              <b className="value">
                                {isTest ? customerName : invoiceInfo?.supplier_name ?? invoiceInfo?.gdp_name}
                              </b>
                            </span>
                          </div>
                          {!isTest ? (
                            <>
                              <div className="col-4 invoice-info">
                                <span>
                                  Số điện thoại:{" "}
                                  <b className="value">
                                    {type !== "order" ? invoiceInfo?.supplier_phone : invoiceInfo?.creator_phone}
                                  </b>
                                </span>
                              </div>
                              <div className="col-4 invoice-info">
                                <span>
                                  Địa chỉ: <b className="value">{invoiceInfo?.supplier_address}</b>
                                </span>
                              </div>
                              {type === "warehousing" && isReturn ? null : (
                                <div className="col-4 invoice-info">
                                  <span>
                                    Mã hóa đơn:{" "}
                                    <b className="value">{invoiceInfo?.invoice_code ?? invoiceInfo?.order_code}</b>
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="col-4 invoice-info">
                                <span>
                                  Ngày hóa đơn:{" "}
                                  <b className="value">{moment(invoiceTestData?.receipt_date).format("DD/MM/YYYY")}</b>
                                </span>
                              </div>
                              <div className="col-4 invoice-info">
                                <span>
                                  Hình thức thanh toán:{" "}
                                  <b className="value">
                                    {invoiceTestData?.payment_method === "cash"
                                      ? "Tiền mặt"
                                      : invoiceTestData?.payment_method === "vnpay"
                                      ? "VNPay"
                                      : invoiceTestData?.payment_method === "momo"
                                      ? "Momo"
                                      : invoiceTestData?.payment_method === "banking"
                                      ? "Chuyển khoản"
                                      : "Thẻ (Máy POS)"}
                                  </b>
                                </span>
                              </div>
                              <div className="col-4 invoice-info">
                                <span>
                                  Số lượng mặt hàng:{" "}
                                  <b className="value">{invoiceTestData?.invoice_detail?.length ?? 1}</b>
                                </span>
                              </div>
                            </>
                          )}

                          <div className="col-4 invoice-info">
                            <span>
                              Người {type === "order" ? "đặt hàng" : "tạo"}:
                              <b className="value">
                                {invoiceInfo?.user_fullname ??
                                  invoiceInfo?.name ??
                                  invoiceInfo?.creator ??
                                  cookies?.user?.name}
                              </b>
                            </span>
                          </div>
                          {type === "order" && (
                            <div className="col-4 invoice-info">
                              <span>
                                Trạng thái đơn hàng:
                                <b className="value">
                                  {invoiceInfo?.status === "sent"
                                    ? "Đặt hàng thành công"
                                    : invoiceInfo?.status === "confirm"
                                    ? "Chờ bạn xác nhận"
                                    : invoiceInfo?.status === "checked"
                                    ? "Chờ GDP giao hàng"
                                    : invoiceInfo?.status === "delivery"
                                    ? "GDP đang giao hàng"
                                    : invoiceInfo?.status === "returned"
                                    ? "Yêu cầu trả hàng"
                                    : invoiceInfo?.status === "cancel_gpp"
                                    ? "GPP đã hủy"
                                    : invoiceInfo?.status === "cancel_gdp"
                                    ? "GDP đã hủy"
                                    : invoiceInfo?.status === "cancel_gpp_gdp"
                                    ? "Xác nhận trả hàng"
                                    : invoiceInfo?.status === "done"
                                    ? "Hoàn thành"
                                    : invoiceInfo?.status === "prepared"
                                    ? "GDP chuẩn bị chuyển hàng"
                                    : invoiceInfo?.status === "temp"
                                    ? "Lưu tạm"
                                    : "Đã hủy"}
                                </b>
                              </span>
                            </div>
                          )}
                          <div className="col-4 invoice-info">
                            <span>
                              Ngày {type === "order" ? "đặt" : "nhập"} hàng:
                              <b className="value">
                                {moment(
                                  invoiceInfo?.order_date ?? invoiceInfo?.created_at ?? invoiceInfo?.receipt_date
                                ).format("DD/MM/YYYY")}
                              </b>
                            </span>
                          </div>
                          {type === "order" && (
                            <>
                              <div className="col-4 invoice-info">
                                <span>
                                  Ngày giao hàng dự kiến:
                                  <b className="value">{moment(invoiceInfo?.received_date).format("DD/MM/YYYY")}</b>
                                </span>
                              </div>
                              <div className="col-4 invoice-info">
                                <span>
                                  Trạng thái thanh toán:
                                  <b className={`value`}>Đã thanh toán</b>
                                </span>
                              </div>
                            </>
                          )}
                          {type !== "order" && (
                            <>
                              {type === "warehousing" && !isTest && isReturn ? (
                                <div className="col-4 invoice-info">
                                  <span>
                                    Mã hóa đơn nhập hàng:
                                    <b className="value">{invoiceInfo?.ref_invoice_code}</b>
                                  </span>
                                </div>
                              ) : null}
                              <div className="col-4 invoice-info">
                                <span>
                                  Trạng thái:
                                  {type === "warehousing" ? (
                                    <b className={`value ${invoiceInfo?.status == "cancel" ? "error" : "success"}`}>
                                      {invoiceInfo?.status == "cancel" ? "Đã hủy" : "Hoàn thành"}
                                    </b>
                                  ) : (
                                    <b
                                      className={`value ${
                                        invoiceInfo?.status === "done"
                                          ? "success"
                                          : invoiceInfo?.status === "processing"
                                          ? "primary"
                                          : invoiceInfo?.status === "temp"
                                          ? "warning"
                                          : "error"
                                      }`}
                                    >
                                      {invoiceInfo?.status === "done"
                                        ? "Hoàn thành"
                                        : invoiceInfo?.status === "temp"
                                        ? "Lưu tạm"
                                        : invoiceInfo?.status === "cancel"
                                        ? "Đã hủy"
                                        : "Cần xác nhận"}
                                    </b>
                                  )}
                                </span>
                              </div>
                              {type === "warehousing" && isTest && invoiceTestData?.description && (
                                <div className="col-4 invoice-info">
                                  <span>
                                    Ghi chú:
                                    <b className="value">{invoiceTestData?.description}</b>
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          {type === "warehousing" ? null : (
                            <div className="col-4 invoice-info">
                              <span>
                                Số lượng mặt hàng:
                                <b className={`value`}>{invoiceDetail?.length}</b>
                              </span>
                            </div>
                          )}
                          {!isTest && (
                            <div className="col-4 invoice-info">
                              <span>
                                Hình thức thanh toán:
                                <b className={`value`}>
                                  {invoiceInfo?.payment_method === "cash" || invoiceInfo?.pay_method === "cash"
                                    ? "Tiền mặt"
                                    : invoiceInfo?.payment_method === "vnpay"
                                    ? "VNPay"
                                    : invoiceInfo?.payment_method === "momo"
                                    ? "Momo"
                                    : invoiceInfo?.payment_method === "banking"
                                    ? "Chuyển khoản"
                                    : "Thẻ (Máy POS)"}
                                </b>
                              </span>
                            </div>
                          )}
                          {invoiceInfo?.description && (
                            <div className="col-4 invoice-info">
                              <span>
                                Ghi chú:
                                <b className={`value`}>{invoiceInfo?.description}</b>
                              </span>
                            </div>
                          )}
                        </div>
                      ) : type === "order" && isTest ? (
                        <div className="row">
                          <div className="col-4 invoice-info">
                            <span>
                              Người đặt hàng: <b className="value">{cookies?.user?.name}</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Trạng thái đơn hàng: <b className="value">Chờ GDP xác nhận</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Ngày đặt hàng:{" "}
                              <b className="value">{moment(invoiceTestData?.receipt_date).format("DD/MM/YYYY")}</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Ngày giao hàng dự kiến:{" "}
                              <b className="value">{moment(invoiceTestData?.desired_date).format("DD/MM/YYYY")}</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Số lượng mặt hàng: <b className="value">{invoiceTestData?.line_items?.length}</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Hình thức thanh toán:{" "}
                              <b className="value">
                                {invoiceTestData?.payment_method === "cash" || invoiceTestData?.pay_method === "cash"
                                  ? "Tiền mặt"
                                  : invoiceTestData?.payment_method === "vnpay"
                                  ? "VNPay"
                                  : invoiceTestData?.payment_method === "momo"
                                  ? "Momo"
                                  : invoiceTestData?.payment_method === "banking"
                                  ? "Chuyển khoản"
                                  : "Thẻ (Máy POS)"}
                              </b>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          {isTest ? null : (
                            <div className="col-4 invoice-info">
                              <span>
                                Mã hóa đơn: <b className="value">{invoiceInfo?.invoice_code}</b>
                              </span>
                            </div>
                          )}
                          <div className="col-4 invoice-info">
                            <span>
                              Ngày tạo:{" "}
                              <b className="value">
                                {moment(
                                  isTest ? invoiceTestData?.date : invoiceInfo?.created_at ?? invoiceInfo?.receipt_date
                                ).format("DD/MM/YYYY")}
                              </b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              {type === "return" ? "Người tạo:" : "DS xuất bán:"}{" "}
                              <b className="value">{invoiceInfo?.user_fullname || cookies?.user?.name}</b>
                            </span>
                          </div>
                          <div className="col-4 invoice-info">
                            <span>
                              Tên khách hàng:{" "}
                              <b className="value">
                                {isTest
                                  ? invoiceTestData?.customer_name ?? "Khách lẻ"
                                  : invoiceInfo?.customer_name ?? "Khách lẻ"}
                              </b>
                            </span>
                          </div>
                          {type !== "return" && (
                            <>
                              <div className="col-4 invoice-info">
                                <span>
                                  Hình thức bán:
                                  {invoiceInfo?.method && (
                                    <b className="value">{invoiceInfo?.method === "direct" ? "Trực tiếp" : "Online"}</b>
                                  )}
                                  {isTest && (
                                    <b className="value">
                                      {invoiceTestData?.sales_method === "direct" ? "Trực tiếp" : "Online"}
                                    </b>
                                  )}
                                </span>
                              </div>
                              <div className="col-4 invoice-info">
                                <span>
                                  Hình thức thanh toán:
                                  {isTest ? (
                                    <b className="value">
                                      {invoiceTestData?.payment_method === "cash"
                                        ? "Tiền mặt"
                                        : invoiceTestData?.payment_method === "vnpay"
                                        ? "VNPay"
                                        : invoiceTestData?.payment_method === "momo"
                                        ? "Momo"
                                        : invoiceTestData?.payment_method === "banking"
                                        ? "Chuyển khoản"
                                        : "Thẻ (Máy POS)"}
                                    </b>
                                  ) : (
                                    invoiceInfo?.payment_method && (
                                      <b className="value">
                                        {invoiceInfo?.payment_method === "cash"
                                          ? "Tiền mặt"
                                          : invoiceInfo?.payment_method === "vnpay"
                                          ? "VNPay"
                                          : invoiceInfo?.payment_method === "momo"
                                          ? "Momo"
                                          : invoiceInfo?.payment_method === "banking"
                                          ? "Chuyển khoản"
                                          : "Thẻ (Máy POS)"}
                                      </b>
                                    )
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                          {type === "return" && (
                            <div className="col-4 invoice-info">
                              <span>
                                Mã HĐ bán hàng:
                                <b className="value">{invoiceInfo?.ref_invoice_code}</b>
                              </span>
                            </div>
                          )}
                          <div className="col-4 invoice-info">
                            <span>
                              Trạng thái đơn hàng:
                              <b
                                className={`value ${
                                  invoiceInfo?.status === "done" || invoiceTestData?.status === "done"
                                    ? "success"
                                    : invoiceInfo?.status === "processing"
                                    ? "primary"
                                    : invoiceInfo?.status === "temp"
                                    ? "warning"
                                    : "error"
                                }`}
                              >
                                {invoiceInfo?.status === "done" || invoiceTestData?.status === "done"
                                  ? "Hoàn thành"
                                  : invoiceInfo?.status === "processing"
                                  ? "Đang xử lý"
                                  : invoiceInfo?.status === "temp"
                                  ? "Lưu tạm"
                                  : "Đã hủy"}
                              </b>
                            </span>
                          </div>
                          {invoiceInfo?.status === "temp" || isTest || type === "return" ? null : (
                            <>
                              <div className="col-4 invoice-info">
                                <span>
                                  Trạng thái thanh toán:
                                  {invoiceInfo?.payment_status && (
                                    <b
                                      className={`value ${
                                        invoiceInfo?.payment_status === "paid" ? "success" : "primary"
                                      }`}
                                    >
                                      {invoiceInfo?.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </b>
                                  )}
                                </span>
                              </div>
                              {/* <div className="col-4 invoice-info">
                                <span>
                                  Trạng thái giao hàng:{" "}
                                  {invoiceInfo?.shipping_status && (
                                    <b
                                      className={`value ${
                                        invoiceInfo?.shipping_status === "done" ? "success" : "primary"
                                      }`}
                                    >
                                      {invoiceInfo?.shipping_status === "processing"
                                        ? "Đang giao hàng"
                                        : "Đã giao hàng"}
                                    </b>
                                  )}
                                </span>
                              </div> */}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-2">
                      {
                        <QRCode
                          id="qrcode"
                          value={type === "order" ? invoiceInfo?.order_code : invoiceInfo?.invoice_code}
                          size={120}
                          level={"H"}
                          includeMargin={true}
                        />
                      }
                    </div>
                  </div>
                )}
                {isTest && invoiceTestData?.combos?.length > 0 ? (
                  <InvoiceDetailTable
                    title="THÔNG TIN COMBO-THUỐC LIỀU (ĐƠN VỊ TÍNH: VNĐ)"
                    dataMappingArray={(item) => dataMappingArray(item)}
                    listTitle={titles}
                    dataFormat={dataFormat}
                    data={invoiceTestData?.combos}
                    type="combo"
                  />
                ) : (
                  invoiceCombo &&
                  invoiceCombo.length > 0 && (
                    <InvoiceDetailTable
                      title="THÔNG TIN COMBO-THUỐC LIỀU (ĐƠN VỊ TÍNH: VNĐ)"
                      dataMappingArray={(item) => dataMappingArray(item)}
                      listTitle={titles}
                      dataFormat={dataFormat}
                      data={invoiceCombo}
                      type="combo"
                    />
                  )
                )}
                {isTest && invoiceTestData?.prescriptions && invoiceTestData?.prescriptions.length > 0 ? (
                  <InvoiceDetailTable
                    title="THÔNG TIN ĐƠN THUỐC"
                    dataMappingArray={(item) => dataMappingArray(item)}
                    listTitle={titles}
                    dataFormat={dataFormat}
                    data={invoiceTestData?.prescriptions[0].units}
                    type="prescriptions"
                    dataDoctor={invoiceTestData.prescriptions[0]}
                    isTest={true}
                  />
                ) : (
                  invoiceDoctor &&
                  invoiceDoctor.length > 0 && (
                    <InvoiceDetailTable
                      title="THÔNG TIN ĐƠN THUỐC"
                      dataMappingArray={(item) => dataMappingArray(item)}
                      listTitle={titles}
                      dataFormat={dataFormat}
                      data={invoiceDoctor}
                      type="prescriptions"
                      dataDoctor={dataDoctor}
                    />
                  )
                )}

                {(isTest && invoiceTestData?.units?.length > 0) ||
                  (invoiceTestData?.invoice_detail && (
                    <InvoiceDetailTable
                      title={`${
                        typePrint === "export"
                          ? ""
                          : type === "warehousing"
                          ? ""
                          : "THÔNG TIN SẢN PHẨM BÁN LẺ (ĐƠN VỊ TÍNH: VNĐ)"
                      }`}
                      dataMappingArray={(item) => invoiceDetailDataMappingArray(item)}
                      listTitle={titles}
                      dataFormat={dataFormat}
                      data={invoiceTestData.units ?? invoiceTestData.invoice_detail ?? invoiceTestData?.line_items}
                      type="retail"
                    />
                  ))}
                {type !== "order" &&
                invoiceDetail &&
                invoiceDetail?.filter(
                  (item) => item.invoice_detail.combo_name === null || item.invoice_detail.combo_name === ""
                ).length > 0 ? (
                  <InvoiceDetailTable
                    title={`${
                      typePrint === "export"
                        ? ""
                        : type === "warehousing"
                        ? ""
                        : "THÔNG TIN SẢN PHẨM BÁN LẺ (ĐƠN VỊ TÍNH: VNĐ)"
                    }`}
                    dataMappingArray={(item) => invoiceDetailDataMappingArray(item)}
                    listTitle={titles}
                    dataFormat={dataFormat}
                    data={invoiceDetail.filter(
                      (item) => item.invoice_detail.combo_name === null || item.invoice_detail.combo_name === ""
                    )}
                    type="retail"
                  />
                ) : null}
                {type === "order" && !isTest && invoiceDetail ? (
                  <InvoiceDetailTable
                    title=""
                    dataMappingArray={(item) => invoiceDetailDataMappingArray(item)}
                    listTitle={titles}
                    dataFormat={dataFormat}
                    data={invoiceDetail}
                    type="retail"
                  />
                ) : null}

                {type === "order" && isTest && (
                  <InvoiceDetailTable
                    title={""}
                    dataMappingArray={(item) => invoiceDetailDataMappingArray(item)}
                    listTitle={titles}
                    dataFormat={dataFormat}
                    data={invoiceTestData?.line_items}
                    type="retail"
                  />
                )}

                {type === "order" || typePrint === "export" ? null : (
                  <div className="sales-detail__body__item">
                    <h4>Thông tin thanh toán</h4>
                    <div className="sales-detail__body__item__content">
                      {type !== "warehousing" && (
                        <div className="line-text">
                          <span>Số lượng mặt hàng:</span>
                          <span className="line-value">
                            {invoiceDetail?.length ||
                              invoiceTestData?.combos?.length +
                                invoiceTestData?.units?.length +
                                invoiceTestData?.prescriptions?.length ||
                              invoiceTestData?.invoice_detail.length}
                          </span>
                        </div>
                      )}
                      <div className="line-text">
                        <span>Tổng tiền (vnđ):</span>
                        <span className="line-value">
                          {isTest
                            ? formatCurrency(
                                invoiceTestData?.total_all || invoiceTestData?.amount - +invoiceTestData.vat_amount
                              )
                            : type === "warehousing"
                            ? formatCurrency(total)
                            : formatCurrency(invoiceInfo?.amount || 0)}
                        </span>
                      </div>
                      {type === "warehousing" && (
                        <div className="line-text">
                          <span>Tổng giảm giá trước VAT (vnđ):</span>
                          <span className="line-value">{formatCurrency(totalBeforeVat)}</span>
                        </div>
                      )}
                      {isReturnNCC || type === "return" ? null : (
                        <>
                          <div className="line-text">
                            <span>Tổng tiền VAT (vnđ):</span>
                            <span className="line-value">
                              {formatCurrency(invoiceTestData?.vat_amount || invoiceInfo?.vat_amount)}
                            </span>
                          </div>
                          <div className="line-text">
                            <span>Giảm giá {type === "warehousing" ? "sau VAT" : ""} (vnđ):</span>
                            <span className="line-value">
                              {isTest
                                ? formatCurrency(invoiceTestData?.total_discount || invoiceTestData?.discount)
                                : formatCurrency(invoiceInfo?.discount || 0)}
                            </span>
                          </div>
                        </>
                      )}
                      {isReturnNCC ||
                        (type === "return" && (
                          <div className="line-text">
                            <span>Chênh lệch trả hàng (vnđ):</span>
                            <span className="line-value">
                              {formatCurrency(+invoiceInfo?.amount - +invoiceInfo?.discount - +invoiceInfo?.pay_amount)}
                            </span>
                          </div>
                        ))}
                      <div className="line-text">
                        <span>
                          {isReturnNCC
                            ? "Phải thu (vnđ):"
                            : type === "warehousing"
                            ? "Tổng tiền phải trả (vnđ):"
                            : type === "return"
                            ? "Phải trả khách (vnđ):"
                            : "Khách phải trả (vnđ):"}
                        </span>
                        <span className="line-value">
                          {isTest
                            ? formatCurrency(invoiceTestData?.total_money || invoiceTestData?.pay_amount)
                            : type === "warehousing"
                            ? formatCurrency(+invoiceInfo?.amount - +invoiceInfo?.discount)
                            : formatCurrency(
                                +invoiceInfo?.amount - +invoiceInfo?.discount - +invoiceInfo?.discount_promotion
                              )}
                        </span>
                      </div>
                      <div className="line-text">
                        <span>
                          {isReturnNCC
                            ? "Thực thu (vnđ):"
                            : type === "warehousing"
                            ? "Thực trả NCC (vnđ):"
                            : type === "return"
                            ? "Thực trả (vnđ):"
                            : "Khách thực trả (vnđ):"}
                        </span>
                        <span className="line-value">
                          {isTest
                            ? formatCurrency(invoiceTestData?.client_pay || invoiceTestData?.pay_amount)
                            : formatCurrency(invoiceInfo?.pay_amount || 0)}
                        </span>
                      </div>
                      {isReturnNCC || type === "return" ? null : (
                        <div className="line-text">
                          <span>Công nợ (vnđ):</span>
                          <span className="line-value">
                            {isTest
                              ? formatCurrency(
                                  +invoiceTestData?.total_all -
                                    +invoiceTestData?.total_discount -
                                    +invoiceTestData?.client_pay
                                )
                              : type === "warehousing"
                              ? formatCurrency(+invoiceInfo?.amount - +invoiceInfo?.pay_amount)
                              : formatCurrency(congNo)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {typePrint === "shipping" ? (
              <div className={`d-flex justify-content-around`}>
                <div className="col-2" style={{ marginBottom: "6rem" }}>
                  <h4 className="">Người giao hàng</h4>
                </div>
                <div className="col-2" style={{ marginBottom: "6rem" }}>
                  <h4 className="">Thủ kho</h4>
                </div>
                <div className="col-2" style={{ marginBottom: "6rem" }}>
                  <h4 className="">Người nhận hàng</h4>
                </div>
                <div className="col-2" style={{ marginBottom: "6rem" }}>
                  <h4 className="">Số kiện hàng</h4>
                </div>
                <div className="col-2" style={{ marginBottom: "6rem" }}>
                  <h4 className="">Ngày xuất hàng</h4>
                </div>
              </div>
            ) : typePrint === "export" ? (
              <div className="row" style={{ marginTop: "5rem" }}>
                <div className="col-3">
                  <h3 className="text-center">Người lập phiếu</h3>
                </div>
                <div className="col-3">
                  <h3 className="text-center">Thủ kho</h3>
                </div>
                <div className="col-3">
                  <h3 className="text-center">Kế toán trưởng</h3>
                </div>
                <div className="col-3">
                  <h3 className="text-center">Giám đốc</h3>
                </div>
              </div>
            ) : null}
            {type === "order" && (
              <div className="row mt-6">
                <div className="col-6">Tổng tiền tạm tính:</div>
                <div className="col-6 text-right" style={{ fontWeight: "bold" }}>
                  {formatCurrency(isTest ? invoiceTestData?.amount : invoiceInfo?.amount)}
                </div>
              </div>
            )}
          </ModalBody>
        </div>

        {isTemp ? null : <ModalFooter actions={actions} className="modal-invoice-detail-footer" />}
      </Modal>
    </div>
  );
}

interface InvoiceDetailTableProps {
  title: string;
  data: any[];
  listTitle: any[];
  dataFormat: any;
  dataMappingArray: any;
  type: "prescriptions" | "retail" | "combo";
  dataDoctor?: any;
  isTest?: boolean;
}

const InvoiceDetailTable = (props: InvoiceDetailTableProps) => {
  const { title, data, listTitle, dataFormat, dataMappingArray, type, dataDoctor, isTest } = props;
  return (
    <div className="sales-detail__body__item">
      <h4>{title}</h4>
      {type === "prescriptions" && (
        <div className="sales-detail__body__sale">
          <div className="row">
            <div className="col-4">
              <span className="title-sale">Mã bệnh nhân:</span>
              <span className="value">{dataDoctor?.patient_code}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Tên bệnh nhân:</span>
              <span className="value">{dataDoctor?.name_patient || dataDoctor?.patient_name}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">
                {dataDoctor?.year_old > 0 || dataDoctor?.age_type === "year" ? "Tuổi:" : "Tháng tuổi:"}
              </span>
              <span className="value">
                {dataDoctor?.year_old > 0 ? dataDoctor?.year_old : isTest ? dataDoctor?.age : dataDoctor?.month_old}
              </span>
            </div>
            <div className="col-4">
              <span className="title-sale">Chiều cao(cm):</span>
              <span className="value">{dataDoctor?.height}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Cân nặng(kg):</span>
              <span className="value">{dataDoctor?.weight}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Số CMND:</span>
              <span className="value">{dataDoctor?.id_card}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Thẻ BHYT:</span>
              <span className="value">{dataDoctor?.bhyt}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Địa chỉ:</span>
              <span className="value">{dataDoctor?.address}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Bác sĩ kê đơn:</span>
              <span className="value">{dataDoctor?.doctor}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Người giám hộ:</span>
              <span className="value"></span>
            </div>
            <div className="col-4">
              <span className="title-sale">Mã đơn thuốc:</span>
              <span className="value">{dataDoctor?.code_invoice}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Cơ sở khám bệnh:</span>
              <span className="value">{dataDoctor?.clinic}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Địa chỉ CSKB:</span>
              <span className="value">{dataDoctor?.patient_address}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Số sản phẩm bán theo đơn:</span>
              <span className="value"></span>
            </div>
            <div className="col-4">
              <span className="title-sale">Thành tiền(vnđ):</span>
              <span className="value"></span>
            </div>
            <div className="col-4">
              <span className="title-sale">Ngày kê đơn:</span>
              <span className="value">{moment(dataDoctor?.created_at).format("DD/MM/YYYY")}</span>
            </div>
          </div>
          <div className="row table-title">
            <h6 className="col-12">SẢN PHẨM BÁN THEO ĐƠN THUỐC (Đơn vị tính: VNĐ)</h6>
          </div>
        </div>
      )}
      {type === "combo" && (
        <div className="sales-detail__body__sale">
          <div className="row">
            <div className="col-4">
              <span className="title-sale">Tên combo:</span>
              <span className="value">{data[0]?.combo_name}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Số lượng:</span>
              <span className="value">{data[0]?.quantity}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Giá bán:</span>
              <span className="value">{formatCurrency(data[0]?.cost)}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Thành tiền:</span>
              <span className="value">{formatCurrency(+data[0]?.quantity * +data[0]?.cost)}</span>
            </div>
            <div className="col-4">
              <span className="title-sale">Liều dùng:</span>
              <span className="value">{data[0]?.usage}</span>
            </div>
          </div>
        </div>
      )}
      <div className="sales-detail__body__item__body">
        <BoxTable
          name={"Bán lẻ"}
          titles={listTitle}
          items={!isTest ? data.filter((item) => item.drug_id !== -1) : data}
          dataFormat={dataFormat}
          isPagination={true}
          // dataPagination={pagination}
          dataMappingArray={dataMappingArray}
          isBulkAction={true}
          striped={true}
        />
      </div>
    </div>
  );
};
