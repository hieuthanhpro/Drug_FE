import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { IDrug, INumber } from "model/drug/response/DrugModelResponse";
import Loading from "components/loading";
import { SystemNotification } from "components/systemNotification/systemNotification";
import DrugService from "services/DrugService";
import { formatCurrency, removeAccents, showToast } from "utils/common";
import BoxTable from "components/boxTable/boxTable";
import SelectCustom from "components/selectCustom/selectCustom";
import Checkbox from "components/checkbox/checkbox";
import { IAction, IActionModal } from "model/OtherModel";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { PrintBarcode, PrintQrcode } from "exports/pdf";
import moment from "moment";
import { ContextType, UserContext } from "contexts/userContext";
import { DrugDetailProps } from "model/drug/PropsModel";
import "./DrugDetailModal.scss";

export default function DrugDetailModal(props: DrugDetailProps) {
  const { data, isDrug, onShow, onHide } = props;
  const { drug_store } = useContext(UserContext) as ContextType;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailDrug, setDetailDrug] = useState<IDrug>(null);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [numberSelectPrint, setNumberSelectPrint] = useState<string>(null);

  const isMounted = useRef(false);
  const refNumberChoose = useRef<any>();

  const abortController = new AbortController();
  const getDetailDrug = async () => {
    setIsLoading(true);
    const response = await DrugService.detail(data.id, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setDetailDrug(result);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true && onShow && data) {
      setIsLoading(true);
      getDetailDrug();
      setNumberSelectPrint(null);
      setListIdChecked([]);
    }
  }, [onShow, data]);

  const info = useMemo(
    () => [
      {
        id: "name",
        label: `Tên ${isDrug ? "thuốc" : "sản phẩm"}`,
        value: detailDrug?.name,
      },
      {},
      {
        id: "code",
        label: `Mã ${isDrug ? "thuốc" : "sản phẩm"}`,
        value: detailDrug?.drug_code,
      },
      {
        id: "shortName",
        label: "Tên viết tắt",
        value: detailDrug?.short_name,
      },
      {
        id: "barcode",
        label: "Barcode",
        value: detailDrug?.barcode,
      },
      {},
      {
        id: "category",
        label: `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`,
        value: detailDrug?.drug_category_name,
      },
      {
        id: "group",
        label: `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}`,
        value: detailDrug?.drug_group_name,
      },
      {},
      {
        id: "substances",
        label: "Hoạt chất",
        value: detailDrug?.substances,
      },
      {},
      {
        id: "concentration",
        label: "Hàm lượng",
        value: detailDrug?.concentration,
      },
      {
        id: "packageForm",
        label: "Quy cách đóng gói",
        value: detailDrug?.package_form,
      },
      {},
      {
        id: "company",
        label: "Công ty SX",
        value: detailDrug?.company,
      },
      {
        id: "country",
        label: "Xuất xứ",
        value: detailDrug?.country,
      },
      {
        id: "registryNumber",
        label: "Số đăng ký",
        value: detailDrug?.registry_number,
      },
      {},
    ],
    [detailDrug]
  );

  const titlesUnit = [
    ...(detailDrug?.numbers && detailDrug?.numbers.length > 0 ? ["Chọn đơn vị in"] : []),
    "Đơn vị",
    "Đơn vị quy đổi",
    "Giá vốn",
    "Giá bán",
    "Số lượng cảnh báo tối thiểu",
    "Số lượng cảnh báo tối đa",
  ];
  const dataFormat = [
    ...(detailDrug?.numbers && detailDrug?.numbers.length > 0 ? ["text-center"] : []),
    "",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
  ];

  const dataMappingArray = (item) => [
    ...(detailDrug?.numbers && detailDrug?.numbers.length > 0
      ? [
          <Checkbox
            key={item.unit_id}
            checked={listIdChecked.some((id) => id === item.id)}
            onChange={(e) => {
              if (e.target.checked === true) {
                setListIdChecked([...listIdChecked, item.id]);
              } else {
                setListIdChecked(listIdChecked.filter((id) => id !== item.id));
              }
            }}
          />,
        ]
      : []),
    item.unit_name,
    item.exchange,
    formatCurrency(+item.main_cost, ","),
    formatCurrency(+item.current_cost, ","),
    detailDrug?.warning_unit
      ? detailDrug?.warning_unit === item.unit_id
        ? detailDrug?.warning_quantity_min ?? 0
        : (+detailDrug?.warning_quantity_min / item.exchange).toFixed(0)
      : 0,
    detailDrug?.warning_unit
      ? detailDrug?.warning_unit === item.unit_id
        ? detailDrug?.warning_quantity_max ?? 0
        : (+detailDrug?.warning_quantity_max / item.exchange).toFixed(0)
      : 0,
  ];

  const actions = useMemo<IActionModal>(
    () => ({
      actions_right: {
        buttons: [
          {
            title: "Chỉnh sửa",
            color: "primary",
            variant: "outline",
            callback: () => onHide(data.id),
          },
          ...((detailDrug?.numbers && detailDrug?.numbers.length > 0
            ? [
                {
                  title: "In QR Code x2",
                  type: "button",
                  color: "primary",
                  callback: () => {
                    if (numberSelectPrint) {
                      handlePrintQrcode();
                    } else {
                      if (refNumberChoose && refNumberChoose.current) {
                        refNumberChoose.current.focus();
                      }
                      showToast("Chưa chọn lô để in", "error");
                    }
                  },
                },
                {
                  title: "In Bar Code x2",
                  type: "button",
                  color: "primary",
                  callback: () => {
                    if (numberSelectPrint) {
                      handlePrintBarcode();
                    } else {
                      if (refNumberChoose && refNumberChoose.current) {
                        refNumberChoose.current.focus();
                      }
                      showToast("Chưa chọn lô để in", "error");
                    }
                  },
                },
              ]
            : []) as IAction[]),
        ],
      },
    }),
    [detailDrug, numberSelectPrint, listIdChecked]
  );

  const qrcodeCanvas = useRef(null);
  const barcodeSvg = useRef(null);

  useEffect(() => {
    if (qrcodeCanvas?.current && numberSelectPrint) {
      QRCode.toCanvas(qrcodeCanvas.current, `${detailDrug?.drug_code}_${numberSelectPrint}`, function (error) {
        if (error) {
          console.log(error);
        }
      });
    }
    if (barcodeSvg?.current && numberSelectPrint) {
      JsBarcode(barcodeSvg.current, `${detailDrug?.drug_code}_${removeAccents(numberSelectPrint)}`, {
        displayValue: false,
      });
    }
  }, [detailDrug, numberSelectPrint]);

  const handlePrintQrcode = () => {
    handlePrintStamp(PrintQrcode, qrcodeCanvas);
  };

  const handlePrintBarcode = () => {
    handlePrintStamp(PrintBarcode, barcodeSvg);
  };

  const handlePrintStamp = (printFunc, canvasElement) => {
    let batchNumber: INumber = detailDrug.numbers.find((item) => item.number === numberSelectPrint);
    if (batchNumber?.expiry_date) {
      batchNumber = {
        ...batchNumber,
        expiry_date: moment(batchNumber.expiry_date).format("DD/MM/YYYY"),
      };
    }
    printFunc(
      canvasElement.current,
      drug_store,
      detailDrug.name,
      batchNumber,
      detailDrug?.units.filter((item) => listIdChecked.some((id) => id === item.unit_id))
    );
  };

  return (
    <>
      <Modal isOpen={onShow} className="modal-drug-detail" isFade={true} toggle={onHide} isCentered={true}>
        <ModalHeader title={`Chi tiết ${isDrug ? "thuốc" : "sản phẩm"} ${data?.name} - ${data?.drug_code}`} toggle={onHide} />
        {isLoading ? (
          <ModalBody>
            <Loading />
          </ModalBody>
        ) : detailDrug ? (
          <Fragment>
            <ModalBody>
              <Fragment>
                <div className="drug-detail-info">
                  {info.map((item, index) =>
                    item.label ? (
                      <div className="item" id={item.id} key={index}>
                        <span>{item.label}:</span> <strong>{item.value}</strong>
                      </div>
                    ) : (
                      <div className="item-break" key={index}></div>
                    )
                  )}
                </div>
                {detailDrug?.numbers && detailDrug?.numbers.length > 0 && (
                  <Fragment>
                    <SelectCustom
                      label="Lô thuốc in tem"
                      options={detailDrug?.numbers.map((item) => {
                        return {
                          label: item.number,
                          value: item.number,
                        };
                      })}
                      value={numberSelectPrint}
                      placeholder="Chọn lô thuốc in tem"
                      onChange={(e) => setNumberSelectPrint(e.value)}
                      refSelect={refNumberChoose}
                    />
                    <div className={`qrcode-barcode ${qrcodeCanvas?.current && barcodeSvg?.current && numberSelectPrint ? "" : "d-none"}`}>
                      <div className="item">
                        <p>QR Code</p>
                        <canvas ref={qrcodeCanvas}></canvas>
                      </div>
                      <div className="item">
                        <p>Bar Code</p>
                        <svg ref={barcodeSvg}></svg>
                      </div>
                    </div>
                  </Fragment>
                )}
                {detailDrug?.units && (
                  <BoxTable
                    name="Đơn vị"
                    titles={titlesUnit}
                    items={detailDrug?.units.map((item) => {
                      return { ...item, id: item.unit_id };
                    })}
                    dataFormat={dataFormat}
                    dataMappingArray={(item) => dataMappingArray(item)}
                    isBulkAction={true}
                    striped={true}
                  />
                )}
              </Fragment>
            </ModalBody>
            <ModalFooter actions={actions} />
          </Fragment>
        ) : (
          <ModalBody>
            <SystemNotification type="not-found" />
          </ModalBody>
        )}
      </Modal>
    </>
  );
}
