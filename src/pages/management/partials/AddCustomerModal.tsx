import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { IActionModal } from "model/OtherModel";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import { IFieldCustomize, IFormData, IValidation } from "model/FormModel";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import { isDifferenceObj, showToast } from "utils/common";
import { useActiveElement } from "utils/hookCustom";
import { AddCustomerProps } from "model/customer/PropsModel";
import { ICustomerRequest } from "model/customer/request/CustomerRequestModel";
import { EMAIL_REGEX, PHONE_REGEX } from "utils/constant";
import CustomerService from "services/CustomerService";
import "./AddCustonerModal.scss";

export default function AddCustomerModal(props: AddCustomerProps) {
  const { onShow, data, onHide } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const focusedElement = useActiveElement();
  const values = useMemo(
    () =>
      ({
        type: data?.gender && data?.gender === "company" ? "company" : "personal",
        name: data?.name ?? "",
        gender: data?.gender ?? "male",
        address: data?.address ?? "",
        birthday: data?.birthday ?? "",
        email: data?.email ?? "",
        number_phone: data?.number_phone ?? "",
        tax_number: data?.tax_number ?? "",
        website: data?.website ?? "",
      } as ICustomerRequest),
    [data, onShow]
  );

  const [formData, setFormData] = useState<IFormData>({
    values: values,
  });

  const validations: IValidation[] = useMemo(
    () =>
      [
        {
          name: "name",
          rules: "required",
        },
        ...(formData?.values?.type === "personal"
          ? [
              {
                name: "gender",
                rules: "required",
              },
            ]
          : []),
        {
          name: "email",
          rules: "nullable|regex",
        },
        {
          name: "number_phone",
          rules: "nullable|regex",
        },
      ] as IValidation[],
    [formData.values]
  );

  const listFieldType: IFieldCustomize[] = [
    {
      label: "Kiểu khách hàng",
      name: "type",
      type: "radio",
      options: [
        {
          value: "personal",
          label: "Cá nhân",
        },
        {
          value: "company",
          label: "Công ty / Tổ chức",
        },
      ],
    },
  ];

  const listField = useMemo(
    () =>
      [
        {
          label: "Tên khách hàng",
          name: "name",
          type: "text",
          required: true,
        },
        ...(formData?.values?.type === "personal"
          ? [
              {
                label: "Giới tính",
                name: "gender",
                type: "select",
                options: [
                  {
                    value: "male",
                    label: "Nam",
                  },
                  {
                    value: "fmale",
                    label: "Nữ",
                  },
                ],
                required: true,
              },
              {
                label: "Ngày sinh",
                name: "birthday",
                type: "date",
              },
            ]
          : []),
        {
          label: "Số điện thoại",
          name: "number_phone",
          type: "text",
          regex: new RegExp(PHONE_REGEX),
          messageErrorRegex: "Số điện thoại không đúng định dạng",
        },
        {
          label: "Email",
          name: "email",
          type: "text",
          regex: new RegExp(EMAIL_REGEX),
          messageErrorRegex: "Email không đúng định dạng",
        },
        {
          label: "Website",
          name: "website",
          type: "text",
        },
        {
          label: "Mã số thuế",
          name: "tax_number",
          type: "text",
        },
        {
          label: "Địa chỉ",
          name: "address",
          type: "text",
        },
      ] as IFieldCustomize[],
    [formData.values]
  );

  useEffect(() => {
    setFormData({ ...formData, values: values, errors: {} });
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, [values]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = Validate(validations, formData, [...listFieldType, ...listField]);
    if (Object.keys(errors).length > 0) {
      setFormData((prevState) => ({ ...prevState, errors: errors }));
      return;
    }
    setIsSubmit(true);
    let response = null;
    const body: ICustomerRequest = {
      ...(data ? { id: data.id } : {}),
      ...(formData.values as ICustomerRequest),
      gender: formData.values.type === "company" ? "company" : formData.values.gender,
    };
    response = await CustomerService.save(body);
    if (response.code === 200) {
      showToast(`${data ? "Cập nhật" : "Thêm mới"} thành công`, "success");
      onHide(response.result);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
      setIsSubmit(false);
    }
  };

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
              !isDifferenceObj(formData.values, values) ? onHide() : showDialogConfirmCancel();
            },
          },
          {
            title: data ? "Cập nhật" : "Tạo mới",
            type: "submit",
            color: "primary",
            disabled: isSubmit || !isDifferenceObj(formData.values, values) || (formData.errors && Object.keys(formData.errors).length > 0),
            is_loading: isSubmit,
          },
        ],
      },
    }),
    [formData.values, values, isSubmit]
  );

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<IContentDialog>(null);

  const showDialogConfirmCancel = () => {
    const contentDialog: IContentDialog = {
      color: "warning",
      className: "dialog-cancel",
      isCentered: true,
      isLoading: false,
      title: "Hủy bỏ thao tác",
      message: "Bạn có chắc chắn muốn hủy bỏ? Thao tác này không thể khôi phục.",
      cancelText: "Quay lại",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => {
        onHide();
        setShowDialog(false);
        setContentDialog(null);
      },
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  const checkKeyDown = useCallback(
    (e) => {
      const { keyCode } = e;
      if (keyCode === 27 && !showDialog) {
        if (isDifferenceObj(formData.values, values)) {
          showDialogConfirmCancel();
          if (focusedElement instanceof HTMLElement) {
            focusedElement.blur();
          }
        } else {
          onHide();
        }
      }
    },
    [formData]
  );

  useEffect(() => {
    window.addEventListener("keydown", checkKeyDown);
    return () => {
      window.removeEventListener("keydown", checkKeyDown);
    };
  }, [checkKeyDown]);

  return (
    <Fragment>
      <Modal
        isOpen={onShow}
        className="modal-add-customer"
        isFade={true}
        staticBackdrop={true}
        toggle={() => !isSubmit && onHide()}
        isCentered={true}
      >
        <form className="form-add-customer" onSubmit={(e) => onSubmit(e)}>
          <ModalHeader title={`${data ? "Chỉnh sửa" : "Thêm mới"} khách hàng`} toggle={() => !isSubmit && onHide()} />
          <ModalBody>
            <Fragment>
              {listFieldType.map((field, index) => (
                <FieldCustomize
                  field={field}
                  key={index}
                  handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listFieldType, setFormData)}
                  formData={formData}
                />
              ))}
              <div className={`list-form-group${formData?.values?.type === "company" ? " is-company" : ""}`}>
                {listField.map((field, index) => (
                  <FieldCustomize
                    field={field}
                    key={index}
                    handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listField, setFormData)}
                    formData={formData}
                  />
                ))}
              </div>
            </Fragment>
          </ModalBody>
          <ModalFooter actions={actions} />
        </form>
      </Modal>
      <Dialog content={contentDialog} isOpen={showDialog} />
    </Fragment>
  );
}
