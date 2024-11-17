import React, { useCallback, useEffect, useMemo } from "react";
import { IFieldCustomize, IValidation } from "model/FormModel";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import { AddDrugProps } from "model/drug/PropsModel";
import "./Warning.scss";

export default function Warning(props: AddDrugProps) {
  const { formData, listUnit, listFormUnitExchange, handleUpdate, handleSubmit,errorBridge,tabActive } = props;

  const validations: IValidation[] = [
    {
      name: "warning_quantity_min",
      rules: "min:0",
    },
    {
      name: "warning_quantity_max",
      rules: "min:0",
    },
    {
      name: "warning_days",
      rules: "required|min:0",
    },
  ];

  const listFieldWarehouse: IFieldCustomize[] = useMemo(
    () => [
      {
        label: "Đơn vị cảnh báo",
        name: "warning_unit",
        type: "select",
        options: Array.from(
          new Set([
            ...(formData?.values?.unit_id
              ? [
                  {
                    value: formData?.values?.unit_id,
                    label: `${listUnit?.find((unit) => unit.value === formData?.values?.unit_id)?.label}`,
                  },
                ]
              : []),
            ...listFormUnitExchange
              .filter(
                (formUnit, index, arr) =>
                  formUnit?.values?.unit_id &&
                  arr.findIndex((arrSame) => arrSame?.values?.unit_id === formUnit?.values?.unit_id) === index &&
                  formUnit?.values?.unit_id !== formData?.values?.unit_id
              )
              .map((formUnit) => {
                return {
                  value: formUnit.values.unit_id,
                  label: `${listUnit?.find((unit) => unit.value === formUnit.values.unit_id)?.label} (x${formUnit.values.exchange})`,
                };
              }),
          ])
        ),
      },
      {
        label: "Tồn kho tối thiểu",
        name: "warning_quantity_min",
        type: "number",
        thousandSeparator: false,
      },
      {
        label: "Tồn kho tối đa",
        name: "warning_quantity_max",
        type: "number",
        thousandSeparator: false,
      },
    ],
    [listUnit, listFormUnitExchange, formData]
  );

  const listFieldOutDate: IFieldCustomize[] = [
    {
      label: "Đơn vị tính (ngày)",
      name: "warning_days",
      type: "number",
      required: true,
      thousandSeparator: false,
    },
  ];

  // Add event call from parent
  useEffect(() => {
    handleSubmit.current = handleSubmitForm;
  }, [formData]);

  const handleSubmitForm = useCallback(() => {
    const errors = Validate(validations, formData, [...listFieldWarehouse, ...listFieldOutDate]);
    const isError= errors && Object.keys(errors).length > 0

    if (isError)  errorBridge.push(errors)

    if (isError && tabActive.value === 'warning') {
      
      handleUpdate({ ...formData, errors: errors });
      return true;
    } else if (isError && tabActive.value !== 'warning' && errorBridge.length===1){
      handleUpdate({ ...formData, errors: errors });
      return true;
    }

    return false;
  }, [formData]);

  return (
    <div className="warning-drug">
      <h2>Cảnh báo tồn kho</h2>
      <div className="list-form-group">
        {listFieldWarehouse.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listFieldWarehouse, handleUpdate)}
            formData={formData}
          />
        ))}
      </div>
      <h2 className="title-outdate">Cảnh báo hết hạn (Hạn dùng của sản phẩm)</h2>
      <div className="list-form-group">
        {listFieldOutDate.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listFieldOutDate, handleUpdate)}
            formData={formData}
          />
        ))}
      </div>
    </div>
  );
}
