import React, { useEffect, useRef } from "react";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import { handleChangeValidate } from "utils/validate";
import { isDifferenceObj } from "utils/common";
import { UnitExchangeProps } from "model/drug/PropsModel";

export default function UnitExchangeItem(props: UnitExchangeProps) {
  const { item, formData, listFormUnitExchange, validationsUnit, listFieldUnitExchange, handleUpdate } = props;

  const isMounted = useRef(false);

  useEffect(() => {
    const values = {};
    values["unit_id"] = item?.values["unit_id"] ?? "";
    values["exchange"] = item?.values["exchange"] ?? 2;
    values["current_cost"] = item?.values["current_cost"] ?? 0;
    values["ratio"] = item?.values["ratio"] ?? 0;
    values["main_cost"] = item?.values["main_cost"] ?? 0;
    if (item?.values) {
      handleUpdate({ ...item, values: { ...item.values, ...values } });
    } else {
      handleUpdate({ ...item, values: values });
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      if (item?.values?.current_cost > item?.values?.main_cost) {
        const ratioUnit =
          item?.values?.main_cost === 0
            ? 0
            : (100 * ((item?.values?.current_cost ?? 0) - (item?.values?.main_cost ?? 0))) / (item?.values?.main_cost ?? 0);
        if (ratioUnit !== parseInt(item?.values?.ratio)) {
          handleUpdate({ ...item, values: { ...item.values, ratio: ratioUnit } });
        }
      } else {
        handleUpdate({ ...item, values: { ...item.values, ratio: 0 } });
      }
    }
  }, [item?.values?.current_cost]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      if (parseInt(item?.values?.main_cost) > 0 && item?.values?.base_ratio > 0) {
        const currentCost = ((item?.values?.main_cost ?? 0) / 100) * item?.values?.ratio + (item?.values?.main_cost ?? 0);
        if (currentCost !== item?.values?.current_cost && item?.values?.main_cost > 0) {
          handleUpdate({ ...item, values: { ...item.values, current_cost: currentCost } });
        }
      }
    }
  }, [item?.values?.ratio]);

  useEffect(() => {
    if (item?.values?.unit_id) {
      let errors = { ...item.errors };
      if (item.values.unit_id === formData.values.unit_id) {
        errors = { ...item.errors, unit_id: "Trùng với đơn vị cơ bản" };
      } else if (
        listFormUnitExchange.filter((formUnit) => formUnit?.values?.unit_id && formUnit?.values?.unit_id === item.values.unit_id).length > 1
      ) {
        errors = { ...item.errors, unit_id: "Đơn vị quy đổi đã được chọn" };
      } else {
        delete errors["unit_id"];
      }
      if (isDifferenceObj(errors, item.errors)) {
        handleUpdate({ ...item, errors: errors });
      }
    }
  }, [listFormUnitExchange, formData?.values?.unit_id]);

  return (
    <div className={`unit-exchange__item${item.active ? " active" : ""}`}>
      <div className="list-form-group">
        {listFieldUnitExchange.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, item, validationsUnit, listFieldUnitExchange, handleUpdate)}
            formData={item}
          />
        ))}
      </div>
    </div>
  );
}
