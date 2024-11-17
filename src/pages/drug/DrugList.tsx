import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import { IDrug } from "model/drug/response/DrugModelResponse";
import Icon from "components/icon";
import BoxTable from "components/boxTable/boxTable";
import { BulkActionItemModel } from "components/bulkAction/bulkAction";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Badge from "components/badge/badge";
import Loading from "components/loading";
import DrugService from "services/DrugService";
import { IAction, IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import AddDrugModal from "./partials/AddDrugModal";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import { sortDrugList } from "model/drug/DataModelInitial";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import ExportModal from "components/exportModal/exportModal";
import { ExportPdf } from "exports/pdf";
import TableDocDefinition from "exports/pdf/table";
import DrugDetailModal from "./partials/DrugDetailModal";
import "./DrugList.scss";
import ImportModal from "components/importModal/importModal";
import { handleFileChange } from "imports/excel";


export default function DrugList({ isDrug = true }) {
  document.title = isDrug ? "Danh sách thuốc" : "Danh sách sản phẩm";
  const inputRef=useRef(null)
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  const [listDrug, setListDrug] = useState<IDrug[]>([]);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: `Tất cả ${isDrug ? "thuốc" : "sản phẩm"}`,
      is_active: true,
    },
  ]);

  const drugFilterList: IFilterItem[] = useMemo(
    () => [
      {
        key: "active",
        name: "Trạng thái",
        type: "radio",
        list: [
          {
            value: "yes",
            label: "Đang kinh doanh",
          },
          {
            value: "no",
            label: "Ngừng kinh doanh",
          },
        ],
        value: searchParams.get("active") ?? "",
      },
      {
        key: "group",
        name: "Nhóm",
        type: "select",
        is_featured: true,
        list: [],
        value: searchParams.get("group") ?? "",
        params: { is_drug: isDrug },
      },
      {
        key: "category",
        name: "Danh mục",
        type: "select",
        is_featured: true,
        list: [],
        value: searchParams.get("category") ?? "",
        params: { is_drug: isDrug },
      },
    ],
    [searchParams, isDrug]
  );

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    is_drug: isDrug,
  });


  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: isDrug ? "Sản phẩm" : "Thuốc",
    isChooseSizeLimit: true,
    setPage: (page) => {
      setParams((prevParams) => ({ ...prevParams, page: page }));
    },
    chooseSizeLimit: (limit) => {
      setParams((prevParams) => ({ ...prevParams, ...(limit > 10 ? { limit: limit } : {}), page: 1 }));
    },
  });
  const abortController = new AbortController();
  const getListDrug = async (paramsSearch) => {
    setIsLoading(true);
    const response = await DrugService.filter(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setListDrug(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (!isDifferenceObj(params, { query: "", is_drug: isDrug }) && +result.total === 0) {
        setIsNoItem(true);
      }
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const paramsTemp = _.cloneDeep(params);
    searchParams.forEach(async (key, value) => {
      paramsTemp[value] = key;
    });
    setParams((prevParams) => ({ ...prevParams, ...paramsTemp }));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isMounted.current === true) {
      getListDrug(params);
      const paramsTemp = _.cloneDeep(params);
      delete paramsTemp["is_drug"];
      if (parseInt(paramsTemp.limit) === 10) {
        delete paramsTemp["limit"];
      }
      Object.keys(paramsTemp).map(function (key) {
        paramsTemp[key] === "" ? delete paramsTemp[key] : null;
      });
      if (isDifferenceObj(searchParams, paramsTemp)) {
        if (parseInt(paramsTemp.page) === 1) {
          delete paramsTemp["page"];
        }
        setSearchParams(paramsTemp);
      }
    }
    return () => {
      abortController.abort();
    };
  }, [params]);


  const titleActions: ITitleActions = {
    actions: [
      {
        title: isDrug ? "Thêm thuốc mới" : "Thêm sản phẩm mới",
        callback: () => {
          setIdEdit(null);
          setShowModalAdd(true);
        },
      },
    ],
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        callback: () => !isNoItem && !isLoading && listDrug.length > 0 && setOnShowModalExport(true),
      },
      {
        title: "Nhập danh sách",
        icon: <Icon name="Upload" />,
        callback: () => !isLoading && setShowModalImport(true),
        element:<label className='import-action'><Icon name="Upload" />Nhập danh sách <input type="file" accept=".xlsx, .xls" ref={inputRef} onChange={(e)=>handleFileChange(e,setShowModalImport,setImportData)} /></label>
      },
    ],
  };

  const titles = (type?: string) => [
    ...(type !== "export" ? [""] : []),
    isDrug ? "Tên thuốc" : "Tên sản phẩm",
    "Mã thuốc",
    "Mã vạch",
    "Giá bán",
    "Tồn kho",
    "Đơn vị tính",
    "Trạng thái",
  ];

  const dataMappingArray = (item: IDrug, type?: string) => [
    ...(type !== "export"
      ? [
          <div className="aspect-ratio aspect-ratio--square-50" key={`product-image-${item.id}`}>
            {item.image ? <img src={item.image} alt={item.name} /> : <Icon name="NoImage" />}
          </div>,
        ]
      : []),
    item.name,
    item.drug_code,
    item.barcode,
    formatCurrency(+item.current_cost, ","),
    item.quantity,
    item.unit_name,
    ...(type !== "export"
      ? [
          <Badge
            key={`product-active-${item.id}`}
            text={item.active === "yes" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
            variant={item.active === "yes" ? "success" : "warning"}
          />,
        ]
      : [item.active === "yes" ? "Đang kinh doanh" : "Ngừng kinh doanh"]),
  ];

  const dataFormat = ["image", "", "", "", "text-right", "text-center", "text-center", "text-center"];

  const actionsTable = (item: IDrug): IAction[] => [
    {
      title: "Xem chi tiết",
      icon: <Icon name="Eye" />,
      callback: () => {
        setDataDetail(item);
        setShowModalDetail(true);
      },
    },
    {
      title: "Chỉnh sửa thông tin",
      icon: <Icon name="Pencil" />,
      callback: () => {
        setIdEdit(item.id);
        setShowModalAdd(true);
      },
    },
    {
      title: item.active === "yes" ? "Ngừng kinh doanh" : "Kinh doanh",
      icon:
        item.active === "yes" ? (
          <Icon name="WarningCircle" className="icon-warning" />
        ) : (
          <Icon name="CheckedCircle" className="icon-success" />
        ),
      callback: () => {
        showDialogConfirmStopBusiness(item);
      },
    },
    ...(item.active === "no"
      ? [
          {
            title: isDrug ? "Xoá thuốc" : "Xóa sản phẩm",
            icon: <Icon name="Trash" className="icon-error" />,
            callback: () => {
              showDialogConfirmStopBusiness(item, "delete");
            },
          },
        ]
      : []),
  ];

  const bulkActionList: BulkActionItemModel[] = [
    {
      title: "Ngừng kinh doanh",
      callback: () => showDialogConfirmStopBusiness(null, "stop"),
    },
    {
      title: "Tiếp tục kinh doanh",
      callback: () => showDialogConfirmStopBusiness(null, "start"),
    },
  ];

  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<any>(null);

  const showDialogConfirmStopBusiness = (item?: IDrug, type?: "start" | "stop" | "delete") => {
    const contentDialog: IContentDialog = {
      color:
        item && type === "delete" ? "error" : (!item && type === "stop") || item?.active === "yes" ? "warning" : null,
      className:
        item && type === "delete"
          ? "dialog-delete"
          : (!item && type === "stop") || item?.active === "yes"
          ? "dialog-stop-business"
          : "dialog-start-business",
      isCentered: true,
      isLoading: true,
      title: (
        <Fragment>
          {item && type === "delete"
            ? "Xóa"
            : (!item && type === "stop") || item?.active === "yes"
            ? "Ngừng kinh doanh"
            : "Kinh doanh"}
          {isDrug ? " thuốc " : " sản phẩm "}
        </Fragment>
      ),
      message: (
        <Fragment>
          Bạn có chắc chắn muốn
          {item && type === "delete"
            ? " xóa"
            : (!item && type === "stop") || item?.active === "yes"
            ? " ngừng kinh doanh"
            : " kinh doanh"}
          {!item ? " những " : " "}
          {isDrug ? "thuốc " : "sản phẩm "}
          {!item ? " đã được chọn" : <strong>{item.name}</strong>}?{" "}
          {item && type === "delete" ? "Thao tác này không thể khôi phục." : ""}
        </Fragment>
      ),
      cancelText: "Hủy",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => {
        if (type === "delete") {
          onDelete(item.id);
        } else {
          onBusinessSubmit(item ? [item.id] : listIdChecked, item ? (item.active === "yes" ? "stop" : "start") : type);
        }
      },
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  const onBusinessSubmit = async (ids: number[], type: string) => {
    const response = await DrugService.business(ids, type).then((res) => {
      return res;
    });
    if (response.code === 200) {
      showToast(
        `${type === "stop" ? "Ngừng kinh doanh" : "Kinh doanh"} ${isDrug ? "thuốc" : "sản phẩm"} thành công`,
        "success"
      );
      setListIdChecked([]);
      getListDrug(params);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setShowDialog(false);
    setContentDialog(null);
  };

  const onDelete = async (id: number) => {
    const response = await DrugService.delete(id).then((res) => {
      return res;
    });
    if (response.code === 200) {
      showToast(`Xóa ${isDrug ? "thuốc" : "sản phẩm"} thành công`, "success");
      getListDrug(params);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setShowDialog(false);
    setContentDialog(null);
  };

  // Detail
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IDrug>(null);

  //Export
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả ${isDrug ? "thuốc" : "sản phẩm"}`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_select",
        label: `Các ${isDrug ? "thuốc" : "sản phẩm"} được chọn`,
        disabled: listIdChecked.length === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} ${isDrug ? "thuốc" : "sản phẩm"} phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", is_drug: isDrug }),
      },
    ],
    [isDrug, pagination, listIdChecked, params]
  );

  const exportCallback = async (type, extension) => {
    const response = await DrugService.export({
      ...params,
      type_export: type,
      ...(type === "current_select" ? { ids: listIdChecked } : {}),
    });
    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: isDrug ? "DanhSachThuoc" : "DanhSachSanPham",
          title: isDrug ? "Danh sách thuốc" : "Danh sách sản phẩm",
          header: titles("export"),
          data: response?.result?.data.map((item) => dataMappingArray(item, "export")),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: isDrug ? "Danh sách thuốc" : "Danh sách sản phẩm",
            header: titles("export"),
            items: response?.result?.data.map((item) => dataMappingArray(item, "export")),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
            },
          }),
          isDrug ? "DanhSachThuoc" : "DanhSachSanPham"
        );
      }
      showToast("Xuất file thành công", "success");
      setOnShowModalExport(false);
    } else {
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
      setOnShowModalExport(false);
    }
  };

  //Import 
  const [showModalImport, setShowModalImport] = useState<boolean>(false);
  const [importData,setImportData]=useState<[]>([])

  const onHideModalImport = ()=>{
     setShowModalImport(false)
     inputRef.current.value = "";
     setImportData([])
  }


  return (
    <div className={`page-content page-drug${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title={isDrug ? "Thuốc" : "Sản phẩm"} titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={isDrug ? "Thuốc" : "Sản phẩm"}
          params={params}
          isFilter={true}
          listFilterItem={drugFilterList}
          isShowFilterList={true}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isSort={true}
          listSort={sortDrugList}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew)
              ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)
              : undefined
          }
        />
        {!isLoading && listDrug && listDrug.length > 0 ? (
          <BoxTable
            name={isDrug ? "Thuốc" : "Sản phẩm"}
            titles={titles()}
            items={listDrug}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            bulkActionItems={bulkActionList}
            listIdChecked={listIdChecked}
            setListIdChecked={(listId) => setListIdChecked(listId)}
            actions={actionsTable}
            actionType="inline"
            striped={true}
          />
        ) : isLoading === true ? (
          <Loading />
        ) : (
          <Fragment>
            {isNoItem ? <SystemNotification type="no-item" /> : <SystemNotification type="no-result" />}
          </Fragment>
        )}
      </div>
      <AddDrugModal
        isDrug={isDrug}
        onShow={showModalAdd}
        id={idEdit}
        onHide={(reload) => {
          if (reload) {
            getListDrug(params);
          }
          setShowModalAdd(false);
        }}
      />
      <ExportModal
        name={isDrug ? "Thuốc" : "Sản phẩm"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
      <ImportModal
        isDrug={isDrug}
        titles={titles}
        listDrugImport={importData}
        dataFormat={dataFormat}
        dataMappingArray={dataMappingArray}
        name={isDrug ? "Thuốc" : "Sản phẩm"}
        onShow={showModalImport}
        onHide={onHideModalImport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
      <DrugDetailModal
        data={dataDetail}
        onShow={showModalDetail}
        onHide={(id) => {
          setShowModalDetail(false);
          console.log(id);
          if (id) {
            setIdEdit(id);
            setShowModalAdd(true);
          }
        }}
        isDrug={isDrug}
      />
      <Dialog content={contentDialog} isOpen={showDialog} />
    </div>
  );
}

export function ProductList() {
  return <DrugList isDrug={false} />;
}
