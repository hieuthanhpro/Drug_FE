import React, { useState, useMemo, useEffect, useCallback, Fragment } from "react";
import { IFieldCustomize, IValidation } from "model/FormModel";
import Validate, { handleChangeValidate } from "utils/validate";
import AddCustomerModal from "pages/management/partials/AddCustomerModal";
import Button from "components/button/button";
import { ICustomer } from "model/customer/response/CustomerResponseModel";
import { BillInfoProps } from "model/invoice/PropsModel";
import Icon from "components/icon";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import { PaymentMethods, SalesMethods } from "model/invoice/DataModelInitial";
import { IOption } from "model/OtherModel";
import { formatCurrency } from "utils/common";

export default function BillInfo(props: BillInfoProps) {
  const { listCustomer, lineItems, formData, handleUpdate, handleSubmit, handleSubmitRef, updateListCustomer, type } =
    props;
  const validations: IValidation[] = [
    {
      name: "receipt_date",
      rules: "required",
    },
    {
      name: "method",
      rules: "required",
    },
    {
      name: "payment_method",
      rules: "required",
    },
    {
      name: "pay_amount",
      rules: "required",
    },
    {
      name: "amount",
      rules: "required",
    },
    {
      name: "customer_id",
      rules: "required",
    },

  ];

  const listFieldTimeCustomer: IFieldCustomize[] = useMemo(
    () =>
      type !== "DH"
        ? ([
            {
              label: (
                <Fragment>
                  <Icon name="Clock" />
                  Ngày tạo hóa đơn
                </Fragment>
              ),
              name: "receipt_date",
              type: "date",
              required: true,
            },
            {
              label: (
                <Fragment>
                  <Icon name="UserCircle" />
                  {type === "warehouse" ? "Nhà cung cấp" : "Khách hàng"}
                  <span className="required"> * </span>
                  <Icon name="UserAdd" className="button-add-user" onClick={() => setShowModalAddCustomer(true)} />
                </Fragment>
              ),
              name: "customer_id",
              type: "select",
              options: listCustomer,
            },
          ] as IFieldCustomize[])
        : ([
            {
              label: (
                <Fragment>
                  <Icon name="Clock" />
                  Ngày tạo hóa đơn
                </Fragment>
              ),
              name: "receipt_date",
              type: "date",
              required: true,
            },
          ] as IFieldCustomize[]),
    [listCustomer]
  );

  const listFieldPaymentInfo: IFieldCustomize[] = useMemo(
    () =>
      type === "DH"
        ? [
            {
              label: "Ngày nhận hàng mong muốn",
              labelPosition: "left",
              name: "desired_date",
              type: "date",
            },
            {
              label: "Hình thức thanh toán",
              labelPosition: "left",
              name: "payment_method",
              type: "select",
              options: PaymentMethods,
              required: true,
            },
            {
              label: "Ghi chú",
              labelHidden: true,
              name: "description",
              type: "textarea",
              fillColor: true,
            },
          ]
        : type !== "warehouse"
        ? ([
            {
              label: "Hình thức bán",
              labelPosition: "left",
              name: "method",
              type: "select",
              options: SalesMethods,
              required: true,
            },
            {
              label: "Hình thức thanh toán",
              labelPosition: "left",
              name: "payment_method",
              type: "select",
              options: PaymentMethods,
              required: true,
            },
            {
              label: "Giảm giá sau VAT",
              labelPosition: "left",
              name: formData?.values?.discount_type === "percentage" ? "discount_rate" : "discount",
              nameOptions: "discount_type",
              onChangeValueOptions: (value) => {
                handleUpdate({ ...formData, values: { ...formData?.values, discount_type: value } });
              },
              options: [
                {
                  value: "amount",
                  label: "vnđ",
                },
                {
                  value: "percentage",
                  label: "%",
                },
              ],
              type: "number",
              suffixes: formData?.values?.discount_type === "percentage" ? "%" : "đ",
            },
            {
              label: "Khách thực trả",
              labelPosition: "left",
              name: "pay_amount",
              required: true,
              type: "number",
              suffixes: "đ",
            },
            {
              label: "Ghi chú",
              labelHidden: true,
              name: "description",
              type: "textarea",
              fillColor: true,
            },
          ] as IFieldCustomize[])
        : ([
            {
              label: "Hình thức thanh toán",
              labelPosition: "left",
              name: "payment_method",
              type: "select",
              options: PaymentMethods,
              required: true,
            },
            {
              label: "Giảm giá sau VAT",
              labelPosition: "left",
              name: formData?.values?.discount_type === "percentage" ? "discount_rate" : "discount",
              nameOptions: "discount_type",
              onChangeValueOptions: (value) => {
                handleUpdate({ ...formData, values: { ...formData?.values, discount_type: value } });
              },
              options: [
                {
                  value: "amount",
                  label: "vnđ",
                },
                {
                  value: "percentage",
                  label: "%",
                },
              ],
              type: "number",
              suffixes: formData?.values?.discount_type === "percentage" ? "%" : "đ",
            },
            {
              label: "Thực trả cho NCC",
              labelPosition: "left",
              name: "pay_amount",
              required: true,
              type: "number",
              suffixes: "đ",
            },
            {
              label: "Ghi chú",
              labelHidden: true,
              name: "description",
              type: "textarea",
              fillColor: true,
            },
          ] as IFieldCustomize[]),
    [formData]
  );

  const listInfoFinal: IOption[] = useMemo(
    () =>
      type === "DH"
        ? [
            {
              value: lineItems.reduce((a, b) => +a + (b.type_item !== "retail" ? b?.items.length : 1), 0),
              label: "Số lượng mặt hàng",
            },
            {
              value: formatCurrency(formData?.values?.amount ?? 0, ","),
              label: "Tổng tiền",
            },
          ]
        : [
            {
              value: lineItems.reduce((a, b) => +a + (b.type_item !== "retail" ? b?.items.length : 1), 0),
              label: "Số lượng mặt hàng",
            },
            {
              value: formatCurrency(lineItems.reduce((acc,curr)=>  acc +=curr?.items[0]?.values?.totalAmount ,0) ?? 0, ","),
              label: "Tổng tiền",
            },
            {
              value: formatCurrency(formData?.values?.discount_promotion ?? 0, ","),
              label: "Giảm giá CTKM",
            },
            {
              value: formatCurrency(formData?.values?.vat_amount ?? 0, ","),
              label: "Tổng VAT",
            },
            {
              value: formatCurrency(formData?.values?.discount ?? 0, ","),
              label: "Giảm giá sau VAT",
            },
            {
              value: formatCurrency(formData?.values?.pay_amount ?? 0, ","),
              label: type === "warehouse" ? "Tổng tiền phải trả" : "Khách hàng cần trả",
            },
            {
              value: formatCurrency(
                formData?.values?.amount -
                  formData?.values?.discount -
                  formData?.values?.pay_amount -
                  formData?.values?.discount_promotion >
                  0
                  ? formData?.values?.amount -
                      formData?.values?.discount -
                      formData?.values?.pay_amount -
                      formData?.values?.discount_promotion
                  : 0 || 0,
                ""
              ),
              label: "Công nợ",
            },
          ],
    [lineItems, formData]
  );

  const [showModalAddCustomer, setShowModalAddCustomer] = useState<boolean>(false);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (formData?.errors && Object.keys(formData?.errors)) {
      setIsDisabled(true);
      return;
    }
    const errorCount = lineItems.reduce(
      (a, b) =>
        +a +
        (b?.items?.length > 0
          ? b?.items.reduce(
              (c, d) => +c + (d.errors && Object.keys(d.errors).length > 0 ? Object.keys(d.errors).length : 0),
              0
            )
          : 0) +
        (b.errors && Object.keys(b.errors).length > 0 ? Object.keys(b.errors).length : 0),
      0
    );

    const isEmpty=lineItems?.some(el=>{
      if((el.type_item==='combo'||el.type_item==="prescription") &&  el.items.length===0) return true
      return false
    })
    
    if (lineItems.length === 0 || errorCount || isEmpty  ) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  }, [lineItems, formData]);

  // Add event call from parent
  useEffect(() => {
    handleSubmitRef.current = handleSubmitForm;
  }, [formData, lineItems]);

  const handleSubmitForm = useCallback(() => {
    const errors = Validate(validations, formData, [...listFieldTimeCustomer, ...listFieldPaymentInfo]);
    if (errors && Object.keys(errors).length > 0) {
      handleUpdate({ ...formData, errors: errors });
      return true;
    }
    return false;
  }, [formData, lineItems]);
  return (
    <div className="bill-info">
      <div className="bill-info__wrapper">
        {listFieldTimeCustomer.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) =>
              handleChangeValidate(value, field, formData, validations, listFieldTimeCustomer, handleUpdate)
            }
            formData={formData}
          />
        ))}
        <h3>
          <Icon name="CreditCard" /> Thông tin thanh toán
        </h3>
        <div className="payment-info">
          {listFieldPaymentInfo.map((field, index) => (
            <FieldCustomize
              field={field}
              key={index}
              handleUpdate={(value) =>
                handleChangeValidate(value, field, formData, validations, listFieldPaymentInfo, handleUpdate)
              }
              formData={formData}
            />
          ))}
        </div>
        <ul className="total-info">
          {listInfoFinal.map((item, index) => (
            <li key={index}>
              <span>{item.label}:</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bill-info__actions">
        <Button
          type="button"
          color="primary"
          variant="outline"
          onClick={() => handleSubmit("temp")}
          disabled={isDisabled}
        >
          Lưu tạm
        </Button>
        <Button type="button" color="primary" onClick={() => handleSubmit("sell")} disabled={isDisabled}>
          Tạo đơn hàng
        </Button>
      </div>
      <AddCustomerModal
        onShow={showModalAddCustomer}
        onHide={(data?: ICustomer) => {
          if (data) {
            updateListCustomer([...listCustomer, { value: data.id, label: data.name }]);
            handleUpdate({ ...formData, values: { ...formData.values, customer_id: data.id } });
          }
          setShowModalAddCustomer(false);
        }}
      />
    </div>
  );
}
