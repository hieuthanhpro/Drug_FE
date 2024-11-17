import React, { useMemo, useEffect, useCallback, Fragment } from "react";
import { IFieldCustomize, IValidation } from "model/FormModel";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import Button from "components/button/button";
import Icon from "components/icon";
import UnitExchangeItem from "./UnitExchangeItem";
import { AddDrugProps } from "model/drug/PropsModel";
import "./UnitPrice.scss";
import { IFormDataExchange } from "model/drug/OtherModel";

export default function UnitPrice(props: AddDrugProps) {
  const { dataDrug, formData, listUnit, listFormUnitExchange, setListFormUnitExchange, handleUpdate, handleSubmit, drugMasterData ,errorBridge,tabActive} = props;

  const validations: IValidation[] = [
    {
      name: "name",
      rules: "required",
    },
    {
      name: "unit_id",
      rules: "required",
    },
    {
      name: "current_cost",
      rules: "required|min:0",
    },
  ];

  const listFieldUnitBasic: IFieldCustomize[] = useMemo(
    () => [
      {
        label: "Đơn vị nhỏ nhất",
        name: "unit_id",
        type: "select",
        required: true,
        options: listUnit,
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Tồn kho",
        name: "quantity",
        type: "number",
        readOnly: true,
        disabled: true,
      },
      {
        label: "Giá bán đơn vị nhỏ nhất",
        placeholder: "",
        name: "current_cost",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        required: true,
      },
      ...((dataDrug
        ? [
            {
              label: "Tỷ lệ",
              placeholder: "",
              name: "base_ratio",
              type: "number",
              suffixes: "%",
              thousandSeparator: false,
            },
          ]
        : []) as IFieldCustomize[]),
      {
        label: "Giá nhập",
        placeholder: "",
        name: "main_cost",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        disabled: true,
      },
    ],
    [listUnit, dataDrug, drugMasterData, formData]
  );

  useEffect(() => {
    if (formData?.values?.current_cost > formData?.values?.main_cost) {
      const baseRatio =
        formData?.values?.main_cost === 0
          ? 0
          : (100 * ((formData?.values?.current_cost ?? 0) - (formData?.values?.main_cost ?? 0))) / (formData?.values?.main_cost ?? 0);
      if (baseRatio !== parseInt(formData?.values?.base_ratio)) {
        handleUpdate({ ...formData, values: { ...formData.values, base_ratio: baseRatio } });
      }
    } else {
      handleUpdate({ ...formData, values: { ...formData.values, base_ratio: 0 } });
    }
  }, [formData?.values?.current_cost]);

  useEffect(() => {
    if (parseInt(formData?.values?.main_cost) > 0 && formData?.values?.base_ratio > 0) {
      const currentCost = ((formData?.values?.main_cost ?? 0) / 100) * formData?.values?.base_ratio + (formData?.values?.main_cost ?? 0);
      if (currentCost !== formData?.values?.current_cost && formData?.values?.main_cost > 0) {
        handleUpdate({ ...formData, values: { ...formData.values, current_cost: currentCost } });
      }
    }
  }, [formData?.values?.base_ratio]);

  const validationsUnit: IValidation[] = [
    {
      name: "unit_id",
      rules: "required",
    },
    {
      name: "exchange",
      rules: "required|min:1",
    },
    {
      name: "current_cost",
      rules: "required|min:0",
    },
  ];

  const listFieldUnitExchange: IFieldCustomize[] = useMemo(
    () => [
      {
        label: "Đơn vị quy đổi",
        name: "unit_id",
        type: "select",
        required: true,
        options: listUnit,
      },
      {
        label: "Hệ số quy đổi",
        name: "exchange",
        type: "number",
        required: true,
        thousandSeparator: false,
      },
      {
        label: "Giá bán quy đổi",
        placeholder: "",
        name: "current_cost",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        required: true,
      },
      ...((dataDrug
        ? [
            {
              label: "Tỷ lệ",
              placeholder: "",
              name: "ratio",
              type: "number",
              suffixes: "%",
              thousandSeparator: false,
            },
          ]
        : []) as IFieldCustomize[]),
      {
        label: "Giá nhập",
        placeholder: "",
        name: "main_cost",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        disabled: true,
      },
    ],
    [listUnit]
  );

  const addUnitExchangeForm = () => {
    setListFormUnitExchange([
      ...listFormUnitExchange,
      {
        uuid: uuidv4(),
        active: listFormUnitExchange.length === 0 ? true : false,
        values: {},
      },
    ]);
  };

  const setActiveUnitExchange = (uuid) => {
    const listFormUnitExchangeTemp = listFormUnitExchange.map((form) => {
      return {
        ...form,
        active: form.uuid === uuid ? true : false,
      };
    });
    setListFormUnitExchange(listFormUnitExchangeTemp);
  };

  const handleRemoveUnitExchange = useCallback(
    (formItem: IFormDataExchange) => {
      let listFormUnitExchangeTemp = _.cloneDeep(listFormUnitExchange);
      const index = listFormUnitExchangeTemp.findIndex((item) => item.uuid === formItem.uuid);
      if (index > -1) {
        listFormUnitExchangeTemp.splice(index, 1);
        listFormUnitExchangeTemp = listFormUnitExchangeTemp.map((formItem, idx) => {
          const hasItemActive = listFormUnitExchangeTemp.findIndex((formCheck) => formCheck.active === true) > -1;
          return {
            ...formItem,
            active: !hasItemActive && idx === 0 ? true : formItem.active,
          };
        });
        setListFormUnitExchange(listFormUnitExchangeTemp);
      }
    },
    [listFormUnitExchange]
  );

  const handleUpdateUnitExchange = (formItem: IFormDataExchange) => {
    const listFormUnitExchangeTemp = _.cloneDeep(listFormUnitExchange);
    const index = listFormUnitExchangeTemp.findIndex((item) => item.uuid === formItem.uuid);
    listFormUnitExchangeTemp[index] = formItem;
    setListFormUnitExchange(listFormUnitExchangeTemp);
  };

  // Add event call from parent
  useEffect(() => {
    handleSubmit.current = handleSubmitForm;
  }, [formData, listFormUnitExchange]);

  const handleSubmitForm = useCallback(() => {
    let uuidErrorUnitExchange = null;
    const listFormUnitExchangeTemp = _.cloneDeep(listFormUnitExchange);
    for (let i = 0; i < listFormUnitExchangeTemp.length; i++) {
      const unitExchangeForm = listFormUnitExchangeTemp[i];
      const errors = Validate(validationsUnit, unitExchangeForm, listFieldUnitExchange);
      console.log(errors)
      if (errors && Object.keys(errors).length > 0) {
        listFormUnitExchangeTemp[i].errors = errors;
        if (!uuidErrorUnitExchange) {
          uuidErrorUnitExchange = unitExchangeForm.uuid;
        }
      }
    }
    console.log(listFormUnitExchangeTemp);
    if (uuidErrorUnitExchange) {
      setListFormUnitExchange(listFormUnitExchangeTemp);
    }
    const errorsUnit = Validate(validations, formData, [...listFieldUnitBasic]);
    
    const isError=errorsUnit && Object.keys(errorsUnit).length > 0

    if (isError) errorBridge.push(errorsUnit)
    if (isError && tabActive.value==='unit_price') {
      handleUpdate({ ...formData, errors: errorsUnit });
    }
    return { unit_basic: isError ? true : false, unit_exchange: uuidErrorUnitExchange };
  }, [formData, listFormUnitExchange]);

  return (
    <div className="unit-price">
      <h2>Đơn vị cơ bản (Nhỏ nhất)</h2>
      <div className="list-form-group">
        {listFieldUnitBasic.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) => handleChangeValidate(value, field, formData, validations, listFieldUnitBasic, handleUpdate)}
            formData={formData}
          />
        ))}
      </div>
      <h2 className="title-exchange">
        Đơn vị quy đổi
        <Button type="button" color="transparent" onlyIcon={true} hasIcon={true} onClick={addUnitExchangeForm}>
          <Icon name="PlusCircle" />
        </Button>
      </h2>
      <div className="unit-exchange">
        {listFormUnitExchange.length > 0 && (
          <Fragment>
            <div className="unit-exchange__tab">
              <ul className="d-flex flex-column">
                {listFormUnitExchange.map((formItem, index) => (
                  <li
                    key={index}
                    className={`${formItem.active ? "active" : ""}${formItem.errors && Object.keys(formItem.errors).length > 0 ? " is-error" : ""}`}
                    onClick={() => setActiveUnitExchange(formItem.uuid)}
                  >
                    <span>Đơn vị quy đổi cấp {index + 1}</span>
                    <Button
                      type="button"
                      className="btn-remove"
                      onlyIcon={true}
                      hasIcon={true}
                      color="transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUnitExchange(formItem);
                      }}
                    >
                      <Icon name="Times" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="unit-exchange__form">
              {listFormUnitExchange.map((item) => (
                <UnitExchangeItem
                  key={item.uuid}
                  item={item}
                  formData={formData}
                  listFormUnitExchange={listFormUnitExchange}
                  validationsUnit={validationsUnit}
                  listFieldUnitExchange={listFieldUnitExchange}
                  handleUpdate={(formUnitExchange) => handleUpdateUnitExchange(formUnitExchange)}
                />
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
