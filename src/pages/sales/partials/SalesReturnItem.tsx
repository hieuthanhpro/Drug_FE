import Button from "components/button/button";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Icon from "components/icon";
import Input from "components/input/input";
import Loading from "components/loading";
import SelectCustom from "components/selectCustom/selectCustom";
import { IFieldCustomize, IFormData, IValidation } from "model/FormModel";
import { PaymentMethods, SalesMethods } from "model/invoice/DataModelInitial";
import moment from "moment";
import React, { useEffect, useState } from "react";
import InvoiceService from "services/InvoiceService";
import { formatCurrency, showToast } from "utils/common";
import Validate, { handleChangeValidate } from "utils/validate";
import "./SalesReturnItem.scss";

interface SalesReturnItemProps {
  data: any[];
  invoiceInfo: any;
  invoiceDetail: any[];
  toggle?: any;
}
export default function SalesReturnItem(props: SalesReturnItemProps) {
  const { data, invoiceInfo, invoiceDetail, toggle } = props;

  const handleSubmit = () => {
    console.log("submit");
  };

  const [formData, setFormData] = useState<IFormData>({
    values: {},
  });

  const [formData2, setFormData2] = useState<IFormData>({
    values: {},
  });
  const listField2: IFieldCustomize[] = [
    {
      label: "Số lượng trả",
      name: "quantity_return_id",
      type: "number",
      labelPosition: "left",
      required: true,
    },
  ];

  const validations2: IValidation[] = [
    {
      name: "quantity_return",
      rules: "required|min:0",
    },
  ];

  const listField: IFieldCustomize[] = [
    {
      label: "Số lượng trả",
      name: "quantity_return",
      type: "number",
      labelPosition: "left",
      required: true,
    },
  ];

  const validations: IValidation[] = [
    {
      name: "quantity_return",
      rules: "required|min:0",
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    const listItem = Object.keys(formData.values).map((key) => [String(key), formData.values[key]]);

    const items = invoiceDetail.map((item, i) => {
      return listItem
        .map((lItem) => {
          if (lItem[0] === item.combo_name) {
            return {
              quantity: lItem[1],
              combo_name: item.combo_name,
              cost: item.cost,
              drug_id: +item.drug_id < 0 ? 2350326 : +item.drug_id,
              exchange: item.exchange,
              expiry_date: item.expiry_date
                ? moment(item.expiry_date).format("YYYY/MM/DD").replaceAll("/", "-")
                : "2023-09-02",
              number: item.number,
              unit_id: +item.unit_id < 0 ? 1 : +item.unit_id,
              vat: item.vat,
            };
          }
        })
        .filter((drugItem) => drugItem);
    });

    const body = {
      amount: invoiceInfo.amount,
      customer_id: invoiceInfo.customer_id,
      description: invoiceInfo.description,
      discount: invoiceInfo.discount,
      invoice_detail: items.map((item) => item[0]),
      invoice_type: "IV3",
      is_order: null,
      method: "direct",
      pay_amount: invoiceInfo.pay_amount,
      payment_method: invoiceInfo.payment_method,
      receipt_date: invoiceInfo.receipt_date,
      refer_id: null,
      sale_id: null,
      source: "GPP",
      status: "done",
    };

    const res = await InvoiceService.save(body);
    if (res.code === 200) {
      showToast(`Trả thành công đơn hàng ${invoiceInfo.invoice_code}`, "success");
      toggle();
    } else {
      showToast("Trả hàng thất bại", "error");
      toggle();
    }
  };

  console.log(formData2);

  return (
    <div className="sales-return-item">
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col-9">
            <h4 className="sales-return-item__title">Thông tin đơn hàng cần trả</h4>
            <div className="sales-return-item__body">
              {data?.length > 0 ? (
                data.map((item, i) => {
                  if (item.combo_name) {
                    return (
                      <div className="sales-return-item__combo" key={i}>
                        <div className="sales-return-item__combo__container">
                          <div className="sales-return-item__combo__header">
                            <h4 className="sales-return-item__combo__title">{item.combo_name}</h4>
                            <Button onlyIcon>
                              <Icon name="Times" />
                            </Button>
                          </div>
                          <div className="sales-return-item__combo__body row">
                            <div className="sales-return-item__combo__body__name col-4">
                              <span className="title">Tên combo-thuốc liều:</span>
                              <span className="value">{item.combo_name}</span>
                            </div>
                            <div className="sales-return-item__combo__body__name col-4">
                              <span className="title">Số lượng liều đã mua:</span>
                              <span className="value">{item?.invoice_detail[0]?.invoice_detail.quantity}</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-3 body-item">
                              <Input disabled labelPosition="left" label={"Số liều đã trả"} defaultValue={"0"} />
                            </div>
                            <div className="col-3 body-item">
                              <FieldCustomize
                                field={{
                                  label: "Số lượng trả",
                                  name: `${item.combo_name}`,
                                  type: "number",
                                  labelPosition: "left",
                                  required: true,
                                }}
                                handleUpdate={(value) =>
                                  handleChangeValidate(
                                    value,
                                    {
                                      label: "Số lượng trả",
                                      name: `${item.combo_name}`,
                                      type: "number",
                                      labelPosition: "left",
                                      required: true,
                                    },
                                    formData,
                                    validations,
                                    listField,
                                    setFormData
                                  )
                                }
                                formData={formData}
                              />
                            </div>
                            <div className="col-3 body-item">
                              <Input
                                disabled
                                labelPosition="left"
                                label={"Giá liều"}
                                defaultValue={formatCurrency(item?.invoice_detail[0]?.invoice_detail.cost)}
                              />
                            </div>
                            <div className="col-3 body-item">
                              <Input disabled labelPosition="left" label={"Thành tiền"} defaultValue={0} />
                            </div>
                          </div>
                          <div className="mt-5">
                            {item?.invoice_detail
                              .filter((item) => item.drug_id !== -1)
                              .map((lineItem) => (
                                <SalesReturnLineItem
                                  type="combo"
                                  key={lineItem.drug_id}
                                  dataItem={lineItem.invoice_detail}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={i}>
                        {item?.invoice_detail.map((single, index) => (
                          <SalesReturnLineItem
                            key={index}
                            type="retail"
                            dataItem={single?.invoice_detail}
                            id={single.drug_id}
                            number={single.number}
                            formData={formData2}
                            setFormData={setFormData2}
                            listField={listField2}
                            validations={validations2}
                          />
                        ))}
                      </div>
                    );
                  }
                })
              ) : (
                <Loading />
              )}
            </div>
          </div>
          <div className="col-3">
            <SalesReturnBillInfo invoiceInfo={invoiceInfo} handleClick={handleSubmit} />
          </div>
        </div>
      </form>
    </div>
  );
}

interface SalesReturnLineItemProps {
  type?: "retail" | "combo";
  dataItem: any;
  id?: string;
  formData?: any;
  setFormData?: any;
  listField?: any;
  validations?: any;
  number?: string;
}

const SalesReturnLineItem = (props: SalesReturnLineItemProps) => {
  const { type, dataItem, id, formData, setFormData, listField, validations, number } = props;

  return (
    <div className={`return-line-item ${type === "retail" ? " retail" : null}`}>
      <div className="return-line-item__container">
        <div className="return-line-item__header">
          <div className="return-line-item__header__left d-flex">
            <div>
              <span>Tên thuốc: </span>
              <span className="value">{dataItem?.drug_name}</span>
            </div>
            <div className="ml-4">
              <span>Số lượng đã mua: </span>
              <span className="value">{dataItem?.quantity}</span>
            </div>
          </div>
          <div className="return-line-item__header__right">
            <Button color="transparent" onlyIcon>
              <Icon name="Times" />
            </Button>
          </div>
        </div>
        <div className="return-line-item__body">
          <div className="row">
            <div className="col-2 image">
              <img src="http://mapi.sphacy.vn/upload/drug/03032019_d53defd3.jpg" alt="" />
            </div>
            <div className="col-10">
              <div className="row">
                <div className="col-6 body-item">
                  <Input disabled labelPosition="left" label={"Lô sản xuất"} defaultValue={dataItem?.number} />
                </div>
                <div className="col-6 body-item">
                  <Input disabled labelPosition="left" label={"Đơn vị tính"} defaultValue={dataItem?.unit_name} />
                </div>
                {type === "retail" ? (
                  <>
                    <div className="col-6 body-item">
                      <Input disabled labelPosition="left" type="number" label={"Đã trả"} defaultValue={"0"} />
                    </div>
                    <div className="col-6 body-item">
                      <FieldCustomize
                        field={{
                          label: "Số lượng trả",
                          name: `${id}_${number}`,
                          type: "number",
                          labelPosition: "left",
                          required: true,
                        }}
                        handleUpdate={(value) =>
                          handleChangeValidate(
                            value,
                            {
                              label: "Số lượng trả",
                              name: `${id}_${number}`,
                              type: "number",
                              labelPosition: "left",
                              required: true,
                            },
                            formData,
                            validations,
                            listField,
                            setFormData
                          )
                        }
                        formData={formData}
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-6 body-item">
                    <Input
                      disabled
                      labelPosition="left"
                      type="number"
                      label={"Số lượng"}
                      defaultValue={dataItem?.quantity}
                    />
                  </div>
                )}
                <div className="col-6 body-item">
                  <Input
                    disabled
                    labelPosition="left"
                    label={"Giá bán"}
                    defaultValue={
                      dataItem?.current_cost !== 0
                        ? formatCurrency(dataItem?.current_cost)
                        : formatCurrency(dataItem?.org_cost)
                    }
                  />
                </div>
                <div className="col-6 body-item">
                  <Input
                    disabled
                    labelPosition="left"
                    label={"Hạn dùng"}
                    defaultValue={moment(dataItem?.expiry_date).format("DD/MM/YYYY")}
                  />
                </div>
                <div className="col-6 body-item">
                  <Input disabled labelPosition="left" label={"VAT"} defaultValue={formatCurrency(dataItem?.vat)} />
                </div>
                <div className="col-6 body-item">
                  <Input
                    disabled
                    labelPosition="left"
                    label={"Thành tiền"}
                    defaultValue={formatCurrency(dataItem?.org_cost * dataItem?.quantity)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesReturnBillInfo = ({ invoiceInfo, handleClick }) => {
  return (
    <div className="return-bill">
      <h3 className="return-bill__header">Thông tin trả hàng</h3>
      <div className="return-bill__container">
        <div className="row return-bill__body">
          <div className="col-12">
            <span className="title">Mã hóa đơn:</span>
            <span className="value">{invoiceInfo?.invoice_code}</span>
          </div>
          <div className="col-12">
            <span className="title">Ngày bán hàng:</span>
            <span className="value">{moment(invoiceInfo?.updated_at).format("DD/MM/YYYY")}</span>
          </div>
          <div className="col-12">
            <span className="title">Tổng tiền:</span>
            <span className="value">0</span>
          </div>
          <div className="col-12">
            <span className="title">Chênh lệch trả hàng:</span>
            <span className="value">0</span>
          </div>
          <div className="col-12">
            <Input label={"Thực trả:"} defaultValue={0} type="number" />
          </div>
          <div className="col-12">
            <SelectCustom options={SalesMethods} disabled label="Hình thức bán" value={"direct"} />
          </div>
          <div className="col-12">
            <SelectCustom options={PaymentMethods} label="Hình thức thanh toán" value={"cash"} />
          </div>
          <div className="col-12">
            <Input type="textarea" placeholder="Nhập ghi chú" />
          </div>
        </div>
      </div>
      <div className="btn">
        <Button type="submit">Hoàn thành</Button>
      </div>
    </div>
  );
};
