import React, { useEffect, useRef, useState } from "react";
import Modal, { ModalBody, ModalHeader } from "components/modal/modal";
import SearchBox from "components/searchBox/searchBox";
import Loading from "components/loading";
import { SystemNotification } from "components/systemNotification/systemNotification";
import DrugService from "services/DrugService";
import { formatCurrency, showToast } from "utils/common";
import { ChooseSalesItemModalProps, SalesItemModalProps } from "model/invoice/PropsModel";
import Icon from "components/icon";
import { ISalesItemModalResponse } from "model/invoice/response/SalesInvoiceModelResponse";
import moment from "moment";
import "./ChooseSalesItemModal.scss";

export default function ChooseSalesItemModal(props: ChooseSalesItemModalProps) {
  const { onShow, onHide, callback,type } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChoose, setIsChoose] = useState<boolean>(false);
  const [listDrug, setListDrug] = useState<ISalesItemModalResponse[]>([]);
  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: "",
  });

  const abortController = new AbortController();
  const getListDrugSale = async (paramsSearch) => {
    setIsLoading(true);
    let response=null
    if (type === "warehousing") {
      response = await DrugService.filterForWarehousing(paramsSearch, abortController.signal);
    } else {
       response = await DrugService.filterForSale(paramsSearch, abortController.signal);
    }
    if (response.code === 200) {
      const result = response.result;
      type === "warehousing" ? setListDrug(result) : setListDrug(result.data);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true && onShow) {
      setIsChoose(false);
      getListDrugSale(params);
    }
    return () => {
      abortController.abort();
    };
  }, [params, onShow]);

  return (
    <Modal isOpen={onShow} className="modal-drug-sale" isFade={true} staticBackdrop={true} toggle={onHide} isCentered={true}>
      <ModalHeader title="Tìm kiếm thuốc" toggle={onHide} />
      <ModalBody>
        <SearchBox
          name="Thuốc"
          params={params}
          updateParams={(paramsNew) => setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)}
          autoFocusSearch={true}
        />
        {!isLoading && listDrug && listDrug.length > 0 ? (
          <div className="list-drug">
            {listDrug.map((drug, index) => (
              <SalesItemModal
                key={index}
                type={type}
                data={drug}
                callback={() => {
                  if (!isChoose) {
                    setIsChoose(true);
                    callback(drug);
                  }
                }}
              />
            ))}
          </div>
        ) : isLoading === true ? (
          <Loading />
        ) : (
          <SystemNotification type="no-result" />
        )}
      </ModalBody>
    </Modal>
  );
}

function SalesItemModal(props: SalesItemModalProps) {
  const { data, callback,type } = props;
  return (
    <div className="drug-modal-item" onClick={callback}>
      <div className="drug-modal-item__image">
        <div className="aspect-ratio aspect-ratio--square-100" key={`product-image-${data?.id}-${data?.number}-${data?.unit_id}`}>
          {data?.image ? <img src={data?.image} alt={data?.name} /> : <Icon name="NoImage" />}
        </div>
      </div>
      <div className="drug-modal-item__info">
        <div className="block-header d-flex justify-content-between">
          <div className="title">
            <span>{data.name}</span> 
            {type === "warehousing" ? null : (
              <>
                | Tồn kho: <strong>{formatCurrency(data?.quantity, ",", "")}</strong>
              </>
            )}
          </div>
          {type !== "warehousing" && (
            <div className="price">
              Giá bán: <span>{formatCurrency(data?.current_cost, ",")}</span>
            </div>
          )}
        </div>
        {type === "warehousing" ? (
          <div className="row">
            <div className="col-6">
              <span>
                Mã sản phẩm: <strong>{data?.drug_code}</strong>
              </span>
            </div>
            <div className="col-6">
              <span>
                Quy cách đóng gói: <strong>{data?.package_form}</strong>
              </span>
            </div>
            <div className="col-6">
              <span>
                Công ty: <strong>{data?.company}</strong>
              </span>
            </div>
            <div className="col-6">
              <span>
                Số đăng ký: <strong>{data?.registry_number}</strong>
              </span>
            </div>
          </div>
        ) : (
          <ul className="block-info-extra d-flex">
            <li>
              Mã sản phẩm: <strong>{data?.drug_code}</strong>
            </li>
            {data?.company && (
              <li>
                Nhà cung cấp: <strong>{data?.company}</strong>
              </li>
            )}
            {data?.registry_number && (
              <li>
                Số đăng ký: <strong>{data?.registry_number}</strong>
              </li>
            )}
            <li>
              Số lô: <strong>{data?.number}</strong>
            </li>
            <li>
              Đơn vị: <strong>{data?.unit_name}</strong>
            </li>
            <li>
              Hạn sử dụng: <strong>{moment(data?.expiry_date).format("DD/MM/YYYY")}</strong>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
