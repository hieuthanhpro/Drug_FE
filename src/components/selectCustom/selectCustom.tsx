import React, { Fragment, ReactElement, useRef, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { IOption } from "model/OtherModel";
import "./selectCustom.scss";
interface SelectCustomProps {
  id?: string;
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  className?: string;
  placeholder?: string;
  onChange?: any;
  autoFocus?: boolean;
  onFocus?: (e) => void;
  onBlur?: (e) => void;
  error?: boolean;
  message?: string;
  warning?: boolean;
  messageWarning?: string;
  label?: string | ReactElement;
  labelPosition?: "left";
  fill?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isSearchable?: boolean;
  options: IOption[];
  isLoading?: boolean;
  onMenuOpen?: () => void;
  refSelect?: any;

  //Async
  isAsync?: boolean;
  loadOptions?: (inputValue: string, callback: any) => void;
}

export default function SelectCustom(props: SelectCustomProps) {
  const {
    id,
    value,
    defaultValue,
    name,
    className,
    placeholder,
    autoFocus,
    error,
    message,
    warning,
    messageWarning,
    onFocus,
    onBlur,
    disabled,
    readOnly,
    required,
    label,
    labelPosition,
    fill,
    onChange,
    isSearchable,
    options,
    isLoading,
    onMenuOpen,
    refSelect,
    isAsync,
    loadOptions,
  } = props;
  const [onFocusSelect, setOnFocusSelect] = useState<boolean>(false);
  const [onHasValue, setOnHasValue] = useState<boolean>(options.find((o) => o.value === value) ? true : false);
  const refSelectDefault = useRef(null);
  const selectComponent = () => {
    if (isAsync) {
      return (
        <div className="base-select__wrapper">
          <AsyncSelect
            id={id}
            autoFocus={autoFocus}
            name={name}
            className="select-custom"
            isSearchable={isSearchable ?? !readOnly ?? false}
            defaultValue={options.find((o) => o.value === defaultValue) ?? null}
            value={options.find((o) => o.value === value) ?? null}
            defaultOptions={options}
            placeholder={placeholder ?? " "}
            isLoading={isLoading}
            loadingMessage={() => "Đang tải"}
            loadOptions={loadOptions}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#015aa4",
                primary25: "#e9eaeb",
                primary50: "#e9eaeb",
                neutral0: "#ffffff",
                neutral70: "#015aa4",
              },
            })}
            onChange={(e) => {
              setOnHasValue(e.value !== null && e.value !== undefined && e.value !== "");
              if (refSelect && refSelectDefault.current) {
                refSelect.current.blur();
              }
              if (refSelectDefault && refSelectDefault.current) {
                refSelectDefault.current.blur();
              }
              if (onChange) {
                onChange(e);
              }
            }}
            onFocus={(e) => {
              setOnFocusSelect(true);
              if (onFocus) {
                onFocus(e);
              }
            }}
            onBlur={(e) => {
              setOnFocusSelect(false);
              if (onBlur) {
                onBlur(e);
              }
            }}
            isDisabled={disabled}
            openMenuOnClick={!readOnly}
            ref={refSelect ?? refSelectDefault}
            noOptionsMessage={() => "Không tìm thấy lựa chọn"}
            onMenuOpen={onMenuOpen}
          />
          {error && message && <div className="has-error">{message}</div>}
          {warning && messageWarning && <div className="has-warning">{messageWarning}</div>}
        </div>
      );
    } else {
      return (
        <div className="base-select__wrapper">
          <Select
            id={id}
            autoFocus={autoFocus}
            name={name}
            className="select-custom"
            isSearchable={isSearchable ?? !readOnly ?? false}
            defaultValue={options.find((o) => o.value === defaultValue) ?? null}
            value={options.find((o) => o.value === value) ?? null}
            options={options}
            placeholder={placeholder ?? " "}
            isLoading={isLoading}
            loadingMessage={() => "Đang tải"}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#015aa4",
                primary25: "#e9eaeb",
                primary50: "#e9eaeb",
                neutral0: "#ffffff",
                neutral70: "#015aa4",
              },
            })}
            onChange={(e) => {
              setOnHasValue(e.value !== null && e.value !== undefined && e.value !== "");
              if (refSelect) {
                refSelect.current.blur();
              }
              if (onChange) {
                onChange(e);
              }
            }}
            onFocus={(e) => {
              setOnFocusSelect(true);
              if (onFocus) {
                onFocus(e);
              }
            }}
            onBlur={(e) => {
              setOnFocusSelect(false);
              if (onBlur) {
                onBlur(e);
              }
            }}
            isDisabled={disabled}
            openMenuOnClick={!readOnly}
            ref={refSelect ?? refSelectDefault}
            noOptionsMessage={() => "Không tìm thấy lựa chọn"}
            onMenuOpen={onMenuOpen}
          />
          {error && message && <div className="has-error">{message}</div>}
          {warning && messageWarning && <div className="has-warning">{messageWarning}</div>}
        </div>
      );
    }
  };

  return (
    <div
      className={`base-select${fill ? " base-select-fill" : ""}${onFocusSelect ? " on-focus" : ""}${error ? " invalid" : ""}${
        warning ? " warning" : ""
      }${onHasValue ? " has-value" : ""}${label ? " has-label" : ""}${label && labelPosition ? ` has-label__${labelPosition}` : ""}${
        className ? " " + className : ""
      }${disabled ? " has-disabled" : ""}`}
    >
      {label ? (
        <Fragment>
          <label htmlFor={name}>
            {label}
            {required && <span className="required"> * </span>}
          </label>
          {selectComponent()}
        </Fragment>
      ) : (
        <Fragment>{selectComponent()}</Fragment>
      )}
    </div>
  );
}
