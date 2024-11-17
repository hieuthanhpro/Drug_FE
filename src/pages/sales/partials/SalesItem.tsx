import React from "react";
import { SalesItemProps } from "model/invoice/PropsModel";
import SalesItemUnit from "./SalesItemUnit";
import Button from "components/button/button";
import Icon from "components/icon";

export default function SalesItem(props: SalesItemProps) {
  const { typeItem, formData, setFormData, formDataCombo, handleSubmitRefSaleItem, onRemove, type } = props;

  return (
    <div className="sales-item">
      <SalesItemUnit
        formDataCombo={formDataCombo}
        formData={formData}
        setFormData={(formDataNew) => setFormData(formDataNew)}
        typeItem={typeItem}
        handleSubmitRefSaleItem={handleSubmitRefSaleItem}
        type={type}
      />
      <Button
        type="button"
        className="btn-remove-item"
        color="transparent"
        hasIcon={true}
        onlyIcon={true}
        onClick={onRemove}
      >
        <Icon name="Times" />
      </Button>
    </div>
  );
}
