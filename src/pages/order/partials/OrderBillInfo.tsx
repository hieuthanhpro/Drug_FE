import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Icon from "components/icon";
import { IFieldCustomize } from "model/FormModel";
import React, { Fragment, useMemo, useState } from "react";
import "../OrderCreate.scss";

export default function OrderBillInfo() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [formData, setFormData] = useState(null);

  const listFieldTimeCustomer: IFieldCustomize[] = useMemo(
    () =>
      [
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
              Khách hàng<span className="required"> * </span>
              <Icon name="UserAdd" className="button-add-user" onClick={() => setShowModalAdd(true)} />
            </Fragment>
          ),
          name: "customer_id",
          type: "select",
          // options: listCustomer,
        },
      ] as IFieldCustomize[],
    []
  );
  return (
    <div className="order-bill-info">
      <div className="order-bill-info__container">
        {listFieldTimeCustomer.map((field, index) => (
          <FieldCustomize
            field={field}
            key={index}
            handleUpdate={(value) =>
              // handleChangeValidate(value, field, formData, validations, listFieldTimeCustomer, handleUpdate)
              console.log(value)
            }
            formData={formData}
          />
        ))}
      </div>
    </div>
  );
}
