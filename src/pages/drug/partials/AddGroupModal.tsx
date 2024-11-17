import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { IActionModal } from "model/OtherModel";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import { IFieldCustomize, IFormData, IValidation } from "model/FormModel";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import GroupService from "services/GroupService";
import CategoryService from "services/CategoryService";
import { isDifferenceObj, showToast } from "utils/common";
import { IGroupRequest } from "model/drug/request/GroupModelRequest";
import { ICategoryRequest } from "model/drug/request/CategoryModelRequest";
import { AddGroupModalProps } from "model/drug/PropsModel";
import { useActiveElement } from "utils/hookCustom";

export default function AddGroupModal(props: AddGroupModalProps) {
  const { onShow, data, isDrug, isGroup, onHide } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const focusedElement = useActiveElement();
  const values = useMemo(
    () => ({
      name: data?.name ?? "",
    }),
    [data, onShow]
  );

  const validations: IValidation[] = [
    {
      name: "name",
      rules: "required",
    },
  ];

  const listField: IFieldCustomize[] = [
    {
      label: `Tên ${isGroup ? "nhóm" : "danh mục"} ${isDrug ? "thuốc" : "sản phẩm"}`,
      name: "name",
      type: "text",
      fill: true,
    },
  ];

  const [formData, setFormData] = useState<IFormData>({
    values: {},
  });

  useEffect(() => {
    setFormData({ ...formData, values: values, errors: {} });
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, [values]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = Validate(validations, formData, listField);
    if (Object.keys(errors).length > 0) {
      setFormData((prevState) => ({ ...prevState, errors: errors }));
      return;
    }
    setIsSubmit(true);
    let response = null;
    if (isGroup) {
      const body: IGroupRequest = {
        ...(formData.values as IGroupRequest),
        ...(data ? { id: data.id } : {}),
        is_drug: isDrug,
      };
      response = await GroupService.save(body);
    } else {
      const body: ICategoryRequest = {
        ...(formData.values as ICategoryRequest),
        ...(data ? { id: data.id } : {}),
        is_drug: isDrug,
      };
      response = await CategoryService.save(body);
    }
    if (response.code === 200) {
      showToast(
        `${data ? "Cập nhật" : "Thêm mới"} ${isGroup ? "nhóm" : "danh mục"} ${
          isDrug ? "thuốc" : "sản phẩm"
        } thành công`,
        "success"
      );
      onHide(true);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
      setIsSubmit(false);
    }
  };

  const onDelete = async (id: number) => {
    let response = null;
    if (isGroup) {
      response = await GroupService.delete(id).then((res) => {
        return res;
      });
    } else {
      response = await CategoryService.delete(id).then((res) => {
        return res;
      });
    }
    if (response.code === 200) {
      showToast(`Xóa ${isGroup ? "nhóm" : "danh mục"} ${isDrug ? "thuốc" : "sản phẩm"} thành công`, "success");
      onHide(true);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setShowDialog(false);
    setContentDialog(null);
  };

  const actions = useMemo<IActionModal>(
    () => ({
      actions_left: {
        buttons: data
          ? [
              {
                title: "Xoá",
                color: "destroy",
                variant: "outline",
                disabled: isSubmit,
                callback: () => showDialogConfirmCancelDelete(data.id),
              },
            ]
          : [],
      },
      actions_right: {
        buttons: [
          {
            title: "Hủy",
            color: "primary",
            variant: "outline",
            disabled: isSubmit,
            callback: () => {
              !isDifferenceObj(formData.values, values) ? onHide(false) : showDialogConfirmCancelDelete();
            },
          },
          {
            title: data ? "Cập nhật" : "Tạo mới",
            type: "submit",
            color: "primary",
            disabled:
              isSubmit ||
              !isDifferenceObj(formData.values, values) ||
              (formData.errors && Object.keys(formData.errors).length > 0),
            is_loading: isSubmit,
          },
        ],
      },
    }),
    [formData.values, values, isSubmit]
  );

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<IContentDialog>(null);

  const showDialogConfirmCancelDelete = (id?: number) => {
    const contentDialog: IContentDialog = {
      color: id ? "error" : "warning",
      className: id ? "dialog-delete" : "dialog-cancel",
      isCentered: true,
      isLoading: id ? true : false,
      title: id ? (
        <Fragment>
          Xóa {isGroup ? "nhóm" : "danh mục"} {isDrug ? "thuốc" : "sản phẩm"}
        </Fragment>
      ) : (
        <Fragment>
          Hủy bỏ thao tác {data ? "chỉnh sửa" : "thêm mới"} {isGroup ? "nhóm" : "danh mục"}
        </Fragment>
      ),
      message: id ? (
        <Fragment>
          Bạn có chắc chắn muốn xóa bỏ {isGroup ? "nhóm" : "danh mục"} {isDrug ? "thuốc " : "sản phẩm "}
          <strong>{data.name}</strong>? Thao tác này không thể khôi phục.
        </Fragment>
      ) : (
        <Fragment>Bạn có chắc chắn muốn hủy bỏ? Thao tác này không thể khôi phục.</Fragment>
      ),
      cancelText: id ? "Hủy" : "Quay lại",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: id ? "Xóa" : "Xác nhận",
      defaultAction: () => {
        if (id) {
          onDelete(id);
        } else {
          onHide(false);
          setShowDialog(false);
          setContentDialog(null);
        }
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
          showDialogConfirmCancelDelete();
          if (focusedElement instanceof HTMLElement) {
            focusedElement.blur();
          }
        } else {
          onHide(false);
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
        className="modal-group-category"
        isFade={true}
        staticBackdrop={true}
        toggle={() => !isSubmit && onHide(false)}
        isCentered={true}
      >
        <form className="form-category-group" onSubmit={(e) => onSubmit(e)}>
          <ModalHeader
            title={`${data ? "Chỉnh sửa" : "Thêm mới"}${isGroup ? " nhóm" : " danh mục"}${
              isDrug ? " thuốc" : " sản phẩm"
            }`}
            toggle={() => !isSubmit && onHide(false)}
          />
          <ModalBody>
            {listField.map((field, index) => (
              <FieldCustomize
                field={field}
                key={index}
                handleUpdate={(value) =>
                  handleChangeValidate(value, field, formData, validations, listField, setFormData)
                }
                formData={formData}
              />
            ))}
          </ModalBody>
          <ModalFooter actions={actions} />
        </form>
      </Modal>
      <Dialog content={contentDialog} isOpen={showDialog} />
    </Fragment>
  );
}
