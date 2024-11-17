import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "components/input/input";
import Button from "components/button/button";
import Logo from "assets/images/logo-gpp.svg";
import UserService from "services/UserService";
import { IUserLogin } from "model/user/response/UserResponseModel";
import { IUserLoginRequest } from "model/user/request/UserRequestModel";
import { useCookies } from "react-cookie";
import moment from "moment";
import Icon from "components/icon";
import ForgotPassword from "./partials/ForgotPassword";
import { IDrugStore } from "model/drugStore/response/DrugStoreResponseModel";
import { showToast } from "utils/common";
import "./Login.scss";

export default function Login() {
  document.getElementsByTagName("html")[0].style.height = "100%";
  const navigate = useNavigate();
  const search = useLocation().search;
  const returnUrl = new URLSearchParams(search).get("returnUrl");
  const [cookies, setCookie] = useCookies();
  const [isSubmmit, setIsSubmit] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState<IUserLoginRequest>({
    username: "",
    password: "",
  });
  const [onShowPassword, setOnShowPassword] = useState<boolean>(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    UserService.login(loginInfo)
      .then((res) => {
        if (res?.code !== 200) {
          showToast(res.message, "error");
          setIsSubmit(false);
        } else if (res.result && res.result.token) {
          const userInfo = res.result.userinfo;
          const drugStore = res.result.drug_store;
          const dateExpires = moment().add(3000, "minutes").toDate();
          const user: IUserLogin = {
            id: userInfo.user_id,
            name: userInfo.full_name,
            username: userInfo.name,
            status: "active",
            expired_cookie: dateExpires.toISOString(),
            role: userInfo?.permission?.includes("system") ? "system" : userInfo.user_role,
            created_at: userInfo.created_at,
          };
          setIsSubmit(false);
          setCookie("token", res.result.token, { path: "/", expires: dateExpires });
          setCookie("user", JSON.stringify(user), { path: "/", expires: dateExpires });
          const drugStoreResponse: IDrugStore = {
            id: drugStore.id,
            name: drugStore.name,
            warning_date: drugStore.warning_date,
            status: drugStore.status,
            type: drugStore.type,
            address: drugStore.address,
            phone: drugStore.phone
          };
          setCookie("drugStore", JSON.stringify(drugStoreResponse), { path: "/", expires: dateExpires });
          navigate(returnUrl ? returnUrl : "/dashboard");
        }
      })
      .catch(() => {
        showToast("Có lỗi xảy ra vui lòng thử lại sau!", "error");
        setIsSubmit(false);
      });
  };

  return (
    <div className="login d-flex align-items-center justify-content-center">
      <div className="login-box">
        <div className="logo d-flex align-items-center justify-content-center">
          <Logo />
        </div>
        <form className={`form-login${isForgotPassword ? " d-none" : ""}`} onSubmit={(e) => handleLogin(e)}>
          <div className="form-group">
            <Input
              type="text"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              value={loginInfo?.username}
              fill={true}
              onChange={(e) => setLoginInfo({ ...loginInfo, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <Input
              type={!onShowPassword ? "password" : "text"}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={loginInfo?.password}
              fill={true}
              onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
              icon={!onShowPassword ? <Icon name="Eye" /> : <Icon name="EyeSlash" />}
              iconPosition="right"
              iconClickEvent={() => setOnShowPassword(!onShowPassword)}
            />
          </div>
          <div className="form-group form-group-forgot d-flex align-items-center justify-content-end">
            <Button type="button" className="btn-forgot-password" color="link" onClick={() => setIsForgotPassword(true)}>
              Quên mật khẩu?
            </Button>
          </div>
          <Button type="submit" color="primary" className="btn-submit-form" disabled={isSubmmit || !loginInfo.password || !loginInfo.username}>
            Đăng nhập
            {isSubmmit && <Icon name="Loading" />}
          </Button>
        </form>
        <ForgotPassword isForgotPassword={isForgotPassword} setIsForgotPassword={setIsForgotPassword} setLoginInfo={setLoginInfo} />
      </div>
    </div>
  );
}
