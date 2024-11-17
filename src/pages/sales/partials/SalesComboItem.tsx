import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SalesComboPrescriptionProps } from "model/invoice/PropsModel";
import Button from "components/button/button";
import Icon from "components/icon";
import { IFieldCustomize, IValidation } from "model/FormModel";
import Validate, { handleChangeValidate } from "utils/validate";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import { formatCurrency } from "utils/common";
import SalesItem from "./SalesItem";
import { IFormDataItemSale } from "model/invoice/request/SalesInvoiceModelRequest";
import _ from "lodash";

export default function SalesComboItem(props: SalesComboPrescriptionProps) {
  const { formData, setFormData, onRemove, handleSubmitRefSaleComboItem, onChooseDrugForSale } = props;
  const [isShowMore, setIsShowMore] = useState<boolean>(true);

  const validations: IValidation[] = [
    {
      name: "combo_name",
      rules: "required|max_equal:255",
    },
    {
      name: "quantity",
      rules: "required|min_equal:1",
    },
    {
      name: "price",
      rules: "required",
    },
  ];

  const listField: IFieldCustomize[] = useMemo(
    () => [
      {
        label: "Tên combo - thuốc liều",
        labelPosition: "left",
        name: "combo_name",
        type: "text",
        required: true,
      },
      {
        label: "Số lượng",
        labelPosition: "left",
        name: "quantity",
        type: "number",
        required: true,
        isButton: true,
      },
      {
        label: "Giá bán/liều",
        labelPosition: "left",
        name: "price",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        required: true,
        isWarning: formData?.values?.price < (formData?.items?.reduce((a, b) => +a + b?.values?.price, 0) ?? 0),
        messageWarning:
          formData?.values?.price < (formData?.items?.reduce((a, b) => +a + b?.values?.price, 0) ?? 0)
            ? "Giá bán/liều nhỏ hơn đơn giá tham khảo"
            : "",
      },
      {
        label: "Thành tiền",
        labelPosition: "left",
        name: "total_amount",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        disabled: true,
      },
      {
        label: "Liều dùng - Cách dùng",
        labelPosition: "left",
        name: "note",
        type: "text",
      },
    ],
    [formData]
  );

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

  useEffect(() => {
    const totalAmount = formData?.values?.quantity * formData?.values?.price;
    if (totalAmount !== formData?.values?.total_amount) {
      setFormData({ ...formData, values: { ...formData.values, total_amount: totalAmount } });
    }
  }, [formData?.values?.quantity, formData?.values?.price]);

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
    <div className="sales-item sales-combo-item">
      <h3>Thông tin combo - thuốc liều</h3>
      <div className="sales-combo-infos">
        {listField.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listField, setFormData)}
            formData={formData}
          />
        ))}
      </div>
      <div className="sales-item-actions">
        <div className="sales-item-actions__left">
          <Button type="button" className="btn-add-sales" color="primary" variant="outline" hasIcon={true} onClick={onChooseDrugForSale}>
            <Icon name="PlusCircleFill" />
            Chọn sản phẩm bán combo
          </Button>
        </div>
        <div className="sales-item-actions__right">
          <ul className="extra-infos">
            <li>
              Số lượng mặt hàng: <strong>{formData?.items?.length ?? 0}</strong>
            </li>
            <li>
              Đơn giá tham khảo: <strong>{formatCurrency(formData?.items?.reduce((a, b) => +a + b?.values?.price, 0) ?? 0, ",")}</strong>
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
                formDataCombo={formData}
                formData={unit}
                typeItem="combo"
                setFormData={(formDataItemSale) => updateUnit(formDataItemSale, index)}
                onRemove={() => removeUnit(index)}
                handleSubmitRefSaleItem={refItem}
              />
            );
          })}
        </div>
      )}
      <Button type="button" className="btn-remove-item" color="transparent" hasIcon={true} onlyIcon={true} onClick={onRemove}>
        <Icon name="Times" />
      </Button>
    </div>
  );
}
