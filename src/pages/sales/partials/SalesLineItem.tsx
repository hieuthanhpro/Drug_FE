import React, { useCallback, useEffect } from "react";
import { SalesLineItemProps } from "model/invoice/PropsModel";
import SalesItem from "./SalesItem";
import SalesComboItem from "./SalesComboItem";
import SalesPrescriptionItem from "./SalesPrescriptionItem";
import { IFormDataItemSale } from "model/invoice/request/SalesInvoiceModelRequest";
import _ from "lodash";

export default function SalesLineItem(props: SalesLineItemProps) {
  const { formData, setFormData, onRemove, handleSubmitRef, onChooseDrugForSale } = props;

  const updateFormData = (formDataItemSale: IFormDataItemSale) => {
    const formDataTemp = _.cloneDeep(formData);
    formDataTemp.items[0] = formDataItemSale;
    setFormData(formDataTemp);
  };

  const refItem = React.useRef(null);

  // Add event call from parent
  useEffect(() => {
    handleSubmitRef.current = handleSubmitForm;
  }, [formData]);

  const handleSubmitForm = useCallback(() => {
    if (refItem && refItem.current) {
      const errorsItem = refItem.current();
      return errorsItem;
    }
  }, [formData]);

  return (
    <div className="sales-line-item">
      {formData.type_item === "retail" ? (
        <SalesItem
          formData={formData?.items[0]}
          setFormData={(formDataItemSale) => updateFormData(formDataItemSale)}
          onRemove={onRemove}
          typeItem="retail"
          handleSubmitRefSaleItem={refItem}
        />
      ) : formData.type_item === "combo" ? (
        <SalesComboItem
          formData={formData}
          setFormData={(formDataNew) => setFormData(formDataNew)}
          onRemove={onRemove}
          onChooseDrugForSale={onChooseDrugForSale}
          handleSubmitRefSaleComboItem={refItem}
        />
      ) : (
        <SalesPrescriptionItem
          formData={formData}
          setFormData={(formDataNew) => setFormData(formDataNew)}
          onRemove={onRemove}
          onChooseDrugForSale={onChooseDrugForSale}
          handleSubmitRefSaleComboItem={refItem}
        />
      )}
    </div>
  );
}
