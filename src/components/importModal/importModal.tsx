import React, { useEffect, useState } from "react";
import { IActionModal, IOption } from "model/OtherModel";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import RadioList from "components/radio/radioList";
import "./importModal.scss";
import BoxTable from "../boxTable/boxTable";

export interface ImportModalProps {
  name: string;
  onShow: boolean;
  onHide: () => void;
  callback: (type: string, extension: string) => void;
  isDrug:boolean;
  titles: any;
  listDrugImport: any[];
  dataFormat?: string[];
  dataMappingArray: any;
}
export default function ImportModal(props:ImportModalProps) {
  const { name, onShow, onHide, callback,
    isDrug,
    titles,
    listDrugImport,
    dataFormat,
    dataMappingArray,
   } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  useEffect(() => {
    if (onShow) {
      setIsSubmit(false);
    }
  }, [onShow]);

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  const actions: IActionModal = {
    actions_right: {
      buttons: [
        {
          title: "Hủy",
          color: "primary",
          variant: "outline",
          disabled: isSubmit,
          callback: () => onHide(),
        },
        {
          title: "Nhập file",
          type: "submit",
          color: "primary",
          disabled: isSubmit,
          is_loading: isSubmit,
          callback: () => {
            setIsSubmit(true);
            // callback(typeExport as string, extensionFile);
          },
        },
      ],
    },
  };


  return (
    <Modal isOpen={onShow} className="modal-import" isFade={true} staticBackdrop={true} toggle={() => !isSubmit && onHide()} isCentered={true} size="xl">
      <form className="form-import" onSubmit={(e) => onSubmit(e)}>
        <ModalHeader title={`Nhập danh sách ${name}`} toggle={() => !isSubmit && onHide()} />
        <ModalBody className="custom-body">
         <BoxTable
            name={isDrug ? "Thuốc" : "Sản phẩm"}
            titles={titles()}
            items={listDrugImport}
            dataFormat={dataFormat}
            dataMappingArray={(item) => dataMappingArray(item)}
            striped={true}
          />
         
        </ModalBody>
        <ModalFooter actions={actions} />
      </form>
    </Modal>
  );
}
