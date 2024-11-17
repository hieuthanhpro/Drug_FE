import React, { useCallback, useEffect, useMemo } from "react";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Icon from "components/icon";
import { IFieldCustomize, IValidation } from "model/FormModel";
import { listVat } from "model/invoice/DataModelInitial";
import { IOption } from "model/OtherModel";
import Validate, { handleChangeValidate } from "utils/validate";
import { INumber, IUnit } from "model/drug/response/DrugModelResponse";
import { formatCurrency } from "utils/common";
import { IItemSale } from "model/invoice/request/SalesInvoiceModelRequest";
import { SalesItemUnitProps } from "model/invoice/PropsModel";
import _ from "lodash";
import moment from "moment";
import { useWindowDimensions } from "utils/hookCustom";

export default function SalesItemUnit(props: SalesItemUnitProps) {
  const { typeItem, formData, setFormData, handleSubmitRefSaleItem, formDataCombo, type } = props;

  const drug = formData?.data?.drug;
 

  const units = useMemo(
    () => drug.units && (type==="order"?  [...(drug?.units || drug.other_units)] as IUnit[]  : [...JSON.parse(drug?.units || drug.other_units)] as IUnit[]),
    [formData?.data?.drug]
  );
  const numbers = useMemo(() => drug.numbers && ([...JSON.parse(drug?.numbers)] as INumber[]), [formData?.data?.drug]);

  const { width, height } = useWindowDimensions();

  const validations: IValidation[] = [
    {
      name: "number",
      rules: "required",
    },
    {
      name: "expiry_date",
      rules: "required",
    },
    {
      name: "unit_id",
      rules: "required",
    },
    {
      name: "quantity",
      rules: "required|min_equal:1|max_equal:warehouse_quantity",
    },
    {
      name: "combo_quantity",
      rules: "required|min_equal:1|max_equal:warehouse_quantity",
    },
    {
      name: "price",
      rules: "required",
    },
    {
      name: "discount",
      rules: "max_equal:price",
    },
    {
      name: "discount_percentage",
      rules: "min_equal:0|max_equal:100",
    },
  ];

  const listField: IFieldCustomize[] = useMemo(
    () =>
      type !== "order"
        ? ([
            {
              label: "Lô sản xuất",
              labelPosition: "left",
              name: "number",
              type: `${type === "warehouse" ? "text" : "select"}`,
              required: true,
              options:
                type === "warehouse"
                  ? null
                  : numbers &&
                    (numbers.map((number) => {
                      return {
                        value: number.number,
                        label: number.number,
                      } as IOption;
                    }) as IOption[]),
            },
            {
              label: "Đơn vị tính",
              labelPosition: "left",
              name: "unit_id",
              type: "select",
              required: true,
              options:
                units &&
                (units.map((unit) => {
                  return {
                    value: unit.unit_id,
                    label: `${unit.unit_name}${unit.exchange > 1 ? ` (x${unit.exchange})` : ""}`,
                  } as IOption;
                }) as IOption[]),
            },
            {
              label: "Số lượng",
              labelPosition: "left",
              name: typeItem === "combo" ? "combo_quantity" : "quantity",
              type: "number",
              required: true,
              isButton: true,
            },
            ...(typeItem === "combo"
              ? [
                  {
                    label: "Tổng cộng",
                    labelPosition: "left",
                    name: "quantity",
                    type: "number",
                    required: true,
                    disabled: true,
                  },
                ]
              : []),
            {
              label: "Số lượng tồn kho",
              labelPosition: "left",
              name: "warehouse_quantity",
              type: "number",
              required: true,
              disabled: true,
              hidden: true,
            },
            {
              label: type === "warehouse" ? "Giá nhập" : "Giá bán",
              labelPosition: "left",
              name: "price",
              type: "number",
              currency: "VND",
              suffixes: "₫",
              required: true,
              disabled: typeItem === "combo",
              isWarning:
                (formData?.values?.price ?? 0) <
                units?.find((unit) => unit.unit_id === formData?.values?.unit_id)?.main_cost,
              messageWarning:
                (formData?.values?.price ?? 0) <
                units?.find((unit) => unit.unit_id === formData?.values?.unit_id)?.main_cost
                  ? "Giá bán thấp hơn giá nhập"
                  : null,
            },
            {
              label: "Hạn dùng",
              labelPosition: "left",
              name: "expiry_date",
              type: "date",
              required: true,
              disabled: type === "warehouse" ? false : true,
              icon: <Icon name="Calendar" />,
              iconPosition: "left",
              isWarning:
                formData?.values?.expiry_date &&
                moment(formData?.values?.expiry_date, "DD/MM/yyyy").unix() > moment().unix() &&
                moment(formData?.values?.expiry_date, "DD/MM/yyyy").unix() - moment().unix() < 180 * 86400,
              messageWarning:
                formData?.values?.expiry_date &&
                moment(formData?.values?.expiry_date, "DD/MM/yyyy").unix() > moment().unix() &&
                moment(formData?.values?.expiry_date, "DD/MM/yyyy").unix() - moment().unix() < 180 * 86400
                  ? "Hàng cận date"
                  : null,
            },
            {
              label: "VAT",
              labelPosition: "left",
              placeholder: "Chọn VAT",
              name: "vat",
              type: "select",
              options: listVat,
            },
            ...(typeItem !== "combo"
              ? [
                  {
                    label: "Giảm giá",
                    labelPosition: "left",
                    name: "discount",
                    type: "number",
                    currency: "VND",
                    suffixes: "₫",
                  },
                  {
                    label: "Tỉ lệ giảm giá",
                    labelPosition: "left",
                    name: "discount_percentage",
                    type: "number",
                    min: 0,
                    suffixes: "%",
                  },
                  {
                    label: "Giảm giá CTKM",
                    labelPosition: "left",
                    name: "discount_promotion",
                    type: "number",
                    currency: "VND",
                    suffixes: "₫",
                    disabled: true,
                  },
                ]
              : []),
            {
              label: "Thành tiền",
              labelPosition: "left",
              name: "total_amount",
              type: "number",
              currency: "VND",
              suffixes: "₫",
              disabled: true,
            },
            ...(typeItem !== "combo"
              ? [
                  {
                    label: "Ghi chú",
                    labelPosition: "left",
                    name: "note",
                    type: "text",
                  },
                ]
              : []),
          ] as IFieldCustomize[])
        : ([
            {
              label: "Đơn vị tính",
              labelPosition: "left",
              name: "unit_id",
              type: "select",
              required: true,
              options: units
                ? (units.map((unit) => {
                    return {
                      value: unit.unit_id,
                      label: `${unit.unit_name}${unit.exchange > 1 ? ` (x${unit.exchange})` : ""}`,
                    } as IOption;
                  }) as IOption[])
                : (JSON.parse(formData?.data?.drug.other_units).map((unit) => {
                    return {
                      value: unit.unit_id,
                      label: `${unit.unit_name}${unit.exchange > 1 ? ` (x${unit.exchange})` : ""}`,
                    } as IOption;
                  }) as IOption[]),
            },
            {
              label: "Số lượng",
              labelPosition: "left",
              name: typeItem === "combo" ? "combo_quantity" : "quantity",
              type: "number",
              required: true,
              isButton: true,
            },

            {
              label: "Đơn giá",
              labelPosition: "left",
              name: "price",
              type: "number",
              currency: "VND",
              suffixes: "₫",
              required: true,
              disabled: true,
              isWarning:
                (formData?.values?.price ?? 0) <
                units?.find((unit) => unit.unit_id === formData?.values?.unit_id)?.main_cost,
              messageWarning:
                (formData?.values?.price ?? 0) <
                units?.find((unit) => unit.unit_id === formData?.values?.unit_id)?.main_cost
                  ? "Giá bán thấp hơn giá nhập"
                  : null,
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
            ...(typeItem !== "combo"
              ? [
                  {
                    label: "Ghi chú",
                    labelPosition: "left",
                    name: "note",
                    type: "text",
                  },
                ]
              : []),
          ] as IFieldCustomize[]),
    [formData?.values?.price, formData?.values?.expiry_date]
  );


  useEffect(() => {
    const price = units
    ? units?.find((unit) => unit.unit_id === formData?.values?.unit_id)?.current_cost
    : drug.other_units ? JSON.parse(drug?.other_units).find((unit) => unit.unit_id === formData?.values?.unit_id)?.current_cost:drug.current_cost

    if (+price !== +formData?.values?.price) {
      let formDataTemp = _.cloneDeep(formData);
      formDataTemp = {
        ...formDataTemp,
        values: {
          ...formDataTemp?.values,
          price: price,
          warehouse_quantity:
            numbers?.find((number) => number.number === formDataTemp?.values?.number)?.quantity /
            units?.find((unit) => unit.unit_id === formDataTemp?.values?.unit_id)?.exchange,
        },
      };
      setFormData(formDataTemp);
    }
  }, [formData?.values?.unit_id, formData?.values?.number]);

  useEffect(() => {
    let formDataTemp = _.cloneDeep(formData);
    const totalVat =
      (+formDataTemp?.values?.vat / 100) *
      (+formDataTemp?.values?.price -
        (isNaN(formDataTemp?.values?.discount) ? 0 : formDataTemp?.values?.discount ?? 0) -
        (isNaN(formDataTemp?.values?.discount_promotion) ? 0 : formDataTemp?.values?.discount_promotion ?? 0)) *
      +formDataTemp?.values?.quantity;
    const totalAmount =
      +formDataTemp?.values?.quantity * +formDataTemp?.values?.price -
      (isNaN(formDataTemp?.values?.discount) ? 0 : formDataTemp?.values?.discount ?? 0) *
        +formDataTemp?.values?.quantity -
      (isNaN(formDataTemp?.values?.discount_promotion) ? 0 : formDataTemp?.values?.discount_promotion ?? 0) *
        +formDataTemp?.values?.quantity +
      totalVat;
    if (totalAmount !== formDataTemp?.values?.total_amount) {
      formDataTemp = {
        ...formDataTemp,
        values: {
          ...formDataTemp.values,
          ...(totalAmount !== formDataTemp?.values?.total_amount
            ? { total_amount: totalAmount > 0 ? totalAmount : 0 }
            : {}),
        } as IItemSale,
      };
      setFormData(formDataTemp);
    }
  }, [
    formData?.values?.price,
    formData?.values?.vat,
    formData?.values?.quantity,
    formData?.values?.combo_quantity,
    formData?.values?.discount,
    formData?.values?.discount_promotion,
  ]);

  useEffect(() => {
    let formDataTemp = _.cloneDeep(formData);
    const discount = (+(formDataTemp?.values?.discount_percentage ?? 0) / 100) * +formData?.values?.price;
    if (discount !== formDataTemp?.values?.discount) {
      formDataTemp = {
        ...formDataTemp,
        values: {
          ...formDataTemp.values,
          discount: discount,
        } as IItemSale,
      };
      setFormData(formDataTemp);
    }
  }, [formData?.values?.discount_percentage]);

  useEffect(() => {
    let formDataTemp = _.cloneDeep(formData);
    if (formDataCombo?.values?.quantity && formDataTemp?.values?.combo_quantity) {
      const quantity = formDataCombo?.values?.quantity * formDataTemp?.values?.combo_quantity;
      if (quantity !== formDataTemp?.values?.quanity) {
        formDataTemp = {
          ...formDataTemp,
          values: {
            ...formDataTemp.values,
            quantity: quantity,
          } as IItemSale,
        };
        setFormData(formDataTemp);
      }
    }
  }, [formData?.values?.combo_quantity, formDataCombo?.values?.quantity]);

  // Add event call from parent
  useEffect(() => {
    handleSubmitRefSaleItem.current = handleSubmitForm;
  }, [formData]);

  const handleSubmitForm = useCallback(() => {
    const errors = Validate(validations, formData, listField);
    if (errors && Object.keys(errors).length > 0) {
      setFormData({ ...formData, errors: errors });
      return true;
    }
    return false;
  }, [formData]);

  return (
    <div className="sales-item-unit">
      <ul className="sales-item-unit__info">
        <li>
          Tên thuốc: <strong>{drug?.name}</strong>
        </li>
        <li>
          Tồn kho: <strong>{formatCurrency(formData.values?.warehouse_quantity, ",", "")}</strong>
        </li>
      </ul>
      <div className="sales-item-unit__image">
        <div
          className="aspect-ratio"
          key={`product-image-${drug?.id}-${formData.values?.number}-${formData.values?.unit_id}`}
        >
          {drug?.image ? <img src={drug?.image} alt={drug?.name} /> : <Icon name="NoImage" />}
        </div>
      </div>
      <div className="sales-item-unit__form">
        {listField.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listField, setFormData)}
            formData={formData}
          />
        ))}
      </div>
    </div>
  );
}
