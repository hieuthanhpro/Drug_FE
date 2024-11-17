import Modal, { ModalBody, ModalHeader } from "components/modal/modal";
import React, { useEffect, useRef, useState } from "react";
import InvoiceService from "services/InvoiceService";
import "../SalesCreate.scss";
import BillInfo from "./BillInfo";
import SalesItem from "./SalesItem";
import SalesReturnItem from "./SalesReturnItem";

interface SalesReturnProps {
  onShow: boolean;
  toggle: any;
  id: string;
}

export default function SalesReturn(props: SalesReturnProps) {
  const { onShow, toggle, id } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoiceInfo, setInvoiceInfo] = useState();
  const [invoiceDetail, setInvoiceDetail] = useState([]);
  const [lineItem, setLineItem] = useState([]);

  const refLineItems = useRef(null);

  const getInvoiceDetail = async (id) => {
    setIsLoading(true);
    const res = await InvoiceService.detail(id, "id");

    setInvoiceInfo(res.result.invoice);
    setInvoiceDetail(res.result.invoice_detail);

    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getInvoiceDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (invoiceDetail.length > 0) {
      let tech = invoiceDetail;

      const groupedTech = Object.entries(
        tech.reduce((acc, { drug_id, invoice_detail }) => {
          if (!acc[invoice_detail.combo_name]) {
            acc[invoice_detail.combo_name] = [];
          }
          acc[invoice_detail.combo_name].push({ drug_id, invoice_detail });

          return acc;
        }, {})
      ).map(([combo_name, invoice_detail]) => ({ combo_name, invoice_detail }));

      console.log(groupedTech);
      const newGroup = groupedTech?.filter((item) => item.combo_name !== "Đơn thuốc");

      setLineItem(newGroup);
    }
  }, [invoiceDetail]);

  const updateFormData = (formDataItemSale, i) => {
    console.log("update");
  };

  const removeLineItem = (i) => {
    console.log(i);
  };

  return (
    <div className="sales-return">
      <Modal
        isOpen={onShow}
        className="modal-return"
        isFade={true}
        staticBackdrop={false}
        toggle={toggle}
        isCentered={true}
      >
        <ModalHeader title="TRẢ HÀNG NHÀ CUNG CẤP" toggle={toggle} />
        <ModalBody>
          <SalesReturnItem data={lineItem} invoiceInfo={invoiceInfo} invoiceDetail={invoiceDetail} toggle={toggle} />
        </ModalBody>
      </Modal>
    </div>
  );
}
