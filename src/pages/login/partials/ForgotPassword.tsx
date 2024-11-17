import Button from "components/button/button";
import Icon from "components/icon";
import Input from "components/input/input";
import { stepForgot } from "model/user/DataModelInitial";
import { ForgotPasswordProps } from "model/user/PropsModel";
import { formForgotDefault, IForgotRequest } from "model/user/request/UserRequestModel";
import React, { useEffect, useState } from "react";
import UserService from "services/UserService";
import { showToast } from "utils/common";
import { useInterval } from "utils/hookCustom";

export default function ForgotPassword(props: ForgotPasswordProps) {
  const { isForgotPassword, setIsForgotPassword, setLoginInfo } = props;
  const [forgotInfo, setForgotInfo] = useState<IForgotRequest>(formForgotDefault);
  const [isDisabledForgot, setIsDisabledForgot] = useState(true);
  const [isMultipleAccount, setIsMultipleAccount] = useState(false);
  const [isSubmmitResend, setIsSubmitResend] = useState<boolean>(false);
  const [isSubmmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    setForgotInfo(formForgotDefault);
    setIsDisabledForgot(true);
    setIsMultipleAccount(false);
  }, [isForgotPassword]);

  useEffect(() => {
    switch (forgotInfo.type) {
      case stepForgot.verified_phone:
        if (!forgotInfo.phone_number || (isMultipleAccount && !forgotInfo.username)) {
          setIsDisabledForgot(true);
        } else {
          setIsDisabledForgot(false);
        }
        break;
      case stepForgot.verified_otp:
        if (forgotInfo.phone_number && forgotInfo.otp) {
          setIsDisabledForgot(false);
        } else {
          setIsDisabledForgot(true);
        }
        break;
      case stepForgot.new_password:
        if (forgotInfo.phone_number && forgotInfo.otp && forgotInfo.password && forgotInfo.password_confirmation) {
          setIsDisabledForgot(false);
        } else {
          setIsDisabledForgot(true);
        }
        break;
      default:
        break;
    }
  }, [forgotInfo]);

  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      if (count === 1) {
        setIsRunning(false);
      }
      setCount(count - 1);
    },
    isRunning ? 1000 : null
  );

  const handleForgotPassword = (e, resend = false) => {
    e.preventDefault();
    if (resend) {
      setIsSubmitResend(true);
    } else {
      setIsSubmit(true);
    }
    if (forgotInfo.type === stepForgot.new_password && forgotInfo.password !== forgotInfo.password_confirmation) {
      showToast("Mật khẩu và xác nhận mật khẩu không khớp", "error");
      return;
    }
    UserService.forgotPassword(forgotInfo, resend).then((data) => {
      if (data.result !== "multiple") {
        if (resend) {
          setCount(59);
          setIsRunning(true);
          setForgotInfo({ ...forgotInfo, type: stepForgot.verified_otp });
          showToast("Mã xác minh đã được gửi tới số điện thoại của bạn", "success");
        } else {
          switch (forgotInfo.type) {
            case stepForgot.verified_phone:
              setCount(59);
              setIsRunning(true);
              setForgotInfo({ ...forgotInfo, type: stepForgot.verified_otp });
              showToast("Mã xác minh đã được gửi tới số điện thoại của bạn", "success");
              break;
            case stepForgot.verified_otp:
              setForgotInfo({ ...forgotInfo, type: stepForgot.new_password });
              break;
            case stepForgot.new_password:
              showToast("Cập nhật mật khẩu cho tài khoản thành công", "success");
              setForgotInfo({ ...forgotInfo, type: stepForgot.verified_phone });
              setLoginInfo({ username: "", password: "" });
              setIsForgotPassword(false);
              break;
            default:
              break;
          }
        }
      } else {
        setIsMultipleAccount(true);
        setIsDisabledForgot(data.result === "multiple" || (resend && !forgotInfo.otp));
        showToast(data.message, "error");
      }
      if (resend) {
        setIsSubmitResend(false);
      } else {
        setIsSubmit(false);
      }
    });
  };

  return (
    <form className={`form-forgot-password${!isForgotPassword ? " d-none" : ""}`} onSubmit={(e) => handleForgotPassword(e)}>
      <div className="form-group">
        <Input
          type="text"
          name="phone"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={forgotInfo?.phone_number}
          fill={true}
          onChange={(e) => setForgotInfo({ ...forgotInfo, phone_number: e.target.value })}
          disabled={forgotInfo.type !== stepForgot.verified_phone || isMultipleAccount === true}
        />
      </div>
      {isMultipleAccount === true || (forgotInfo.type !== stepForgot.verified_phone && isMultipleAccount === false) ? (
        <div className="form-group">
          <Input
            type="text"
            name="username"
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            value={forgotInfo.username ?? ""}
            fill={true}
            onChange={(e) => setForgotInfo({ ...forgotInfo, username: e.target.value })}
            disabled={forgotInfo.type !== stepForgot.verified_phone || isMultipleAccount === false}
          ></Input>
        </div>
      ) : null}
      <div className={`form-group${forgotInfo.type !== stepForgot.verified_otp ? " d-none" : ""}`}>
        <Input
          type="text"
          name="otp"
          label="Mã xác minh"
          placeholder="Nhập mã xác minh"
          value={forgotInfo?.otp}
          fill={true}
          onChange={(e) => setForgotInfo({ ...forgotInfo, otp: e.target.value })}
        />
      </div>
      {forgotInfo.type === stepForgot.new_password && (
        <>
          <div className="form-group">
            <Input
              type="text"
              name="username"
              autoComplete="new-password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={forgotInfo.password ?? ""}
              fill={true}
              onChange={(e) => setForgotInfo({ ...forgotInfo, password: e.target.value })}
            ></Input>
          </div>
          <div className="form-group">
            <Input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              value={forgotInfo.password_confirmation ?? ""}
              fill={true}
              onChange={(e) => setForgotInfo({ ...forgotInfo, password_confirmation: e.target.value })}
            ></Input>
          </div>
        </>
      )}
      <div className="form-group form-group-forgot d-flex align-items-center justify-content-between">
        <div>
          {forgotInfo.type === stepForgot.verified_otp || forgotInfo.type === stepForgot.resend_otp ? (
            <Button
              type="button"
              onClick={(e) => handleForgotPassword(e, true)}
              disabled={count > 0 || isSubmmitResend}
              className="btn-forgot-password"
              color="link"
            >
              Gửi lại {count > 0 && <span>({count})</span>}
              {isSubmmitResend && <Icon name="Loading" />}
            </Button>
          ) : null}
        </div>
        <div>
          <Button type="button" className="btn-forgot-password" color="link" onClick={() => setIsForgotPassword(false)}>
            Đăng nhập
          </Button>
        </div>
      </div>
      <Button type="submit" color="primary" className="btn-submit-form" disabled={isSubmmit || isDisabledForgot}>
        {forgotInfo.type === stepForgot.new_password ? "Hoàn thành" : "Gửi"}
        {isSubmmit && <Icon name="Loading" />}
      </Button>
    </form>
  );
}
