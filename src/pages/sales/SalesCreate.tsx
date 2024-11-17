import Button from "components/button/button";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import Icon from "components/icon";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import _ from "lodash";
import {
  defaultComboInfo,
  defaultPrescription,
  defaultSalesItem,
  defaultTabInvoice,
} from "model/invoice/DataModelInitial";
import { IInvoiceTab } from "model/invoice/OtherModel";
import { SalesCreateProps } from "model/invoice/PropsModel";
import {
  IBillInfo,
  IBillInfoFormData,
  IFormDataItemSale,
  IFormDataLineItemSale,
  IInvoiceSalesRequest,
  IItemSale,
  ILineItem,
} from "model/invoice/request/SalesInvoiceModelRequest";
import { ISalesItemModalResponse } from "model/invoice/response/SalesInvoiceModelResponse";
import { IOption } from "model/OtherModel";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { scrollTo } from "utils/common";
import InvoiceService from "services/InvoiceService";
import { useWindowDimensions } from "utils/hookCustom";
import { SelectOptionData } from "utils/selectCommon";
import { v4 as uuidv4 } from "uuid";
import BillInfo from "./partials/BillInfo";
import ChooseSalesItemModal from "./partials/ChooseSalesItemModal";
import SalesInvoiceDetail from "./partials/SalesInvoiceDetail";
import SalesLineItem from "./partials/SalesLineItem";
import SalesTab from "./partials/SalesTab";
import "./SalesCreate.scss";

export default function SalesCreate(props: SalesCreateProps) {
  document.title = "Tạo mới hóa đơn bán hàng";
  const { type } = props;
  const { id } = useParams();
  const [listCustomer, setListCustomer] = useState<IOption[]>(null);
  const [listTabInvoice, setListTabInvoice] = useState<IInvoiceTab[]>([defaultTabInvoice]);
  const refListLineItem = useRef(null);

  let total = 0;

  const getListCustomer = async () => {
    if (!listCustomer) {
      const dataOption = await SelectOptionData("customer");
      if (dataOption) {
        setListCustomer([{ value: "", label: "Khách lẻ" }, ...(dataOption.length > 0 ? dataOption : [])]);
      }
    }
  };

  useEffect(() => {
    getListCustomer();
  }, []);

  const { width, height } = useWindowDimensions();
  const titleActions: ITitleActions = {
    actions: [
      {
        title: width > 1288 ? "Bán sản phẩm lẻ" : "Bán lẻ",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="PlusCircleFill" />,
        callback: () => {
          setTypeAddDrugForSale({
            type: "retail",
            uuid: null,
          });
          setShowModalForSale(true);
        },
      },
      {
        title: width > 1288 ? "Bán theo combo - thuốc liều" : "Bán theo liều",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="Copy" />,
        callback: () => {
          addDrugForSales("combo");
        },
      },
      {
        title: "Bán theo đơn Bác sĩ",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="PaperClipboard" />,
        callback: () => {
          addDrugForSales("prescription");
        },
      },
    ],
  };

  const [showModalForSale, setShowModalForSale] = useState<boolean>(false);
  const [typeAddDrugForSale, setTypeAddDrugForSale] = useState<any>({
    type: "retail",
    uuid: null,
  });
  const addDrugForSales = (
    type: "retail" | "combo" | "prescription",
    drug?: ISalesItemModalResponse,
    uuid?: string
  ) => {
    console.log(drug);
    const units = drug ? JSON.parse(drug?.units) : [];
    const numbers = drug ? JSON.parse(drug?.numbers) : [];
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
        warehouse_quantity: drug
          ? numbers?.find((number) => number.number === drug?.number)?.quantity /
            units?.find((unit) => unit.unit_id === drug?.unit_id)?.exchange
          : 0,
        ...(type === "combo" ? { combo_quantity: 1 } : {}),
      },
      values: {
        ...defaultSalesItem,
        drug_id: drug?.id,
        number: drug?.number,
        expiry_date: moment(drug?.expiry_date).format("DD/MM/yyyy"),
        price: +drug?.current_cost,
        total_amount: +drug?.current_cost * 1,
        unit_id: drug?.unit_id,
        warehouse_quantity: drug
          ? numbers?.find((number) => number.number === drug?.number)?.quantity /
            units?.find((unit) => unit.unit_id === drug?.unit_id)?.exchange
          : 0,
        ...(type === "combo" ? { combo_quantity: 1 } : {}),
      },
    };
    const listTabInvoiceTemp = _.cloneDeep(listTabInvoice);
    const index = listTabInvoiceTemp.findIndex((tabInvoice) => tabInvoice.is_active === true);
    const formsData = listTabInvoiceTemp[index].forms_data;
    if (
      (type === "prescription" && !formsData.some((formData) => formData.type_item === "prescription") && !uuid) ||
      (type === "prescription" && formsData.some((formData) => formData.type_item === "prescription") && uuid) ||
      type !== "prescription"
    ) {
      switch (type) {
        case "retail":
          const retailFormData: IFormDataLineItemSale = {
            uuid: uuidv4(),
            type_item: type,
            items: [item],
            values: {},
          };
          listTabInvoiceTemp[index].forms_data = [...formsData, retailFormData];
          break;
        case "combo":
        case "prescription":
          const comboPrescriptionFormData: IFormDataLineItemSale = {
            uuid: uuidv4(),
            type_item: type,
            items: drug ? [item] : [],
            ...(type === "combo" ? { combo_info: defaultComboInfo } : {}),
            ...(type === "prescription" ? { prescription: defaultPrescription } : {}),
            values: type === "combo" ? defaultComboInfo : defaultPrescription,
          };
          if (uuid) {
            const indexFormData = formsData.findIndex((formData) => formData.uuid === uuid);
            if (index > -1) {
              listTabInvoiceTemp[index].forms_data[indexFormData].items = [...formsData[indexFormData].items, item];
            } else {
              listTabInvoiceTemp[index].forms_data = [...formsData, comboPrescriptionFormData];
            }
          } else {
            listTabInvoiceTemp[index].forms_data = [...formsData, comboPrescriptionFormData];
          }
          break;
      }
      setTypeAddDrugForSale({
        type: "retail",
        uuid: null,
      });
      setListTabInvoice(listTabInvoiceTemp);
    }
    scrollTo(refListLineItem.current.scrollHeight, 500, refListLineItem.current);
  };

  const updateFormData = (formData: IFormDataLineItemSale, index: number) => {
    const listTabInvoiceTemp = _.cloneDeep(listTabInvoice);
    const indexTab = listTabInvoiceTemp.findIndex((tabInvoice) => tabInvoice.is_active === true);
    listTabInvoiceTemp[indexTab].forms_data[index] = formData;
    const lineItemsRetail = listTabInvoiceTemp[indexTab].forms_data?.filter(
      (formDataRetail) => formDataRetail.type_item === "retail"
    );

    listTabInvoiceTemp[indexTab].forms_data.forEach((formData) => {
      if (formData.type_item === "combo") {
        total += formData?.values.price;
      } else if (formData.type_item === "prescription") {
        formData.items.map((item) => {
          total += item.values.total_amount;
        });
      } else {
        total += formData.items[0].values.total_amount;
      }
    });
    listTabInvoiceTemp[indexTab].bill_info.values = {
      ...listTabInvoiceTemp[indexTab].bill_info.values,
      amount: total,
      pay_amount: total,
    };
    listTabInvoiceTemp[indexTab].forms_data = listTabInvoiceTemp[indexTab].forms_data.map((formDataMap) => {
      return {
        ...formDataMap,
        items: formDataMap.items.map((item) => {
          let errors = item.errors;
          if (formDataMap.type_item === "retail") {
            errors = validateItem(
              errors,
              item,
              lineItemsRetail.map((itemRetail) => itemRetail.items[0])
            );
          } else {
            errors = validateItem(errors, item, formDataMap.items);
          }
          return {
            ...item,
            errors: errors,
          };
        }),
      };
    });

    setListTabInvoice(listTabInvoiceTemp);
  };

  const removeLineItem = (index: number) => {
    const listTabInvoiceTemp = _.cloneDeep(listTabInvoice);
    const indexTab = listTabInvoiceTemp.findIndex((tabInvoice) => tabInvoice.is_active === true);
    listTabInvoiceTemp[indexTab].forms_data.splice(index, 1);
    setListTabInvoice(listTabInvoiceTemp);
  };

  const updateBillInfo = (billInfoFormData: IBillInfoFormData) => {
    const listTabInvoiceTemp = _.cloneDeep(listTabInvoice);
    const indexTab = listTabInvoiceTemp.findIndex((tabInvoice) => tabInvoice.is_active === true);
    const newBillInfoFormDataValue = {
      ...billInfoFormData.values,
      pay_amount:
        (billInfoFormData.values.discount_type === "amount" && billInfoFormData.values.discount > 0) ||
        billInfoFormData.values.discount_rate > 0
          ? billInfoFormData.values.amount - billInfoFormData.values.discount
          : billInfoFormData.values.amount -
            (billInfoFormData.values.amount * billInfoFormData.values.discount_rate) / 100,
    };
    const newBill = {
      ...billInfoFormData,
      values: newBillInfoFormDataValue,
    };
    listTabInvoiceTemp[indexTab].bill_info = newBill;
    setListTabInvoice(listTabInvoiceTemp);
  };

  const refBillInfo = React.useRef(null);
  const refLineItems = React.useRef(null);
  const [stateFocusInput, setStateFocusInput] = useState<boolean>(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState<boolean>(false);
  const [body, setBody] = useState(null);

  const handleSubmit = (type: "temp" | "sell") => {
    const isErrorBillInfo = refBillInfo.current();
    const isErrorLineItems = refLineItems.current();
    if (isErrorBillInfo || isErrorLineItems) {
      setStateFocusInput(true);
      return;
    }
    showDialogConfirm(type);
  };
  const onSubmit = async (type: "temp" | "sell") => {
    const formData = _.cloneDeep(listTabInvoice.find((to) => to.is_active === true));
    const body: IInvoiceSalesRequest = {
      ...(formData?.bill_info?.values as IBillInfo),
      line_items: formData?.forms_data.map((formData) => {
        return {
          ...(formData.type_item === "retail" ? ({ ...formData?.items[0]?.values } as ILineItem) : {}),
          ...(formData.type_item !== "retail"
            ? ({
                ...formData?.values,
                items: formData.items.map((item) => {
                  return {
                    ...item.values,
                  };
                }) as IItemSale[],
              } as ILineItem)
            : {}),
        };
      }),
      promotion_ids: [],
    };
    const response = await InvoiceService.save(body);
    console.log(body);
    setBody(body);
    setShowDialog(false);
    return setShowInvoiceDetail(!showInvoiceDetail);
  };

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<any>(null);
  const showDialogConfirm = (type: "temp" | "sell") => {
    const contentDialog: IContentDialog = {
      className: "dialog-confirm",
      isCentered: true,
      isLoading: true,
      title: `Xác nhận tạo hóa đơn${type === "temp" ? " lưu tạm" : ""}`,
      message: `Bạn có chắc chắn tạo hóa đơn bán hàng ${type === "temp" ? " lưu tạm " : ""}không?`,
      cancelText: "Hủy",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => onSubmit(type),
      customButtons: [
        {
          type: "button",
          onClick: () => console.log("abc"),
          children: "Kiểm tra",
          color: "success",
        },
      ],
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  useEffect(() => {
    if (stateFocusInput === true) {
      const errElm = document.querySelector(".page-sales-create .invalid");
      if (errElm !== null) {
        if (errElm.querySelector("input")) {
          errElm.querySelector("input")?.focus();
        } else if (errElm.querySelector("textarea")) {
          errElm.querySelector("textarea").focus();
        }
      }
      setStateFocusInput(false);
    }
  }, [
    listTabInvoice.find((to) => to.is_active === true)?.forms_data,
    listTabInvoice.find((to) => to.is_active === true)?.bill_info,
    listTabInvoice.find((to) => to.is_active === true)?.promotion_ids,
    stateFocusInput,
  ]);

  const validateItem = (errors: any, formData: IFormDataItemSale, listItemSale: IFormDataItemSale[]) => {
    if (
      formData?.values?.expiry_date &&
      moment(formData?.values?.expiry_date, "DD/MM/yyyy").unix() <= moment().unix()
    ) {
      errors = { ...errors, expiry_date: "Hàng hết date" };
    } else if (errors) {
      delete errors["expiry_date"];
    }
    if (formData?.values?.quantity > formData?.values?.warehouse_quantity) {
      errors = { ...errors, combo_quantity: "Số lượng phải nhỏ hơn hoặc bằng Số lượng tồn kho" };
    } else if (errors) {
      delete errors["combo_quantity"];
    }
    if (+formData?.values?.price < formData?.values?.discount) {
      errors = { ...errors, discount: "Giảm giá lớn hơn tiền hàng" };
    } else if (errors) {
      delete errors["discount"];
    }
    if (
      listItemSale.some(
        (itemSale) =>
          itemSale?.values?.number === formData?.values.number &&
          itemSale?.values?.unit_id === formData?.values.unit_id &&
          itemSale?.uuid !== formData?.uuid
      )
    ) {
      errors = { ...errors, number: "Số lô đã được chọn", unit_id: "Đơn vị quy đổi đã được chọn" };
    } else {
      if (errors) {
        delete errors["number"];
        delete errors["unit_id"];
      }
    }
    return errors;
  };

  console.log(listTabInvoice);

  return (
    <div className={`page-content page-sales-create`}>
      <div className="wrapper">
        <div className="main">
          <TitleAction title={id ? "Bán Hàng" : "Bán hàng"} titleActions={titleActions} />
          <div className="card-box d-flex flex-column">
            <SalesTab
              listTabInvoice={listTabInvoice}
              updateTabInvoice={(listTabInvoiceNew) => setListTabInvoice(listTabInvoiceNew)}
            />
            {listTabInvoice.find((to) => to.is_active === true).forms_data.length > 0 && (
              <h2>Thông tin hàng hóa cần bán</h2>
            )}
            <div
              className={`line-items-wrapper${
                listTabInvoice.find((to) => to.is_active === true).forms_data.length === 0 ? " no-item" : ""
              }`}
              ref={refListLineItem}
            >
              {listTabInvoice.find((to) => to.is_active === true).forms_data.length > 0 ? (
                <Fragment>
                  {listTabInvoice
                    .find((to) => to.is_active === true)
                    .forms_data.map((lineItem, index) => {
                      return (
                        <SalesLineItem
                          formData={lineItem}
                          setFormData={(formDataNew) => updateFormData(formDataNew, index)}
                          onRemove={() => removeLineItem(index)}
                          onChooseDrugForSale={() => {
                            setTypeAddDrugForSale({
                              type: lineItem.type_item,
                              uuid: lineItem.type_item !== "retail" ? lineItem.uuid : null,
                            });
                            setShowModalForSale(true);
                          }}
                          key={index}
                          handleSubmitRef={refLineItems}
                        />
                      );
                    })}
                </Fragment>
              ) : (
                <Button
                  type="button"
                  color="transparent"
                  hasIcon={true}
                  onClick={() => setShowModalForSale(true)}
                  className="btn-add-sale-large"
                >
                  <Icon name="PlusCircle" />
                  Chọn sản phẩm bán hàng
                </Button>
              )}
            </div>
          </div>
        </div>
        <BillInfo
          listCustomer={listCustomer}
          lineItems={listTabInvoice.find((to) => to.is_active === true).forms_data}
          formData={listTabInvoice.find((to) => to.is_active === true).bill_info}
          handleUpdate={(billInfoFormData) => updateBillInfo(billInfoFormData)}
          updateListCustomer={(listCustomerNew: IOption[]) => setListCustomer(listCustomerNew)}
          handleSubmit={(type: "temp" | "sell") => handleSubmit(type)}
          handleSubmitRef={refBillInfo}
        />
        <ChooseSalesItemModal
          onShow={showModalForSale}
          onHide={() => setShowModalForSale(!showModalForSale)}
          callback={(drug: ISalesItemModalResponse) => {
            setShowModalForSale(!showModalForSale);
            addDrugForSales(
              typeAddDrugForSale.type,
              drug,
              typeAddDrugForSale !== "retail" ? typeAddDrugForSale.uuid : null
            );
          }}
        />
        {body && (
          <SalesInvoiceDetail onShow={showInvoiceDetail} toggle={() => setShowInvoiceDetail(false)} invoice={body} />
        )}
      </div>
      <Dialog content={contentDialog} isOpen={showDialog} />
    </div>
  );
}
