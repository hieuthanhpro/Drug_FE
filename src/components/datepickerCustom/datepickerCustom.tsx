import React, { Fragment, ReactElement, useRef, useState } from "react";
import vi from "date-fns/locale/vi";
import { Portal } from "react-overlays";
import DatePicker from "react-datepicker";
import moment from "moment";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { useOnClickOutside } from "utils/hookCustom";
import "react-datepicker/dist/react-datepicker.css";
import "./datepickerCustom.scss";

interface DatePickerCustomProps {
  id?: string;
  value?: string;
  name?: string;
  className?: string;
  onChange?: any;
  onFocus?: any;
  onBlur?: any;
  onClick?: any;
  error?: boolean;
  message?: string;
  warning?: boolean;
  messageWarning?: string;
  label?: string | ReactElement;
  labelPosition?: "left";
  fill?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  hasSelectTime?: boolean;
}
export default function DatePickerCustom(props: DatePickerCustomProps) {
  const {
    id,
    value,
    name,
    className,
    error,
    message,
    warning,
    messageWarning,
    disabled,
    label,
    labelPosition,
    fill,
    onFocus,
    onBlur,
    onClick,
    onChange,
    required,
    placeholder,
    icon,
    iconPosition,
    hasSelectTime,
  } = props;
  const [onFocusInput, setOnFocusInput] = useState<boolean>(false);
  const refPicker = useRef();
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe(hasSelectTime ? "HH:MM dd/mm/yyyy" : "dd/mm/yyyy");
  useOnClickOutside(refPicker, () => setOnFocusInput(false), ["base-datepicker", "react-datepicker-popper", "base-datepicker__icon"]);

  const refInput = useRef<HTMLInputElement>();

  const timeMask = (valueMask) => {
    const chars = valueMask.split("");
    const hours: Array<any> = [/[0-2]/, chars[0] == "2" ? /[0-3]/ : /[0-9]/, ":"];

    const minutes: Array<any> = [/[0-5]/, /[0-9]/, " "];
    const date: Array<any> = [/[0-3]/, /\d/, "/", /[0-1]/, /\d/, "/", /[1-2]/, /\d/, /\d/, /\d/];
    if (hasSelectTime) {
      return hours.concat(minutes).concat(date);
    } else {
      return date;
    }
  };

  const inputComponent = () => {
    return (
      <Fragment>
        <DatePicker
          id={id}
          name={name}
          locale={vi}
          autoComplete="off"
          dateFormat={hasSelectTime ? "HH:mm dd/MM/yyyy" : "dd/MM/yyyy"}
          placeholderText={placeholder}
          popperContainer={CalendarContainer}
          customInput={
            <MaskedInput
              pipe={autoCorrectedDatePipe}
              mask={timeMask}
              render={(textMaskRef, props) => (
                <input
                  {...props}
                  ref={(node) => {
                    textMaskRef(node);
                    refInput.current = node;
                  }}
                />
              )}
              keepCharPositions={true}
              guide={true}
            />
          }
          selected={
            value &&
            value.length !== 0 &&
            moment(value, hasSelectTime ? "HH:mm DD/MM/yyyy" : "DD/MM/yyyy", true).isValid() &&
            moment(value, hasSelectTime ? "HH:mm DD/MM/yyyy" : "DD/MM/yyyy").toDate()
          }
          showYearDropdown
          showMonthDropdown
          showTimeSelect={hasSelectTime}
          timeCaption="Thời gian"
          onChange={(date) => {
            onChange(date || "");
          }}
          onClick={onClick}
          disabled={disabled}
          onFocus={(e) => {
            setOnFocusInput(true);
            if (onFocus) {
              onFocus(e);
            }
          }}
          onBlur={(e) => {
            setOnFocusInput(false);
            if (onBlur) {
              onBlur(e);
            }
          }}
          onCalendarClose={() => setOnFocusInput(false)}
        />
        {error && message && <div className="has-error">{message}</div>}
        {warning && messageWarning && <div className="has-warning">{messageWarning}</div>}
      </Fragment>
    );
  };

  return (
    <div
      className={`base-datepicker${fill ? " base-datepicker-fill" : ""}${error ? " invalid" : ""}${warning ? " warning" : ""}${
        value ? " has-value" : ""
      }${icon ? " has-icon" : ""}${onFocusInput ? " on-focus" : ""}${icon ? ` has-icon__${iconPosition ?? "left"}` : ""}${label ? " has-label" : ""}${
        label && labelPosition ? ` has-label__${labelPosition}` : ""
      }${hasSelectTime ? " has-time-select" : ""}${disabled ? " has-disabled" : ""}${className ? " " + className : ""}`}
    >
      {label ? (
        <Fragment>
          <label htmlFor={name}>
            {label}
            {required && <span className="required"> * </span>}
          </label>
          {icon ? (
            <div className="base-datepicker__icon">
              {icon && (
                <span
                  className="icon d-flex align-items-center justify-content-center"
                  onClick={() => {
                    if (!onFocusInput) {
                      setOnFocusInput(true);
                      refInput.current.focus();
                    }
                  }}
                >
                  {icon}
                </span>
              )}
              {inputComponent()}
            </div>
          ) : (
            inputComponent()
          )}
        </Fragment>
      ) : (
        <label>
          {icon && <span className="icon d-flex align-items-center justify-content-center">{icon}</span>}
          {inputComponent()}
        </label>
      )}
    </div>
  );
}

const CalendarContainer = ({ children }) => {
  const el = document.getElementsByTagName("body")[0];
  return <Portal container={el}>{children}</Portal>;
};
