import Icon from "components/icon";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { IActionModal } from "model/OtherModel";
import React, { useMemo, useState } from "react";
import { formatCurrency } from "utils/common";

interface ReceiptModalDetailProps {
  onShow?: boolean;
  toggle?: any;
  isReceipt?: boolean;
  data: any;
}

export default function ReceiptModalDetail(props: ReceiptModalDetailProps) {
  const { onShow, toggle, isReceipt, data } = props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const dateConvert = data?.cash_date.split("-");

  const actions = useMemo<IActionModal>(
    () => ({
      actions_right: {
        buttons: [
          {
            title: "Xuất file",
            color: "primary",
            variant: "outline",
            disabled: isSubmit,
            callback: () => {
              // !isDifferenceObj(formData?.values, valuesDefault) &&
              // listFormUnitExchange.length === valuesUnitDefault.length &&
              // listFormUnitExchange.filter((formUnit) =>
              //   isDifferenceObj(valuesUnitDefault.find((unit) => unit.uuid === formUnit.uuid).values, formUnit.values)
              // ).length === 0
              //   ? onHide(false)
              //   : showDialogConfirmCancel();
            },
          },
          {
            title: `In phiếu ${isReceipt ? "thu" : "chi"} A4/A5`,
            type: "button",
            color: "primary",
            // disabled: disabledOnSubmit(),
            is_loading: isSubmit,
          },
        ],
      },
    }),
    [isSubmit]
  );

  return (
    <div className="receipt-modal-detail">
      <Modal
        isOpen={onShow}
        className="modal-group-category receipt-detail-modal"
        isFade={true}
        // staticBackdrop={true}
        toggle={toggle}
        isCentered={true}
      >
        <form className="form-category-group">
          <ModalHeader title={isReceipt ? "Chi tiết phiếu thu" : "Chi tiết phiếu chi"} toggle={toggle} />
          <ModalBody>
            <div className="receipt-detail-modal__header">
              <div className="receipt-detail-modal__header-left">
                <div className="logo">
                  <Icon name="LogoGDP" />
                </div>
                <div className="name">
                  <span className="name__gdp">(GDP) nhà thuốc Linh Test</span>
                  <span>
                    Địa chỉ: <b>Quận 12</b>
                  </span>
                  <span>
                    SDT: <b>0934345345</b>
                  </span>
                </div>
              </div>
              <div className="receipt-detail-modal__header-right">
                <span>Số: {data?.code}</span>
                <span>
                  Loại {isReceipt ? "thu" : "chi"}: {data?.cash_type_name}
                </span>
              </div>
            </div>

            <div className="receipt-detail-modal__body">
              <div className="receipt-detail-modal__body__head">
                <h4 className="receipt-detail-modal__body__title">{isReceipt ? "Phiếu thu" : "Phiếu chi"}</h4>
                <span className="receipt-detail-modal__body__date">
                  {data && "Ngày " + dateConvert[2] + " tháng " + dateConvert[1] + " năm " + dateConvert[0]}
                </span>
              </div>

              <div className="receipt-detail-modal__body__content">
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Họ tên người {isReceipt ? "nộp" : "nhận"} tiền: </span>
                  <span className="content">{data?.name}</span>
                </div>
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Địa chỉ: </span>
                  <span className="content">{data?.address}</span>
                </div>
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Lý do {isReceipt ? "thu" : "chi"}: </span>
                  <span className="content">{data?.reason}</span>
                </div>
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Số tiền:</span>
                  <span className="content">{formatCurrency(+data?.amount)}</span>
                </div>
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Viết bằng chữ:</span>
                  <span className="content">{formatCurrency(+data?.amount)}</span>
                </div>
                <div className="receipt-detail-modal__body__content__item">
                  <span className="key">Kèm theo:</span>
                  <span className="content">.....chứng từ gốc</span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter actions={actions} />
        </form>
      </Modal>
    </div>
  );
}
