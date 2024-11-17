import Dialog from "components/dialog/dialog";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { ICashBookModelResponse } from "model/cashBook/response/cashBookModelResponse";
import { IFieldCustomize, IFormData, IValidation } from "model/FormModel";
import { IActionModal } from "model/OtherModel";
import React, { useEffect, useMemo, useState } from "react";
import CashBookService from "services/CashBookService";
import { isDifferenceObj, numberToVietnameseText, showToast } from "utils/common";
import Validate, { handleChangeValidate } from "utils/validate";

interface AddReceiptModalProps {
  onShow: boolean;
  onHide: (idEdit?: number) => void;
  isReceipt?: boolean;
  type?: string;
}

export default function AddReceiptModal(props: AddReceiptModalProps) {
  const { onShow, isReceipt, onHide, type } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [code, setCode] = useState<string>(null);
  const [listUnit, setListUnit] = useState<any>(
    !isReceipt
      ? [
        {
          value: 5,
          label: "Chi tiền trả hàng khách hàng",
        },
        {
          value: 6,
          label: " Chi tiền nhập hàng",
        },
      ]
      : [
        {
          value: 5,
          label: "Thu tiền bán hàng",
        },
        {
          value: 6,
          label: "Thu tiền nộp bổ sung",
        },
      ]
  );
  const values = useMemo(
    () => ({
      code: code ?? "",
    }),
    [onShow]
  );
  const [formData, setFormData] = useState<IFormData>({
    values: {},
  });

  const validations: IValidation[] = [
    {
      name: "name",
      rules: "required",
    },
    {
      name: "cash_type",
      rules: "required",
    },
    {
      name: "date",
      rules: "required",
    },
    {
      name: "phone",
      rules: "min:0",
    },
    {
      name: "address",
      rules: "max:250",
    },
    {
      name: "reason",
      rules: "required|max:500",
    },
    {
      name: "amount",
      rules: "required|min:0",
    },
    {
      name: "amount_text",
      rules: "max:250",
    },
    {
      name: "license",
      rules: "max:500",
    },
  ];

  useEffect(() => {
    const getCode = async () => {
      const res = await CashBookService.getCode(type);

      setCode(res.RESULT);
    };
    getCode();
  }, [onShow]);

  useEffect(() => {
    setFormData({ ...formData, values: values, errors: {} });
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, [values]);

  const listField: IFieldCustomize[] = [
    {
      label: isReceipt ? "Mã phiếu thu" : "Mã phiếu chi",
      name: "code",
      type: "text",
      fill: true,
      disabled: true,
    },
    {
      label: isReceipt ? "Loại thu" : "Loại chi",
      name: "cash_type",
      type: "select",
      fill: true,
      options: listUnit,
      required: true,
    },
    {
      label: "Ngày tháng",
      name: "cash_date",
      type: "date",
      fill: true,
      required: true,
    },
    {
      label: isReceipt ? "Họ tên người nộp tiền" : "Họ tên người nhận tiền",
      name: "name",
      type: "text",
      fill: true,
      required: true,
    },
    {
      label: "Số điện thoại",
      name: "phone",
      type: "number",
      fill: true,
    },
    {
      label: "Địa chỉ",
      name: "address",
      type: "text",
      fill: true,
    },
    {
      label: "Lý do",
      name: "reason",
      type: "text",
      fill: true,
      required: true,
    },
    {
      label: "Số tiền",
      name: "amount",
      type: "number",
      fill: true,
      required: true,
    },
    {
      label: "Số tiền(bằng chữ)",
      name: "amount_text",
      type: "text",
      fill: true,
    },
    {
      label: "Chứng từ đối chứng",
      name: "evidence",
      type: "text",
      fill: true,
    },
  ];

  const actions = useMemo<IActionModal>(
    () => ({
      actions_right: {
        buttons: [
          {
            title: "Hủy",
            color: "primary",
            variant: "outline",
            disabled: isSubmit,
            callback: () => {
              onHide();
              setFormData({ ...formData, errors: {}, values: {} });
            },
          },
          {
            title: "Xác nhận",
            type: "submit",
            color: "primary",
            // disabled:
            //   isSubmit ||
            //   !isDifferenceObj(formData.values, values) ||
            //   (formData.errors && Object.keys(formData.errors).length > 0),
            is_loading: isSubmit,
          },
        ],
      },
    }),
    [formData.values, isSubmit]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = Validate(validations, formData, listField);
    if (Object.keys(errors).length > 0) {
      setFormData((prevState) => ({ ...prevState, errors: errors }));
      return;
    }
    setIsSubmit(true);
    let response = null;

    const newBody = {
      ...formData.values,
      type: type,
      user_id: "",
      // invoice_id: "",
      // gdp_id: "",
      customer_id: "",
      // customer_choose: "",
    };
    response = await CashBookService.save(newBody);
    if (response.ERR_CODE === "200") {
      showToast(`Thêm mới ${isReceipt ? "phiếu thu" : "phiếu chi"} thành công`, "success");
      setIsSubmit(false);
      onHide();
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
      setIsSubmit(false);
    }
  };

  return (
    <div className="add-receipt-modal">
      <Modal isOpen={onShow} className="modal-group-category" isFade={true} staticBackdrop={true} toggle={onHide} isCentered={true}>
        <form className="form-category-group" onSubmit={(e) => onSubmit(e)}>
          <ModalHeader title={isReceipt ? "Tạo phiếu thu" : "Tạo phiếu chi"} toggle={onHide} />
          <ModalBody>
            {listField.map((field, index) => (
              <FieldCustomize
                field={field}
                key={index}
                handleUpdate={(value) => {
                  if (field.name === "amount") {
                    formData.values["amount_text"] = numberToVietnameseText(value);
                  }
                  return handleChangeValidate(value, field, formData, validations, listField, setFormData);
                }}
                formData={formData}
              />
            ))}
          </ModalBody>
          <ModalFooter actions={actions} />
        </form>
      </Modal>
      {/* <Dialog content={contentDialog} isOpen={showDialog} /> */}
    </div>
  );
}
