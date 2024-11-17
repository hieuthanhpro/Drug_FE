import React, { Fragment, useState } from "react";
import Button from "components/button/button";
import Dialog from "components/dialog/dialog";
import Icon from "components/icon";
import _ from "lodash";
import { defaultTabInvoice } from "model/invoice/DataModelInitial";
import { SalesTabProps } from "model/invoice/PropsModel";
import "./SalesTab.scss";

export default function SalesTab(props: SalesTabProps) {
  const { listTabInvoice, updateTabInvoice } = props;
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<any>(null);

  const addTabInvoice = () => {
    const listTabInvoiceNew = listTabInvoice.map((to) => {
      return { ...to, is_active: false };
    });
    updateTabInvoice([...listTabInvoiceNew, _.cloneDeep(defaultTabInvoice)]);
  };

  const changeTabInvoice = (idx) => {
    const listTabInvoiceNew = listTabInvoice.map((to, index) => {
      return {
        ...to,
        is_active: idx === index,
      };
    });
    updateTabInvoice(listTabInvoiceNew);
  };

  const removeTabInvoice = (tabInvoice) => {
    if (tabInvoice) {
      const contentDialog = {
        color: "error",
        className: "dialog-remove-invoice",
        title: "Xóa hóa đơn",
        message: "Bạn có chắc chắn muốn xóa bỏ hóa đơn không ?",
        cancelText: "Thoát",
        cancelAction: () => {
          setShowDialog(false);
          setContentDialog(null);
        },
        defaultText: "Xóa",
        defaultAction: () => {
          const listTabInvoiceNew = listTabInvoice.filter((to) => to !== tabInvoice);
          if (listTabInvoiceNew.length === 0) {
            updateTabInvoice([_.cloneDeep(defaultTabInvoice)]);
          } else {
            if (!listTabInvoiceNew.find((to) => to.is_active === true)) {
              listTabInvoiceNew[listTabInvoiceNew.length - 1].is_active = true;
            }
            updateTabInvoice(listTabInvoiceNew);
          }
          setShowDialog(false);
          setContentDialog(null);
        },
      };
      setContentDialog(contentDialog);
      setShowDialog(true);
    }
  };

  return (
    <Fragment>
      <div className="sales-create-tab d-flex">
        <ul className="d-flex">
          {listTabInvoice?.map((tab, idx) => (
            <li key={idx} className={tab.is_active ? "active" : ""}>
              <span onClick={() => (!tab.is_active ? changeTabInvoice(idx) : undefined)}>Đơn hàng {idx + 1}</span>
              <Button
                type="button"
                className="remove-tab-invoice"
                color="transparent"
                onlyIcon={true}
                onClick={() => removeTabInvoice(tab)}
              >
                <Icon name="Times" />
              </Button>
            </li>
          ))}
        </ul>
        {listTabInvoice?.length < 3 ? (
          <Button
            type="button"
            className="add-tab-invoice"
            color="transparent"
            onlyIcon={true}
            onClick={() => addTabInvoice()}
          >
            <Icon name="PlusCircle" />
          </Button>
        ) : null}
      </div>
      <Dialog content={contentDialog} isOpen={showDialog} />
    </Fragment>
  );
}
