import RadioList from "components/radio/radioList";
import { IOption } from "model/OtherModel";
import React, { Fragment, ReactElement } from "react";
import "./input.scss";
interface InputProps {
  id?: string;
  value?: string | number;
  type?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  onChange?: any;
  onFocus?: any;
  onBlur?: any;
  onKeyDown?: any;
  onKeyUp?: any;
  onKeyPress?: any;
  onClick?: any;
  autoFocus?: boolean;
  error?: boolean;
  message?: string;
  warning?: boolean;
  messageWarning?: string;
  label?: string | ReactElement;
  labelPosition?: "left";
  fill?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string | number;
  maxLength?: number;
  accept?: string;
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  iconClickEvent?: React.ReactEventHandler;
  refInput?: any;
  required?: boolean;
  autoComplete?: string;
  nameOptions?: string;
  valueOptions?: string | number;
  options?: IOption[];
  optionsPosition?: "left" | "right";
  onChangeValueOptions?: any;
  checked?: boolean;
}
export default function Input(props: InputProps) {
  const {
    id,
    value,
    name,
    className,
    defaultValue,
    placeholder,
    autoFocus,
    error,
    message,
    warning,
    messageWarning,
    disabled,
    readOnly,
    label,
    labelPosition,
    fill,
    onFocus,
    onBlur,
    onKeyPress,
    onKeyDown,
    onKeyUp,
    onClick,
    onChange,
    maxLength,
    accept,
    icon,
    type,
    iconPosition,
    iconClickEvent,
    refInput,
    required,
    autoComplete,
    nameOptions,
    options,
    optionsPosition,
    valueOptions,
    onChangeValueOptions,
    checked,
  } = props;

  const iconComponent = () => {
    return (
      icon && (
        <span
          onClick={iconClickEvent ? iconClickEvent : undefined}
          className={`icon d-flex align-items-center justify-content-center${iconClickEvent ? " has-event" : ""}`}
        >
          {icon}
        </span>
      )
    );
  };

  const inputComponent = () => {
    return (
      <div className="base-input__input">
        <input
          readOnly={readOnly}
          type={type ? type : "text"}
          name={name}
          id={id}
          onBlur={onBlur}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          onClick={onClick}
          disabled={disabled}
          onFocus={onFocus}
          defaultValue={defaultValue}
          maxLength={maxLength ? maxLength : undefined}
          required={required ?? false}
          ref={refInput ?? null}
          autoComplete={autoComplete}
          accept={accept}
          defaultChecked={checked}
        />
        {error && message && <div className="has-error">{message}</div>}
        {warning && messageWarning && <div className="has-warning">{messageWarning}</div>}
      </div>
    );
  };

  const iconInputComponent = () => {
    return (
      <div className={`base-input__input${icon ? " base-input__icon" : ""}`}>
        {iconComponent()}
        {inputComponent()}
      </div>
    );
  };

  const optionsComponent = () => {
    return (
      <div className={`base-input__options${optionsPosition ? ` base-input__options--${optionsPosition} ` : ""}`}>
        <RadioList
          options={options}
          value={valueOptions ?? ""}
          disabled={disabled}
          name={nameOptions}
          onChange={(e) => {
            onChangeValueOptions(e.target.value);
          }}
        />
        {iconInputComponent()}
      </div>
    );
  };

  return (
    <div
      className={`base-input${fill ? " base-input-fill" : ""}${error ? " invalid" : ""}${warning ? " warning" : ""}${
        value ? " has-value" : ""
      }${icon ? " has-icon" : ""}${icon ? ` has-icon__${iconPosition ?? "left"}` : ""}${label ? " has-label" : ""}${
        label && labelPosition ? ` has-label__${labelPosition}` : ""
      }${disabled ? " has-disabled" : ""}${className ? " " + className : ""}`}
    >
      {label ? (
        <div className="base-input__wrapper">
          <label htmlFor={name}>
            {label}
            {required && <span className="required"> * </span>}
          </label>
          {icon || (nameOptions && options && options.length > 0) ? (
            <Fragment>
              {nameOptions && options && options.length > 0 ? optionsComponent() : iconInputComponent()}
            </Fragment>
          ) : (
            iconInputComponent()
          )}
        </div>
      ) : (
        <label>{nameOptions && options && options.length > 0 ? optionsComponent() : iconInputComponent()}</label>
      )}
    </div>
  );
}
