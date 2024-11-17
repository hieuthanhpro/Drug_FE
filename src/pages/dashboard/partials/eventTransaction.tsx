import React, { useState } from "react";
import { eventTransactionDataFake, IEventTransaction } from "model/dashboard/response/DashboardModelResponse";
import CustomScrollbar from "components/customScrollbar";
import { eventType } from "model/dashboard/DataModelInitial";
import { DasboardBlockProps } from "model/dashboard/PropsModel";

export default function EventTransaction(props: DasboardBlockProps) {
  const { classNames } = props;
  const [totalInvoice] = useState<number>(792);
  const [eventTransaction] = useState<IEventTransaction[]>(eventTransactionDataFake);

  return (
    <div className={`card-box event-transaction${classNames ? ` ${classNames}` : ""}`}>
      <div className="title d-flex align-items-start justify-content-between">
        <h2>Lịch sử giao dịch</h2>
      </div>
      <span className="total-invoice">
        Tổng hóa đơn: <strong>{totalInvoice}</strong>
      </span>
      <CustomScrollbar width="100%" height={388} autoHide={false}>
        <ul className="d-flex flex-column">
          {eventTransaction.map((e, index) => (
            <li key={index} className="d-flex align-items-start">
              <span className={`type type-${["sale", "return_supplier"].includes(e.type) ? "in" : "out"}`}></span>
              <div className="info">
                <h3>{e.received}</h3>
                <span>{eventType[e.type]}</span>
                <time>{e.created_at}</time>
              </div>
            </li>
          ))}
        </ul>
      </CustomScrollbar>
    </div>
  );
}
