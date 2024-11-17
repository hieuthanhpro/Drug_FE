import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "components/header/header";
import Sidebar from "components/sidebar/sidebar";
import Page404 from "pages/404/index";
import { routes } from "configs/routes";
import { UserContext, ContextType } from "contexts/userContext";
import CustomScrollbar from "components/customScrollbar";
import { SystemNotification } from "components/systemNotification/systemNotification";
import { useWindowDimensions } from "utils/hookCustom";

export default function Layout() {
  const { isCollapsedSidebar, permissions } = useContext(UserContext) as ContextType;
  const { height } = useWindowDimensions();
  document.getElementsByTagName("html")[0].style.height = "";

  return (
    <div id="container">
      <iframe className="d-none" id="pdf-frame"></iframe>
      <div className={`page-wrapper${isCollapsedSidebar ? " page-wrapper--collapsed-sidebar" : ""} d-flex align-items-start justify-content-between`}>
        <Sidebar />
        <div className="main-content">
          <Header />
          <CustomScrollbar width="100%" height={height - 57} autoHide={true}>
            <div className="main-content__wrapper">
              <Routes>
                {routes.map((r, index) => {
                  if (!r.permission || permissions.filter((per) => r.permission.includes(per)).length > 0) {
                    return <Route key={index} path={r.path} element={r.component} />;
                  } else {
                    return <Route key={index} path={r.path} element={<SystemNotification type="no-permission" />} />;
                  }
                })}
                <Route path="*" element={<Page404 />} />
              </Routes>
            </div>
          </CustomScrollbar>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
