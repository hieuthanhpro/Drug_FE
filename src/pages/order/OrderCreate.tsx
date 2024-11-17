import Button from "components/button/button";
import Icon from "components/icon";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import _ from "lodash";
import { defaultSalesItem } from "model/invoice/DataModelInitial";
import {
  IBillInfoFormData,
  IFormDataItemSale,
  IFormDataLineItemSale,
} from "model/invoice/request/SalesInvoiceModelRequest";
import { IOption } from "model/OtherModel";
import moment from "moment";
import BillInfo from "pages/sales/partials/BillInfo";
import SalesItem from "pages/sales/partials/SalesItem";
import React, { useContext, useEffect, useRef, useState } from "react";
import OrderService from "services/OrderService";
import { v4 as uuidv4 } from "uuid";
import "./OrderCreate.scss";
import OrderModal from "./partials/OrderModal";
import WarningOrder from "./partials/WarningOrder";
import { UserContext } from "contexts/userContext";

export default function OrderCreate() {
  const [listCustomer, setListCustomer] = useState(null);
  const [showModalOrder, setShowModalOrder] = useState<boolean>(false);
  const [warningModal, setWarningModal] = useState<boolean>(false);
  const [listStore, setListStore] = useState([]);
  const [listStoreGdp, setListStoreGdp] = useState([]);
  const [idActive, setIdActive] = useState();
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

  const {name,drug_store} = useContext(UserContext)


  const refListLineItem = useRef(null);
  const refLineItems = useRef(null);
  const refBillInfo = useRef(null);

  const handleSubmit = (type) => {
    console.log("a");
  };

  const titleActions: ITitleActions = {
    actions: [
      {
        title: "Đặt hàng từ hàng sắp hết",
        type: "button",
        color: "primary",
        variant: "outline",
        icon: <Icon name="PlusCircleFill" />,
        callback: () => {
          setWarningModal(true)
          // setTypeAddDrugForSale({
          //   type: "retail",
          //   uuid: null,
          // });
          // setShowModalForSale(true);
        },
      },
      {
        title: "Chọn sản phẩm đặt hàng",
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

    const units = drug ? JSON.parse(drug?.units ?? drug?.other_units) : [];
    const numbers = drug ? drug?.numbers : [];

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

    setIdActive(drug.drug_store_id);
  };
  let total = 0;
  const updateFormData = (formData: IFormDataLineItemSale, index: number) => {
    const listOrderTemp = _.cloneDeep(listOrder);
    listOrderTemp.form_data[index].items[0] = formData;

    //tính amount
    listOrderTemp.form_data.forEach((formData) => {
      total += formData.items[0].values.total_amount;
    });
    listOrderTemp.bill_info.values = {
      ...listOrder.bill_info.values,
      amount: total,
      pay_amount: total,
    };

    //lấy list drug store
    const listStore = listOrderTemp.form_data.map((item) => item.drug_store);
    const uniqueStore = listStore.filter(function (item, pos) {
      return listStore.indexOf(item) == pos;
    });

    //set active drug store
    const listStoreId = uniqueStore.map((item, i) => {
      if (i === uniqueStore.length - 1) {
        return {
          isActive: true,
          drug_store_id: item,
        };
      }
      return {
        isActive: false,
        drug_store_id: item,
      };
    });

    setListStore(listStoreId);
    setListOrder(listOrderTemp);
  };
  const removeLineItem = (index: number) => {
    let listOrderTemp = _.cloneDeep(listOrder);
    const item = listOrderTemp.form_data[index].drug_store; // lấy drug store của item cần xóa
    listOrderTemp.form_data.splice(index, 1); // xóa item ở vị trí index

    const listItemStoreTab = listOrderTemp.form_data.filter((store) => store.drug_store == item); //lấy ra list có drug_store_id == item bị xóa
    //xóa hết tab khi không còn item nào
    if (listOrderTemp.form_data.length <= 0) {
      setIdActive(null);
      setListStore([]);
    } else if (listItemStoreTab.length <= 0) {
      //nếu length == 0 => xóa tab
      const idTemp = _.cloneDeep(listStore);
      const newStore = idTemp.filter((store) => store.drug_store_id !== item);

      setIdActive(newStore[0].drug_store_id);
      setListStore(newStore);
    }
    const newTotalPrice = listOrderTemp.form_data?.reduce((acc, curr) => (acc += curr?.items[0]?.values?.total_amount * 1), 0);
    const newBillInfo={...listOrderTemp.bill_info,values:{...listOrderTemp.bill_info.values,amount:newTotalPrice,pay_amount:newTotalPrice}}
    listOrderTemp={...listOrderTemp,bill_info:newBillInfo}
    setListOrder(listOrderTemp);
  };

  const updateBillInfo = (billInfoFormData: IBillInfoFormData) => {
    const listOrderTemp = _.cloneDeep(listOrder);
    // set pay_amount
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
    listOrderTemp.bill_info = newBill;

    setListOrder(listOrderTemp);
  };

  useEffect(() => {
    const getStore = async () => {
      const res = await OrderService.drugStore();

      setListStoreGdp(res.RESULT);
    };

    getStore();
  }, []);

  //change tab
  const handleTabStoreClick = (item) => {
    const newStore = listStore.map((item) => {
      return { ...item, isActive: false };
    });

    const newActive = newStore.map((store, i) => {
      if (store.drug_store_id === item.drug_store_id) {
        return { ...listStore[i], isActive: true };
      } else {
        return { ...listStore[i], isActive: false };
      }
    });

    setListStore(newActive);
    setIdActive(item.drug_store_id);
  };

  const handleGetListChecked = (list, orderList) => {

    const listItemChecked = list.map((d) => {
      const drug = orderList.find((i) => i.id === d);
      
      
      const units = drug ? (drug?.units ?? drug?.other_units) : [];
      const numbers = drug ? drug?.numbers : [];


      return{
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
        },
      };
    });



    const a = listItemChecked.map((item) => {
      return {
        uuid: uuidv4(),
        type_item: "retail",
        items: [item],
        values: {},
        drug_store: drug_store?.id,
      };
    });
    // const retailFormData: IFormDataLineItemSale = {};
    const forms_data = [...listOrder.form_data, a];

    setListOrder({ ...listOrder, form_data: a });
    setIdActive(drug_store?.id);
  };



  return (
    <div className="page-content page-sales-create order-create">
      <div className="wrapper">
        <div className="main">
          <TitleAction title={"Đặt hàng"} titleActions={titleActions} />
          <div className="card-box d-flex flex-column">
            <div className="list-tab">
              {idActive &&
                listStore.map((item, i) => (
                  <span className={`list-tab__item ${item.isActive ? "store-active" : null}`} key={i} onClick={() => handleTabStoreClick(item)}>
                    {listStoreGdp.map((store) => {
                      if (store.id === item.drug_store_id) {
                        return store.name;
                      }
                    })}
                  </span>
                ))}
            </div>
            <h2>Thông tin hàng hóa cần đặt</h2>
            <div className={`line-items-wrapper`} ref={refListLineItem}>
              {listOrder.form_data.length > 0 ? (
                listOrder.form_data.map((item, i) => {
                  if (item.drug_store === idActive) {
                    return (
                      <SalesItem
                        key={i}
                        formData={item?.items[0]}
                        setFormData={(formDataItemSale) => updateFormData(formDataItemSale, i)}
                        onRemove={() => removeLineItem(i)}
                        typeItem="retail"
                        handleSubmitRefSaleItem={refLineItems}
                        type="order"
                      />
                    );
                  }
                })
              ) : (
                <Button type="button" color="transparent" hasIcon={true} onClick={() => setShowModalOrder(true)} className="btn-add-sale-large">
                  <Icon name="PlusCircle" />
                  Chọn sản phẩm đặt hàng
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* <OrderBillInfo /> */}
        <BillInfo
          listCustomer={listCustomer}
          lineItems={listOrder.form_data}
          formData={listOrder.bill_info}
          handleUpdate={(billInfoFormData) => updateBillInfo(billInfoFormData)}
          updateListCustomer={(listCustomerNew: IOption[]) => setListCustomer(listCustomerNew)}
          handleSubmit={(type: "temp" | "sell") => handleSubmit(type)}
          handleSubmitRef={refBillInfo}
          type="DH"
        />

        {warningModal && (
          <WarningOrder
            onShow={warningModal}
            handleListChecked={(list, orderList) => handleGetListChecked(list, orderList)}
            toggle={() => setWarningModal(!warningModal)}
          />
        )}

        <OrderModal onShow={showModalOrder} toggle={() => setShowModalOrder(false)} callback={(drug) => addDrugForOrder(drug)} isFilter="true" />
      </div>
      {/* <Dialog content={contentDialog} isOpen={showDialog} /> */}
    </div>
  );
}
