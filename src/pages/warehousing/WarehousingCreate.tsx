import Button from "components/button/button";
import Icon from "components/icon";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import _ from "lodash";
import { defaultSalesItem } from "model/invoice/DataModelInitial";
import {
  IBillInfoFormData,
  IFormDataItemSale,
  IFormDataLineItemSale,
  IInvoiceSalesRequest,
  ILineItem,
} from "model/invoice/request/SalesInvoiceModelRequest";
import { ISalesItemModalResponse } from "model/invoice/response/SalesInvoiceModelResponse";
import { IOption } from "model/OtherModel";
import moment from "moment";
import AddDrugModal from "pages/drug/partials/AddDrugModal";
import OrderModal from "pages/order/partials/OrderModal";
import BillInfo from "pages/sales/partials/BillInfo";
import ChooseSalesItemModal from "pages/sales/partials/ChooseSalesItemModal";
import SalesItem from "pages/sales/partials/SalesItem";
import React, { useEffect, useRef, useState } from "react";
import OrderService from "services/OrderService";
import { v4 as uuidv4 } from "uuid";
import "../order/OrderCreate.scss";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import SalesInvoiceDetail from "../sales/partials/SalesInvoiceDetail";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency, showToast } from "utils/common";
import InvoiceService from "services/InvoiceService";
import { SelectOptionData } from "utils/selectCommon";


export const billInfoDefault = {
  data: {
    payment_method: "cash",
    discount_type: "amount",
    discount: 0,
    customer_id: "",
    receipt_date: moment(),
    invoice_code: "",
    created_at: moment(),
  },
  values: {
    payment_method: "cash",
    discount_type: "amount",
    discount: 0,
    desired_date: moment().add(1, "days"),
    created_at: moment(),
    amount: 0,
    pay_amount: 0,
    need_pay_amount: 0,
    pay_amount_temp: 0,
    vat_amount: 0,
    receipt_date: moment(),
    discount_percent_value: 0,
    discount_rate: 0,
    description: "",
    customer_id: "",
    invoice_code: "",
  },
};

export default function WarehousingCreate() {
  const [listSupplier, setListSupplier] = useState(null);
  const [showModalOrder, setShowModalOrder] = useState<boolean>(false);
  const [isDrug, setIsDrug] = useState<boolean>(true);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState(null);
  const [warehousingType, setWarehousingType] = useState("supplier");
  const [showInvoiceDetail, setShowInvoiceDetail] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [invoiceBody, setInvoiceBody] = useState(null);
  const [showIsTest, setShowIsTest] = useState<boolean>(false);

  const [listStore, setListStore] = useState([]);
  const [listOrder, setListOrder] = useState({
    bill_info: {
      data: {
        payment_method: "cash",
      },
      values: {
        payment_method: "cash",
        receipt_date: moment(),
        desired_date: moment().add(1, "days"),
      },
    },
    form_data: [],
  });
  
  const navigate=useNavigate()

  const hasTemp = location.pathname.split("/")[3] === "temp";
  const hasReturn = location.pathname.split("/")[2] === "return" ? true : false;

  const { id } = useParams();

  const refListLineItem = useRef(null);
  const refLineItems = useRef(null);
  const refBillInfo = useRef(null);

  let totalVat = 0;
  let total=0;
 
  const handleSubmit = async(type) => {
    type === "test" && setShowIsTest(true);
      const formData = _.cloneDeep(listOrder);
      const body: IInvoiceSalesRequest = {
        ...formData?.bill_info?.values,
        line_items: formData?.form_data.map((formData) => {
          return {
            ...(formData.type_item === "retail" ? ({ ...formData?.items[0]?.values } as ILineItem) : {}),
          };
        }),
        promotion_ids: [],
      };


      const listItem = body.line_items.map((drug) => {
        return {
          combo_name: "",
          cost: drug.price,
          current_cost: drug.current_cost,
          main_cost: drug.price,
          discount: drug.discount,
          discount_promotion: 0,
          discount_rate: drug.discount_rate,
          drug_id: drug.drug_id,
          unit_name: drug?.unit_name,
          drug_code: drug?.drug_code,
          drug_name: drug?.drug_name,
          expiry_date: moment(drug.expiry_date).format("YYYY-MM-DD"),
          org_cost: drug.cost,
          quantity: drug.quantity,
          number: drug.number,
          unit_id: drug.unit_id,
          total_cost: drug.total_amount,
          vat: drug.vat,
        };
      });

      const newBody = {
        amount: body.amount + listOrder.bill_info.values.vat_amount,
        customer_id: body.customer_id,
        invoice_code: "",
        order_id: null,
        method: body.method ?? "",
        
        payment_method: body.payment_method,
        pay_amount: body.pay_amount,
        payment_status: 1,
        refer_id: null,
        supplier_invoice_code: body.supplier_invoice_code ?? "",
        gift_items: [],
        debt: 0,
        vat_amount: listOrder.bill_info.values.vat_amount || 0,
        description: listOrder.bill_info.values.description||"",
        source: "GPP",
        discount:
          body.discount_type === "percentage" ? listOrder.bill_info.values.discount_percent_value : +body.discount || 0 ,
        discount_rate: body.discount_rate ?? 0,
        invoice_type: warehousingType === "supplier" ? "IV2" : "IV7",
        invoice_detail: listItem,
        receipt_date: moment(body.receipt_date).format("YYYY-MM-DD"),
        created_at: moment(body.created_at).format("YYYY-MM-DD"),
        date: moment(body.receipt_date).format("YYYY-MM-DD"),
        created_by: "",
        status: "done",
      };
      setShowDialog(false);

      if (type !== "test") {
        let res;
        if (type === "sell") {
          res = await InvoiceService.warehouseing(newBody);
        } else {
          res = await InvoiceService.warehouseingTemp(newBody);
        }
        if (res.code === 200) {
          setInvoiceId(res.result);
          showToast(`Tạo hóa đơn nhập hàng ${type === "temp" ? "lưu tạm" : ""} thành công`, "success");
          listOrder.form_data = [];
          listOrder.bill_info = billInfoDefault;
          setShowInvoiceDetail(!showInvoiceDetail);
          setShowIsTest(false);
        } else {
          showToast(res.message, "error");
        }
      } else {
        setInvoiceBody(newBody);
      }
  }
  

  const titleActions: ITitleActions = {
    actions: [
      {
        title: "Thêm SP không phải thuốc",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="MedicalBox" />,
        callback: () => {
          setIsDrug(false);
          setShowModalAdd(!showModalAdd);
        },
      },
      {
        title: "Thêm thuốc mới",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="Drug" />,
        callback: () => {
          setIsDrug(true);
          setShowModalAdd(!showModalAdd);
        },
      },
      {
        title: "Chọn sản phẩm nhập hàng",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="PlusCircleFill" />,
        callback: () => {
          setShowModalOrder(true);
        },
      },
    ],
  };

  const addDrugForOrder = (drug) => {
    // const units = drug ? JSON.parse(drug?.units ?? drug?.other_units) : [];
    // const numbers = drug ? drug?.numbers : [];
    const item: IFormDataItemSale = {
      uuid: uuidv4(),
      data: {
        ...defaultSalesItem,
        drug: drug,
        drug_id: drug?.id,
        number: drug?.number,
        price: +drug?.current_cost,
        total_amount: +drug?.current_cost * 1,
        unit_id: drug?.unit_id,
        warehouse_quantity: 0,
      },
      values: {
        ...defaultSalesItem,
        drug_id: drug?.id,
        number: drug?.number,
        expiry_date: moment(drug?.expiry_date).format("DD/MM/yyyy"),
        price: +drug?.current_cost,
        total_amount: +drug?.current_cost * 1,
        unit_id: drug?.unit_id,
        warehouse_quantity: 0,
        current_cost:drug?.current_cost,
        drug_name: drug?.name,
        drug_code:drug?.drug_code,
        unit_name:drug?.unit_name
      },
    };

    const retailFormData: IFormDataLineItemSale = {
      uuid: uuidv4(),
      type_item: "retail",
      items: [item],
      values: {},
      drug_store: drug.drug_store_id,
    };
    const forms_data = [...listOrder.form_data, retailFormData];
    setListOrder({ ...listOrder, form_data: forms_data });
    setShowModalOrder(false);
  };
  

  const updateFormData = (formData: IFormDataLineItemSale, index: number) => {
    const listOrderTemp = _.cloneDeep(listOrder);
    listOrderTemp.form_data[index].items[0] = formData;
    listOrderTemp.form_data.forEach((formData) => {
      const totalPrice =
        +formData.items[0]?.values.price >= 0
          ? hasReturn
            ? +formData.items[0].values.quantity_return * formData.items[0]?.values.price -
                +formData.items[0]?.values.discount ?? 0
            : +formData.items[0]?.values.discount > 0
            ? formData.items[0].values.quantity * formData.items[0]?.values.price -
              +formData.items[0]?.values.discount * +formData.items[0].values.quantity
            : formData.items[0].values.quantity * formData.items[0]?.values.price
          : 0;
      total += totalPrice;
      if (+formData.items[0]?.values.vat > 0) {
        totalVat += (totalPrice * +formData.items[0]?.values.vat) / 100;
      }
    });
    listOrderTemp.bill_info.values = {
      ...listOrder.bill_info.values,
      amount: hasReturn ? total + totalVat : total,
      discount_percent_value:
        (+listOrderTemp.bill_info.values.discount_rate * +listOrderTemp.bill_info.values.amount) / 100,
      pay_amount:
        total*1 +
          totalVat*1 -
          (listOrderTemp.bill_info.values.discount_type === "percentage"
            ? (+listOrderTemp.bill_info.values.discount_rate * +listOrderTemp.bill_info.values.amount) / 100
            : +listOrderTemp.bill_info.values.discount||0) ,
      need_pay_amount:
        total*1 +
          totalVat*1 -
          (listOrderTemp.bill_info.values.discount_type === "percentage"
            ? (+listOrderTemp.bill_info.values.discount_rate * +listOrderTemp.bill_info.values.amount) / 100
            : +listOrderTemp.bill_info.values.discount || 0) ,
      pay_amount_temp: total + totalVat,
      vat_amount: totalVat,
    };
    setListOrder(listOrderTemp);
  };

  const removeLineItem = (index: number) => {
    const listOrderTemp = _.cloneDeep(listOrder);
    const item = listOrderTemp.form_data[index].drug_store;
    const listItemStoreTab = listOrderTemp.form_data.filter((store) => {
      store.drug_store === item;
    });

    if (listItemStoreTab.length <= 0) {
      const idTemp = _.cloneDeep(listStore);
      idTemp.filter((store) => store === item);
      console.log(idTemp);
      setListStore(idTemp);
    }
    listOrderTemp.form_data.splice(index, 1);

    console.log(item);
    setListOrder(listOrderTemp);
  };

  const updateBillInfo = (billInfoFormData: IBillInfoFormData) => {
    const listOrderTemp = _.cloneDeep(listOrder);
    const newBillInfoFormDataValue = {
      ...billInfoFormData.values,
      need_pay_amount:
        billInfoFormData.values.discount_type === "amount"
          ? billInfoFormData.values.discount > 0
            ? billInfoFormData.values.pay_amount_temp - billInfoFormData.values.discount
            : billInfoFormData.values.pay_amount_temp
          : billInfoFormData.values.discount_type === "percentage"
          ? +billInfoFormData.values.discount_rate > 0
            ? billInfoFormData.values.pay_amount -
              (+billInfoFormData.values.pay_amount * +billInfoFormData.values.discount_rate) / 100
            : billInfoFormData.values.pay_amount_temp
          : billInfoFormData.values.pay_amount,
      debt: billInfoFormData.values.need_pay_amount - billInfoFormData.values.pay_amount,
      discount_percent_value: (billInfoFormData.values.pay_amount * billInfoFormData.values.discount_rate) / 100,
      deviant_amount: formatCurrency(billInfoFormData.values.need_pay_amount - billInfoFormData.values.pay_amount),
    };

    const newBill = {
      ...billInfoFormData,
      values: newBillInfoFormDataValue,
    };
    listOrderTemp.bill_info = newBill;

    setListOrder(listOrderTemp);
  };

  const showDialogConfirm = (type: "temp" | "sell" | "test" | "return") => {
    const contentDialog: IContentDialog = {
      className: "dialog-confirm",
      isCentered: true,
      isLoading: true,
      title: `Xác nhận tạo hóa đơn${type === "temp" ? " lưu tạm" : ""}`,
      message: `Bạn có chắc chắn tạo hóa đơn ${hasReturn ? "trả" : "nhập"} hàng ${
        type === "temp" ? " lưu tạm " : ""
      }không?`,
      cancelText: "Hủy",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => handleSubmit(type),
      customButtons: hasReturn
        ? []
        : [
            {
              type: "button",
              onClick: () => handleSubmit("test"),
              children: "Kiểm tra",
              color: "success",
            },
          ],
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  const handleSubmitForm = (type: "temp" | "sell") => {
    const isErrorBillInfo = refBillInfo.current();
    const isErrorLineItems = refLineItems.current();
    if (isErrorBillInfo || isErrorLineItems) {
      // setStateFocusInput(true);
      return;
    }
    showDialogConfirm(type);
  };

  const getListSupplier = async () => {
    if (!listSupplier) {
      const dataOption = await SelectOptionData("supplier_id");
      if (dataOption) {
        console.log("hieule",listOrder,dataOption)
        setListOrder({...listOrder,bill_info:{...listOrder.bill_info,values:{...listOrder.bill_info.values,customer_id:dataOption[0].value}}})
        setListSupplier([...(dataOption.length > 0 ? dataOption : [])]);
      }
    }
  };

  useEffect(() => {
    getListSupplier();
  }, []);

  
  return (
    <div className="page-content page-sales-create order-create">
      <div className="wrapper">
        <div className="main">
          <TitleAction title={"Nhập hàng"} titleActions={titleActions} />
          <div className="card-box d-flex flex-column">
            <h2>Thông tin hàng hóa cần nhập</h2>
            <div className={`line-items-wrapper`} ref={refListLineItem}>
              {listOrder.form_data.length > 0 ? (
                listOrder.form_data.map((item, i) => {
                  return (
                    <SalesItem
                      key={i}
                      formData={item?.items[0]}
                      setFormData={(formDataItemSale) => updateFormData(formDataItemSale, i)}
                      onRemove={() => removeLineItem(i)}
                      typeItem="retail"
                      handleSubmitRefSaleItem={refLineItems}
                      type="warehouse"
                    />
                  );
                })
              ) : (
                <Button
                  type="button"
                  color="transparent"
                  hasIcon={true}
                  onClick={() => setShowModalOrder(true)}
                  className="btn-add-sale-large"
                >
                  <Icon name="PlusCircle" />
                  Chọn sản phẩm nhập hàng
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* <OrderBillInfo /> */}
        <BillInfo
          listCustomer={listSupplier}
          lineItems={listOrder.form_data}
          formData={listOrder.bill_info}
          handleUpdate={(billInfoFormData) => updateBillInfo(billInfoFormData)}
          updateListCustomer={(listCustomerNew: IOption[]) => setListSupplier(listCustomerNew)}
          handleSubmit={(type: "temp" | "sell") => handleSubmitForm(type)}
          handleSubmitRef={refBillInfo}
          type="warehouse"
        />
        <ChooseSalesItemModal
          onShow={showModalOrder}
          onHide={() => setShowModalOrder(false)}
          callback={(drug) => addDrugForOrder(drug)}
          type="warehousing"
        />
        <AddDrugModal
          isDrug={isDrug}
          onShow={showModalAdd}
          // id={idEdit}
          onHide={(reload) => {
            setShowModalAdd(false);
          }}
        />

        {showInvoiceDetail && (
          <SalesInvoiceDetail
            onShow={showInvoiceDetail}
            toggle={() => setShowInvoiceDetail(!showInvoiceDetail)}
            id={invoiceId}
            type="warehousing"
          />
        )}

        <SalesInvoiceDetail
          onShow={showIsTest}
          toggle={() => setShowIsTest(false)}
          invoiceTestData={invoiceBody}
          isTest={showIsTest}
          type="warehousing"
          handleSubmitTest={() => handleSubmit("sell")}
        />

        <Dialog content={contentDialog} isOpen={showDialog} />
      </div>
    </div>
  );
}
