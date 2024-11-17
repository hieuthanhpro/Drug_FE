import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import Modal, { ModalBody, ModalHeader } from "components/modal/modal";
import SearchBox from "components/searchBox/searchBox";
import BoxTable from "components/boxTable/boxTable";
import Loading from "components/loading";
import { SystemNotification } from "components/systemNotification/systemNotification";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import DrugService from "services/DrugService";
import _ from "lodash";
import { convertToFileName, isDifferenceObj, showToast } from "utils/common";
import { IDrug } from "model/drug/response/DrugModelResponse";
import Button from "components/button/button";
import ExportModal from "components/exportModal/exportModal";
import { IOption } from "model/OtherModel";
import { ExportExcel } from "exports/excel";
import { ExportPdf } from "exports/pdf";
import TableDocDefinition from "exports/pdf/table";
import { ContextType, UserContext } from "contexts/userContext";
import { DrugGroupDetailProps } from "model/drug/PropsModel";
import "./DrugGroupDetailModal.scss";

export default function DrugGroupDetailModal(props: DrugGroupDetailProps) {
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const { data, isDrug, isGroup, onShow, onHide } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listDrugByGroup, setListDrugByGroup] = useState<IDrug[]>([]);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: `${isGroup ? "Nhóm" : "Danh mục"} ${isDrug ? " thuốc" : " sản phẩm"}`,
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
  });

  const abortController = new AbortController();
  const getListDrug = async (paramsSearch) => {
    setIsLoading(true);
    const response = await DrugService.filter(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setListDrugByGroup(result.data);
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
    if (isMounted.current === true && onShow && data) {
      getListDrug({ ...params, ...(isGroup && data ? { group: data?.id } : data ? { category: data?.id } : {}) });
    }
    return () => {
      abortController.abort();
    };
  }, [params, onShow]);

  const titles = ["Tên thuốc", "Mã thuốc", "Đơn vị nhỏ nhất", "Tồn kho (Đơn vị nhỏ nhất)"];

  const dataMappingArray = (item: IDrug) => [item.name, item.drug_code, item.unit_name, +item.quantity];
  const dataFormat = ["", "", "text-center", "text-center"];

  //Export
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả ${isDrug ? `thuốc thuộc ${isGroup ? "nhóm" : "danh mục"}` : `sản phẩm thuộc ${isGroup ? "nhóm" : "danh mục"}`}`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} ${isGroup ? "thuốc" : "sản phẩm"} phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "" }),
      },
    ],
    [isDrug, pagination, params, isGroup, data]
  );

  const exportCallback = async (type, extension) => {
    const response = await DrugService.export({ ...params, ...(isGroup && data ? { group: data?.id } : data ? { category: data?.id } : {}), type });
    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: isGroup ? `Nhom${convertToFileName(data?.name)}` : `DanhMuc${convertToFileName(data?.name)}`,
          title: isGroup ? `Nhóm ${data?.name}` : `Danh mục ${data?.name}`,
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item)),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: isGroup ? `Nhóm ${data?.name}` : `Danh mục ${data?.name}`,
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item)),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
            },
          }),
          isGroup ? `Nhom${convertToFileName(data?.name)}` : `DanhMuc${convertToFileName(data?.name)}`
        );
      }
      showToast("Xuất file thành công", "success");
      setOnShowModalExport(false);
    } else {
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
      setOnShowModalExport(false);
    }
  };

  return (
    <Fragment>
      <Modal isOpen={onShow} className="modal-drug-group-detail" isFade={true} staticBackdrop={true} toggle={onHide} isCentered={true}>
        <ModalHeader title={data?.name} toggle={onHide} />
        <ModalBody>
          <div className="search-actions-warpper">
            <SearchBox
              name={isDrug ? "Thuốc" : "Sản phẩm"}
              params={params}
              updateParams={(paramsNew) => setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)}
              autoFocusSearch={true}
            />
            {listDrugByGroup.length > 0 && (
              <Button type="button" color="primary" className="btn-export" onClick={() => !isNoItem && !isLoading && setOnShowModalExport(true)}>
                Xuất file
              </Button>
            )}
          </div>
          {!isLoading && listDrugByGroup && listDrugByGroup.length > 0 ? (
            <BoxTable
              name={isDrug ? "Thuốc" : "Sản phẩm"}
              titles={titles}
              items={listDrugByGroup}
              dataFormat={dataFormat}
              isPagination={true}
              dataPagination={pagination}
              dataMappingArray={(item) => dataMappingArray(item)}
              striped={true}
            />
          ) : isLoading === true ? (
            <Loading />
          ) : (
            <Fragment>{isNoItem ? <SystemNotification type="no-item" /> : <SystemNotification type="no-result" />}</Fragment>
          )}
        </ModalBody>
      </Modal>
      <ExportModal
        name={isGroup ? `Nhóm ${data?.name}` : `Danh mục ${data?.name}`}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </Fragment>
  );
}
