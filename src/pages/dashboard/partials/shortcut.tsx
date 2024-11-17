import React, { useState } from "react";
import { IShortcut } from "model/dashboard/response/DashboardModelResponse";
import Icon from "components/icon";
import { Link } from "react-router-dom";
import { DasboardBlockProps } from "model/dashboard/PropsModel";

export default function Shortcut(props: DasboardBlockProps) {
  const { classNames } = props;

  const [shortcut] = useState<IShortcut[]>([
    {
      title: "Bán hàng",
      path: "/sales/create",
      icon: <Icon name="SaleDrug" />,
      background: "#0D173C",
      target: "_blank",
    },
    {
      title: "Nhập hàng",
      path: "/warehousing/create",
      icon: <Icon name="Login" />,
      background: "#ED6E02",
      target: "_blank",
    },
    {
      title: "Đặt hàng",
      path: "/order/create",
      icon: <Icon name="FingerTouch" />,
      background: "#1FAB02",
      target: "_blank",
    },
  ]);

  return (
    <div className={`card-box shortcut${classNames ? ` ${classNames}` : ""}`}>
      <div className="title d-flex align-items-start justify-content-between">
        <h2>Truy xuất nhanh</h2>
      </div>
      <div className="shortcut__list d-flex justify-content-between">
        {shortcut.map((s, index) => (
          <Link
            key={index}
            className="d-flex flex-column align-items-center"
            to={s.path}
            title={s.title}
            target={s.target ?? ""}
            style={{ backgroundColor: s.background }}
          >
            {s.icon}
            <span>{s.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
