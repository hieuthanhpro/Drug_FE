import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./contexts/userContext";
import "swiper/css";
import "styles/main.scss";
import "react-toastify/dist/ReactToastify.css";
import Login from "pages/login/Login";
import { IUserLogin } from "./model/user/response/UserResponseModel";
import { useCookies } from "react-cookie";
import fetchConfig from "./configs/fetchConfig";
import { routes } from "./configs/routes";
import { ToastContainer } from "react-toastify";
import LayoutPage from "pages/layout";
import moment from "moment";
import UserService from "./services/UserService";
import { getPermissions, isDifferenceObj } from "utils/common";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = new URLSearchParams(location.search).get("returnUrl");
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<IUserLogin>(null);
  const [permissions, setPermisisons] = useState<string[]>([]);
  const [drugStore, setDrugStore] = useState<any>(null);
  const [isRunRefresh, setIsRunRefresh] = useState<boolean>(false);
  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState<boolean>(false);

  fetchConfig();

  useEffect(() => {
    if (cookies.user && cookies.drugStore) {
      if (isDifferenceObj(cookies.user, user)) {
        console.log('user',cookies.user)
        setUser(cookies.user);
        setPermisisons(getPermissions(cookies.user));
        setDrugStore(cookies.drugStore);
        setIsLogin(true);
        if (cookies.user?.expired_cookie && isRunRefresh === false) {
          setIsRunRefresh(true);
          const dateExpired = moment(cookies.user.expired_cookie);
          let timeOut = dateExpired.valueOf() - moment().valueOf();
          timeOut = timeOut > 0 ? timeOut : 0;
          setTimeout(() => {
            UserService.refreshToken().then((res) => {
              if (res.token) {
                const dateExpiresNew = moment().add(3000, "minutes").toDate();
                setCookie("token", res.token, { path: "/", expires: dateExpiresNew });
                setCookie("user", JSON.stringify({ ...cookies.user, expired_cookie: dateExpiresNew }), { path: "/", expires: dateExpiresNew });
              } else {
                UserService.logout().then(() => {
                  removeCookie("checked", { path: "/" });
                  removeCookie("user", { path: "/" });
                  removeCookie("token", { path: "/" });
                  removeCookie("drugStore", { path: "/" });
                });
              }
              setIsRunRefresh(false);
            });
          }, timeOut);
        }
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate(returnUrl ? returnUrl : "/dashboard");
        }
      }
    } 
    else if (location.pathname !== "/login") {
      setIsLogin(false);
      const returnUrl = routes.find((r) => r.path === location.pathname) ? `?returnUrl=${location.pathname}${location.search}` : "";
      navigate(`/login${returnUrl}`);
    }
  }, [cookies.user]);

  return (
    <UserContext.Provider
      value={{
        ...user,
        drug_store: drugStore,
        isCollapsedSidebar: isCollapsedSidebar,
        setIsCollapsedSidebar: setIsCollapsedSidebar,
        permissions,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {isLogin && <Route path="*" element={<LayoutPage />} />}
        <Route path="/login" element={<Login />} />
      </Routes>
    </UserContext.Provider>
  );
}
