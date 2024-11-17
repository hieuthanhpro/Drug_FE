import React from "react";
import { IFieldCustomize, IFormData } from "model/FormModel";
import Input from "components/input/input";
import NummericInput from "components/input/numericInput";
import SelectCustom from "components/selectCustom/selectCustom";
import RadioList from "components/radio/radioList";
import CheckboxList from "components/checkbox/checkboxList";
import { convertToId, getTextFromReactElement } from "utils/common";
import DatePickerCustom from "components/datepickerCustom/datepickerCustom";
import moment from "moment";
import TextArea from "components/textarea/textarea";

export default function FieldCustomize(props: {
  field: IFieldCustomize;
  handleUpdate: (e) => void;
  formData: IFormData;
}) {
  const { field, handleUpdate, formData } = props;

  // console.log(formData);
  const componentForm = () => {
    switch (field.type) {
      case "text":
      case "password":
        return (
          <Input
            type={field.type}
            label={!field.labelHidden && field.label}
            labelPosition={field.labelPosition}
            name={field.name}
            nameOptions={field.nameOptions}
            valueOptions={formData?.values[field.nameOptions] ?? null}
            options={field.options}
            onChangeValueOptions={field.onChangeValueOptions}
            id={field.name}
            disabled={field.disabled}
            fill={field.fill}
            placeholder={
              field.placeholder
                ? field.placeholder
                : `Nhập ${
                    getTextFromReactElement(field.label).replace(" *", "").charAt(0).toLowerCase() +
                    getTextFromReactElement(field.label).slice(1)
                  }`
            }
            onFocus={field.onFocus}
            onChange={(e) => {
              field.onChange ? field.onChange(e) : undefined;
              handleUpdate(e.target.value);
            }}
            onClick={field.onClick}
            onBlur={field.onBlur}
            onKeyDown={field.onKeyDown}
            onKeyUp={field.onKeyUp}
            onKeyPress={field.onKeyPress}
            className={field.className}
            readOnly={field.readOnly}
            value={formData?.values[field.name] ?? ""}
            maxLength={field.maxLength}
            refInput={field.refElement}
            autoComplete={field.autoComplete}
            required={field.required}
            error={formData?.errors && !!formData?.errors[field.name]}
            message={formData?.errors ? formData?.errors[field.name] : ""}
            warning={field.isWarning}
            messageWarning={field.messageWarning}
            icon={field.icon}
            iconPosition={field.iconPosition}
            iconClickEvent={field.iconClickEvent}
          />
        );
      case "number":
        return (
          <NummericInput
            label={!field.labelHidden && field.label}
            labelPosition={field.labelPosition}
            name={field.name}
            nameOptions={field.nameOptions}
            valueOptions={formData?.values[field.nameOptions] ?? null}
            options={field.options}
            onChangeValueOptions={field.onChangeValueOptions}
            id={field.name}
            disabled={field.disabled}
            fill={field.fill}
            placeholder={
              field.placeholder
                ? field.placeholder
                : `Nhập ${
                    getTextFromReactElement(field.label).replace(" *", "").charAt(0).toLowerCase() +
                    getTextFromReactElement(field.label).slice(1)
                  }`
            }
            onFocus={field.onFocus}
            onValueChange={(values) => {
              field.onChange ? field.onChange(values.value) : undefined;
              handleUpdate(parseInt(values.value));
            }}
            onClick={field.onClick}
            onBlur={field.onBlur}
            onKeyDown={field.onKeyDown}
            onKeyUp={field.onKeyUp}
            onKeyPress={field.onKeyPress}
            className={field.className}
            readOnly={field.readOnly}
            value={formData?.values[field.name] ?? null}
            maxValue={field.maxValue}
            minValue={field.minValue}
            refInput={field.refElement}
            suffixes={field.suffixes}
            currency={field.currency}
            thousandSeparator={
              field.thousandSeparator !== null && field.thousandSeparator !== undefined ? field.thousandSeparator : true
            }
            allowNegative={field.allowNegative}
            allowLeadingZeros={field.allowLeadingZeros}
            required={field.required}
            error={formData?.errors && !!formData?.errors[field.name]}
            message={formData?.errors ? formData?.errors[field.name] : ""}
            warning={field.isWarning}
            messageWarning={field.messageWarning}
            icon={field.icon}
            iconPosition={field.iconPosition}
            iconClickEvent={field.iconClickEvent}
            isButton={field.isButton}
          />
        );
      case "radio":
        if (field.options && field.options.length > 0) {
          return (
            <RadioList
              options={field.options}
              title={!field.labelHidden && field.label}
              titlePosition={field.labelPosition}
              value={formData?.values[field.name] ?? ""}
              disabled={field.disabled}
              error={formData?.errors && !!formData?.errors[field.name]}
              message={formData?.errors ? formData?.errors[field.name] : ""}
              warning={field.isWarning}
              messageWarning={field.messageWarning}
              required={field.required}
              name={field.name}
              onChange={(e) => {
                handleUpdate(e.target.value);
              }}
              onClick={field.onClick}
            />
          );
        }
        break;
      case "checkbox":
        if (field.options && field.options.length > 0) {
          return (
            <CheckboxList
              options={field.options}
              title={!field.labelHidden && field.label}
              titlePosition={field.labelPosition}
              value={formData?.values[field.name] ?? ""}
              disabled={field.disabled}
              error={formData?.errors && !!formData?.errors[field.name]}
              message={formData?.errors ? formData?.errors[field.name] : ""}
              warning={field.isWarning}
              messageWarning={field.messageWarning}
              required={field.required}
              onChange={(value) => {
                handleUpdate(value);
              }}
              onClick={field.onClick}
            />
          );
        }
        break;
      case "select":
        return (
          <SelectCustom
            label={!field.labelHidden && field.label}
            labelPosition={field.labelPosition}
            className={field.className}
            options={field.options ?? []}
            value={formData?.values[field.name] ?? ""}
            name={field.name}
            placeholder={
              field.placeholder
                ? field.placeholder
                : `Chọn ${
                    getTextFromReactElement(field.label).replace(" *", "").charAt(0).toLowerCase() +
                    getTextFromReactElement(field.label).slice(1)
                  }`
            }
            isSearchable={field.isSearchable !== null && field.isSearchable !== undefined ? field.isSearchable : true}
            onChange={(e) => {
              field.onChange ? field.onChange(e) : undefined;
              handleUpdate(e.value);
            }}
            isLoading={field.isLoading}
            onMenuOpen={field.onMenuOpen}
            readOnly={field.readOnly}
            disabled={field.disabled}
            required={field.required}
            error={formData?.errors && !!formData?.errors[field.name]}
            message={formData?.errors ? formData?.errors[field.name] : ""}
            warning={field.isWarning}
            messageWarning={field.messageWarning}
            isAsync={field.isAsync}
            loadOptions={field.loadOptions}
            fill={field.fill}
          />
        );
      case "date":
        return (
          <DatePickerCustom
            label={!field.labelHidden && field.label}
            labelPosition={field.labelPosition}
            value={formData?.values[field.name] ?? ""}
            className={field.className}
            name={field.name}
            placeholder={
              field.placeholder ? field.placeholder : field.hasSelectTime ? "hh:mm dd/mm/yyyy" : "dd/mm/yyyy"
            }
            onChange={(e) => {
              field.onChange ? field.onChange(e) : undefined;
              handleUpdate(moment(e));
            }}
            disabled={field.disabled}
            required={field.required}
            icon={field.icon}
            iconPosition={field.iconPosition}
            error={formData?.errors && !!formData?.errors[field.name]}
            message={formData?.errors ? formData?.errors[field.name] : ""}
            warning={field.isWarning}
            messageWarning={field.messageWarning}
            fill={field.fill}
            hasSelectTime={field.hasSelectTime}
          />
        );
      case "textarea":
        return (
          <TextArea
            label={!field.labelHidden && field.label}
            labelPosition={field.labelPosition}
            name={field.name}
            id={field.name}
            disabled={field.disabled}
            fill={field.fill}
            fillColor={field.fillColor}
            placeholder={
              field.placeholder
                ? field.placeholder
                : `Nhập ${
                    getTextFromReactElement(field.label).replace(" *", "").charAt(0).toLowerCase() +
                    getTextFromReactElement(field.label).slice(1)
                  }`
            }
            onFocus={field.onFocus}
            onChange={(e) => {
              field.onChange ? field.onChange(e) : undefined;
              handleUpdate(e.target.value);
            }}
            onClick={field.onClick}
            onBlur={field.onBlur}
            onKeyDown={field.onKeyDown}
            onKeyUp={field.onKeyUp}
            onKeyPress={field.onKeyPress}
            className={field.className}
            readOnly={field.readOnly}
            value={formData?.values[field.name] ?? ""}
            maxLength={field.maxLength}
            refInput={field.refElement}
            required={field.required}
            error={formData?.errors && !!formData?.errors[field.name]}
            message={formData?.errors ? formData?.errors[field.name] : ""}
            warning={field.isWarning}
            messageWarning={field.messageWarning}
          />
        );
      default:
        break;
    }
  };

  return !field.hidden ? (
    <div className="form-group" id={`Field${convertToId(field.name)}`}>
      {componentForm()}
    </div>
  ) : null;
}
