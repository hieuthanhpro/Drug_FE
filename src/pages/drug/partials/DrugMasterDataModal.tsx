import React, { Fragment, useEffect, useRef, useState } from "react";
import Modal, { ModalBody, ModalHeader } from "components/modal/modal";
import SearchBox from "components/searchBox/searchBox";
import { IDrugMaster } from "model/drug/response/DrugMasterModelResponse";
import BoxTable from "components/boxTable/boxTable";
import Loading from "components/loading";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Icon from "components/icon";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import DrugService from "services/DrugService";
import _ from "lodash";
import { isDifferenceObj, showToast } from "utils/common";
import { DrugMasterDataProps } from "model/drug/PropsModel";
import "./DrugMasterDataModal.scss";

export default function DrugMasterDataModal(props: DrugMasterDataProps) {
  const { onShow, onHide, callback } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listDrugMaster, setListDrugMaster] = useState<IDrugMaster[]>([]);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Thuốc",
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
  });

  const abortController = new AbortController();
  const getListDrugMaster = async (paramsSearch) => {
    setIsLoading(true);
    const response = await DrugService.filterMasterData(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setListDrugMaster(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      const paramsTemp = _.cloneDeep(params);
      if (!isDifferenceObj(paramsTemp, { query: "", page: 1 }) && +result.total === 0) {
        setIsNoItem(true);
      }
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
      getListDrugMaster(params);
    }
    return () => {
      abortController.abort();
    };
  }, [params, onShow]);

  const titles = ["", "Tên thuốc", "Mã thuốc", "Hãng sản xuất", "Số đăng ký", "Quy cách đóng gói"];

  const dataMappingArray = (item: IDrugMaster) => [
    <div className="aspect-ratio aspect-ratio--square-50" key={`product-image-${item.id}`}>
      {item.image ? <img src={item.image} alt={item.name} /> : <Icon name="NoImage" />}
    </div>,
    item.name,
    item.drug_code,
    item.company,
    item.registry_number,
    item.package_form,
  ];

  const dataFormat = ["image"];

  return (
    <Modal isOpen={onShow} className="modal-drug-master" isFade={true} staticBackdrop={true} toggle={onHide} isCentered={true}>
      <ModalHeader title="Tìm kiếm thuốc DQG" toggle={onHide} />
      <ModalBody>
        <SearchBox
          name="Thuốc dược quốc gia"
          params={params}
          updateParams={(paramsNew) => setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)}
          autoFocusSearch={true}
        />
        {!isLoading && listDrugMaster && listDrugMaster.length > 0 ? (
          <BoxTable
            name="Thuốc dược quốc gia"
            titles={titles}
            items={listDrugMaster}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            striped={true}
            onClickRow={(item: IDrugMaster) => callback(item)}
          />
        ) : isLoading === true ? (
          <Loading />
        ) : (
          <Fragment>{isNoItem ? <SystemNotification type="no-item" /> : <SystemNotification type="no-result" />}</Fragment>
        )}
      </ModalBody>
    </Modal>
  );
}
