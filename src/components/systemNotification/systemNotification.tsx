import React from "react";
import ImageNoItem from "assets/images/img-no-item.svg";
import ImageNoPermission from "assets/images/img-no-permission.svg";
import ImageNoResult from "assets/images/img-no-result.svg";
import Button from "components/button/button";
import "./systemNotification.scss";

interface SystemNotificationProps {
  description?: React.ReactElement | string;
  type: "no-permission" | "no-item" | "no-result" | "not-found";
  titleButton?: string;
  action?: () => void;
}

export function SystemNotification(props: SystemNotificationProps) {
  const { description, titleButton, action, type } = props;
  return (
    <div className={`system-notification d-flex align-items-center justify-content-center ${type}`}>
      <div className="system-notification__wrapper d-flex align-items-center flex-column">
        {type === "no-item" ? <ImageNoItem /> : type === "no-result" ? <ImageNoResult /> : type === "no-permission" && <ImageNoPermission />}
        <div className="system-notification__description">
          <h2>
            {type === "no-permission"
              ? "Bạn không có quyền truy cập vào trang này."
              : type === "no-item"
              ? "Ở đây chưa có gì cả."
              : "Không tìm thấy."}
          </h2>
          {type === "no-result" ? <h3>Không tìm thấy dữ liệu phù hợp với điều kiện tìm kiếm</h3> : ""}
          {type !== "no-permission" && (
            <p>{type === "no-result" ? "Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm" : type === "no-item" ? description : ""}</p>
          )}
          {titleButton && action && (
            <Button type="button" color="primary" onClick={action}>
              {titleButton}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
