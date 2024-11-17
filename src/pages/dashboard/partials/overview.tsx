import React, { useState, useContext } from "react";
import { IOverview } from "model/dashboard/response/DashboardModelResponse";
import moment from "moment";
import Icon from "components/icon";
import { UserContext, ContextType } from "contexts/userContext";
import { DasboardBlockProps } from "model/dashboard/PropsModel";
moment.locale("vi");

export default function OverView(props: DasboardBlockProps) {
  const { classNames } = props;
  const { isCollapsedSidebar } = useContext(UserContext) as ContextType;
  const [overview] = useState<IOverview[]>([
    {
      type: "invoice",
      label: "Hóa đơn",
      icon: <Icon name="Report" />,
      old_value: 500,
      current_value: 792,
    },
    {
      type: "returns",
      label: "Khách trả hàng",
      icon: <Icon name="Returns" />,
      old_value: 100,
      current_value: 123,
    },
  ]);

  return (
    <div className={`overview d-flex${isCollapsedSidebar ? " overview--sidebar-collapsed" : ""}${classNames ? ` ${classNames}` : ""}`}>
      {overview.map((o, idx) => (
        <div
          key={idx}
          className={`card-box overview-item overview-item__${o.type} overview-item--${
            o.current_value > o.old_value ? "increase" : "decrease"
          } d-flex align-items-start justify-content-between`}
        >
          <div className="overview-item__main">
            <div className="d-flex align-items-center">
              <div className="overview-item__icon">{o.icon}</div>
              <div className="overview-item__info">
                <h3>{o.label}</h3>
                <time>{moment().format("dddd - DD/MM/yyyy")}</time>
              </div>
            </div>
            <div className="overview-item__note">
              {o.current_value > o.old_value ? (
                <span>
                  Tăng <span className="percentage percentage-increase">{((o.current_value - o.old_value) / o.old_value) * 100}%</span> so với cùng
                  giờ hôm qua
                </span>
              ) : (
                <span>
                  Giảm <span className="percentage percentage-decrease">{((o.old_value - o.current_value) / o.old_value) * 100}%</span> so với cùng
                  giờ hôm qua
                </span>
              )}
            </div>
          </div>
          <div className="overview-item__number d-flex align-items-center justify-content-end">
            {o.current_value > o.old_value ? <Icon name="Increase" /> : <Icon name="Decrease" />} <span>{o.current_value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
