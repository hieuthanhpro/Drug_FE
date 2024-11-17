import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SalesComboPrescriptionProps } from "model/invoice/PropsModel";
import { IFieldCustomize } from "model/FormModel";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import Button from "components/button/button";
import Icon from "components/icon";
import { formatCurrency, showToast } from "utils/common";
import NoImage from "assets/images/no-image.png";
import SalesItem from "./SalesItem";
import { IFormDataItemSale } from "model/invoice/request/SalesInvoiceModelRequest";
import _ from "lodash";

export default function SalesPrescriptionItem(props: SalesComboPrescriptionProps) {
  const { formData, setFormData, onRemove, handleSubmitRefSaleComboItem, onChooseDrugForSale } = props;
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isShowMore, setIsShowMore] = useState<boolean>(true);

  const validations = useMemo(
    () => [
      {
        name: "name_patient",
        rules: "required|max_equal:255",
      },
      ...(formData?.values?.age_select === "year"
        ? [
            {
              name: "year_old",
              rules: "required",
            },
          ]
        : [
            {
              name: "month_old",
              rules: "required",
            },
          ]),
    ],
    [formData]
  );

  const listField: IFieldCustomize[] = useMemo(
    () =>
      [
        {
          label: "Mã bệnh nhận",
          labelPosition: "left",
          name: "patient_code",
          type: "text",
        },
        {
          label: "Tên bệnh nhân",
          labelPosition: "left",
          name: "name_patient",
          type: "text",
          required: true,
        },
        ...(formData?.values?.age_select === "year"
          ? [
              {
                label: "Năm tuổi",
                labelPosition: "left",
                name: "year_old",
                type: "number",
                required: true,
              },
            ]
          : [
              {
                label: "Tháng tuổi",
                labelPosition: "left",
                name: "month_old",
                type: "number",
                required: true,
              },
            ]),
        {
          label: "Tháng/Năm tuổi",
          labelPosition: "left",
          name: "age_select",
          type: "select",
          options: [
            {
              value: "year",
              label: "Năm tuổi",
            },
            {
              value: "month",
              label: "Tháng tuổi",
            },
          ],
          required: true,
        },
        {
          label: "Chiều cao (cm)",
          labelPosition: "left",
          name: "height",
          type: "number",
        },
        {
          label: "Cân nặng (kg)",
          labelPosition: "left",
          name: "weight",
          type: "number",
        },
        {
          label: "CMND / CCCD",
          placeholder: "Nhập CMND / CCCD",
          labelPosition: "left",
          name: "id_card",
          type: "text",
        },
        {
          label: "Thẻ BHYT",
          labelPosition: "left",
          name: "bhyt",
          type: "text",
        },
        {
          label: "Địa chỉ",
          labelPosition: "left",
          name: "patient_address",
          type: "text",
        },
        {
          label: "Bác sĩ kê đơn",
          labelPosition: "left",
          name: "doctor",
          type: "text",
        },
        {
          label: "Người giám hộ",
          labelPosition: "left",
          name: "caregiver",
          type: "text",
        },
        {
          label: "Mã đơn thuốc",
          labelPosition: "left",
          name: "code_invoice",
          type: "text",
        },
        {
          label: "Ngày kê đơn",
          labelPosition: "left",
          name: "created_at",
          type: "date",
        },
        {
          label: "Cơ sở khám bệnh",
          labelPosition: "left",
          name: "clinic",
          type: "text",
        },
        {
          label: "Địa chỉ CSKB",
          labelPosition: "left",
          name: "address",
          type: "text",
        },
      ] as IFieldCustomize[],
    [formData]
  );

  const refInputUpload = useRef<HTMLInputElement>();

  const handleImageUpload = (e) => {
    if (e.target.files[0] !== null && e.target.files.length > 0) {
      const maxSize = 1048576;
      if (e.target.files[0].size > maxSize) {
        showToast(`Ảnh đơn thuốc giới hạn dung lượng không quá 10Mb`, "error");
        e.target.value = "";
      } else {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setFormData({ ...formData, values: { ...formData.values, image_file: e.target.files[0] } });
      }
    }
  };

  const removeUnit = (index: number) => {
    const formDataTemp = _.cloneDeep(formData);
    formDataTemp.items.splice(index, 1);
    setFormData(formDataTemp);
  };

  const updateUnit = (formDataItemSale: IFormDataItemSale, index: number) => {
    const formDataTemp = _.cloneDeep(formData);
    formDataTemp.items[index] = formDataItemSale;
    setFormData(formDataTemp);
  };

  const refItem = React.useRef(null);

  // Add event call from parent
  useEffect(() => {
    handleSubmitRefSaleComboItem.current = handleSubmitForm;
  }, [formData]);

  const handleSubmitForm = useCallback(() => {
    const errors = Validate(validations, formData, listField);
    if (refItem && refItem.current) {
      const errorsItem = refItem.current();
      if (errorsItem) {
        return errorsItem;
      }
    }
    if (errors && Object.keys(errors).length > 0) {
      setFormData({ ...formData, errors: errors });
      return true;
    }
    return false;
  }, [formData]);

  return (
    <div className="sales-item sales-prescription-item">
      <h3>Thông tin đơn thuốc</h3>
      <div className="sales-prescription-main">
        <div className="sales-prescription-infos">
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
        </div>
        <div className="sales-prescription-image">
          {formData?.values?.image || formData?.values?.image_file ? (
            <Fragment>
              {imagePreview && formData?.values?.image_file ? (
                <img src={imagePreview} alt={formData?.values?.name} />
              ) : (
                <img
                  src={formData?.values?.image}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = NoImage;
                  }}
                  alt={formData?.values?.name}
                />
              )}
              <span className="actions">
                <span className="btn-change-image" onClick={() => refInputUpload.current.click()}>
                  Chọn ảnh khác
                </span>
                |
                <Button
                  type="button"
                  className="btn-remove-image"
                  color="link"
                  onClick={(e) => {
                    e.preventDefault();
                    setImagePreview("");
                    setFormData({ ...formData, values: { ...formData.values, image: "", image_file: "" } });
                  }}
                >
                  Xóa
                </Button>
              </span>
            </Fragment>
          ) : (
            <label
              htmlFor="imageUpload"
              className={`btn-upload-image${formData?.values?.image ? " has-image" : ""}`}
              onClick={(e) => (formData?.values?.image ? e.preventDefault() : undefined)}
            >
              <span>
                <Icon name="Plus" />
                Tải ảnh lên
              </span>
            </label>
          )}
          <input
            type="file"
            accept="image/gif,image/jpeg,image/png,image/jpg"
            className="d-none"
            id="imageUpload"
            onChange={(e) => handleImageUpload(e)}
            ref={refInputUpload}
          />
        </div>
      </div>
      <div className="sales-item-actions">
        <div className="sales-item-actions__left">
          <Button
            type="button"
            className="btn-add-sales"
            color="primary"
            variant="outline"
            hasIcon={true}
            onClick={onChooseDrugForSale}
          >
            <Icon name="PlusCircleFill" />
            Chọn thuốc bán theo đơn
          </Button>
        </div>
        <div className="sales-item-actions__right">
          <ul className="extra-infos">
            <li>
              Số lượng mặt hàng: <strong>{formData?.items?.length ?? 0}</strong>
            </li>
            <li>
              Đơn giá tham khảo:{" "}
              <strong>
                {formatCurrency(formData?.items?.reduce((a, b) => +a + b?.values?.total_amount, 0) ?? 0, ",")}
              </strong>
            </li>
          </ul>
          <Button
            type="button"
            className="btn-show-more"
            color="primary"
            disabled={formData?.items?.length === 0}
            onClick={() => setIsShowMore(!isShowMore)}
          >
            {isShowMore ? "Thu gọn" : "Chi tiết"}
          </Button>
        </div>
      </div>
      {isShowMore && formData?.items?.length > 0 && (
        <div className="list-sale-unit">
          {formData?.items?.map((unit, index) => {
            return (
              <SalesItem
                key={index}
                formData={unit}
                typeItem="prescription"
                setFormData={(formDataItemSale) => updateUnit(formDataItemSale, index)}
                onRemove={() => removeUnit(index)}
                handleSubmitRefSaleItem={refItem}
              />
            );
          })}
        </div>
      )}
      <Button
        type="button"
        className="btn-remove-item"
        color="transparent"
        hasIcon={true}
        onlyIcon={true}
        onClick={onRemove}
      >
        <Icon name="Times" />
      </Button>
    </div>
  );
}
