import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import BoxTable from "components/boxTable/boxTable";
import { isDifferenceObj, showToast } from "utils/common";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import CategoryService from "services/CategoryService";
import GroupService from "services/GroupService";
import { IAction, IOption, ISaveSearch } from "model/OtherModel";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useSearchParams } from "react-router-dom";
import { ICategory } from "model/drug/response/CategoryModelResponse";
import { IGroup } from "model/drug/response/GroupModelResponse";
import AddGroupModal from "./partials/AddGroupModal";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import _ from "lodash";
import DrugGroupDetailModal from "./partials/DrugGroupDetailModal";
import ExportModal from "components/exportModal/exportModal";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";

export default function DrugGroupList({ isDrug = true, isGroup = true }) {
  document.title = isGroup ? `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}` : `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`;
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  const [listCategoryGroup, setListCategoryGroup] = useState<ICategory[] | IGroup[]>([]);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IGroup | ICategory>(null);
  const [onShowModalDetail, setOnShowModalDetail] = useState<boolean>(false);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: `Tất cả ${isGroup ? "nhóm" : "danh mục"}`,
      is_active: true,
    },
  ]);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: "",
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
      setParams((prevParams) => ({ ...prevParams, limit: limit }));
    },
  });


  const abortController = new AbortController();
  const getListCategoryGroup = async (paramsSearch) => {
    setIsLoading(true);
    let response = null;
    if (isGroup) {
      response = await GroupService.filter(paramsSearch, abortController.signal);
    } else {
      response = await CategoryService.filter(paramsSearch, abortController.signal);
    }
    if (response.code === 200) {
      const result = response.result;
      setListCategoryGroup(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (+result.total === 0 && params.query === "" && +params.page === 1) {
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
      getListCategoryGroup(params);
      const paramsTemp = _.cloneDeep(params);
      delete paramsTemp["is_drug"];
      if (paramsTemp.limit === 10) {
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
        title: isGroup ? "Thêm nhóm mới" : "Thêm danh mục mới",
        callback: () => {
          setDataEdit(null);
          setShowModalAdd(true);
        },
      },
    ],
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        callback: () => !isNoItem && !isLoading && listCategoryGroup.length > 0 && setOnShowModalExport(true),
      },
    ],
  };

  const titles = [
    "STT",
    isGroup ? `Tên nhóm ${isDrug ? "thuốc" : "sản phẩm"}` : `Tên danh mục ${isDrug ? "thuốc" : "sản phẩm"}`,
    isDrug ? "Số loại thuốc" : "Số loại sản phẩm",
  ];

  const dataMappingArray = (item: ICategory | IGroup, index: number) => [index + 1, item.name, item.total_drug];

  const dataFormat = ["text-center image", "", "text-right"];

  const actionsTable = (item: IGroup | ICategory): IAction[] => {
    return [
      {
        title: "Xem chi tiết",
        icon: <Icon name="Eye" />,
        callback: () => {
          setDataDetail(item);
          setOnShowModalDetail(true);
        },
      },
      {
        title: "Sửa",
        icon: <Icon name="Pencil" />,
        callback: () => {
          setDataEdit(item);
          setShowModalAdd(true);
        },
      },
      {
        title: "Xóa",
        icon: <Icon name="Trash" className="icon-error" />,
        callback: () => {
          showDialogConfirmDelete(item);
        },
      },
    ];
  };

  const onDelete = async (id: number) => {
    let response = null;
    if (isGroup) {
      response = await GroupService.delete(id).then((res) => {
        return res;
      });
    } else {
      response = await CategoryService.delete(id).then((res) => {
        return res;
      });
    }
    if (response.code === 200) {
      showToast(`Xóa ${isGroup ? "nhóm" : "danh mục"} ${isDrug ? "thuốc" : "sản phẩm"} thành công`, "success");
      getListCategoryGroup(params);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setShowDialog(false);
    setContentDialog(null);
  };

  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [dataEdit, setDataEdit] = useState<ICategory | IGroup>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<any>(null);

  const showDialogConfirmDelete = (item: ICategory | IGroup) => {
    const contentDialog: IContentDialog = {
      color: "error",
      className: "dialog-delete",
      isCentered: true,
      isLoading: true,
      title: (
        <Fragment>
          Xóa {isGroup ? "nhóm" : "danh mục"} {isDrug ? "thuốc" : "sản phẩm"}
        </Fragment>
      ),
      message: (
        <Fragment>
          Bạn có chắc chắn muốn xóa bỏ {isGroup ? "nhóm" : "danh mục"} {isDrug ? "thuốc " : "sản phẩm "}
          <strong>{item.name}</strong>? Thao tác này không thể khôi phục.
        </Fragment>
      ),
      cancelText: "Hủy",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xóa",
      defaultAction: () => onDelete(item.id),
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  //Export
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả ${isGroup ? "nhóm" : "danh mục"}`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} ${isGroup ? "nhóm" : "danh mục"} phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", is_drug: isDrug }),
      },
    ],
    [isDrug, pagination, listIdChecked, params]
  );

  const exportCallback = async (type, extension) => {
    let response = null;
    if (isGroup) {
      response = await GroupService.export({ ...params, type_export: type });
    } else {
      response = await CategoryService.export({ ...params, type_export: type });
    }
    if (response) {
      if (response.result?.data) {
        if (extension === "excel") {
          ExportExcel({
            fileName: isGroup ? "DanhSachNhom" : "DanhSachDanhMuc",
            title: isGroup
              ? `Danh sách nhóm ${isDrug ? "thuốc" : "sản phẩm"}`
              : `Danh sách danh mục ${isDrug ? "thuốc" : "sản phẩm"}`,
            header: titles,
            data: response?.result?.data.map((item, index) => dataMappingArray(item, index)),
            info: { name, drug_store },
          });
        } else {
          ExportPdf(
            TableDocDefinition({
              info: { name, drug_store },
              title: isGroup
                ? `Danh sách nhóm ${isDrug ? "thuốc" : "sản phẩm"}`
                : `Danh sách danh mục ${isDrug ? "thuốc" : "sản phẩm"}`,
              header: titles,
              items: response?.result?.data.map((item, index) => dataMappingArray(item, index)),
              mapFooter: undefined,
              customFooter: undefined,
              widths: [70],
              options: {
                smallTable: true,
              },
            }),
            isGroup ? `DanhSachNhom${isDrug ? "Thuoc" : "SanPham"}` : `DanhSachDanhMuc${isDrug ? "Thuoc" : "SanPham"}`
          );
        }
        showToast("Xuất file thành công", "success");
        setOnShowModalExport(false);
      } else {
        showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
        setOnShowModalExport(false);
      }
    }
  };

  return (
    <div className={`page-content page-category-group${isNoItem ? " bg-white" : ""}`}>
      <TitleAction
        title={isGroup ? `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}` : `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`}
        titleActions={titleActions}
      />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={isGroup ? `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}` : `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`}
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          updateParams={(paramsNew) => setParams(paramsNew)}
        />
        {!isLoading && listCategoryGroup && listCategoryGroup.length > 0 ? (
          <BoxTable
            name={isGroup ? `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}` : `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`}
            titles={titles}
            items={listCategoryGroup}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item, index) => dataMappingArray(item, index)}
            listIdChecked={listIdChecked}
            striped={true}
            setListIdChecked={(listId) => setListIdChecked(listId)}
            actions={actionsTable}
            actionType="inline"
          />
        ) : isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {isNoItem ? (
              <SystemNotification
                description={
                  <span>
                    Hiện tại nhà thuốc chưa có {isGroup ? "nhóm" : "danh mục"} {isDrug ? "thuốc" : "sản phẩm"} nào.{" "}
                    <br />
                    Hãy thêm mới sản phẩm đầu tiên nhé!
                  </span>
                }
                type="no-item"
                titleButton={`Thêm ${isGroup ? "nhóm" : "danh mục"} mới`}
                action={() => {
                  setDataEdit(null);
                  setShowModalAdd(true);
                }}
              />
            ) : (
              <SystemNotification
                description={
                  <span>
                    Không có dữ liệu trùng khớp.
                    <br />
                    Bạn hãy thay đổi tiêu chí lọc hoặc tìm kiếm nhé!
                  </span>
                }
                type="no-result"
              />
            )}
          </Fragment>
        )}
      </div>
      <AddGroupModal
        isDrug={isDrug}
        isGroup={isGroup}
        onShow={showModalAdd}
        data={dataEdit}
        onHide={(reload) => {
          if (reload) {
            getListCategoryGroup(params);
          }
          setShowModalAdd(false);
        }}
      />
      <DrugGroupDetailModal
        data={dataDetail}
        onShow={onShowModalDetail}
        isDrug={isDrug}
        isGroup={isGroup}
        onHide={() => setOnShowModalDetail(false)}
      />
      <ExportModal
        name={isGroup ? "Nhóm" : "Danh mục"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
      <Dialog content={contentDialog} isOpen={showDialog} />
    </div>
  );
}

export function DrugCategoryList() {
  return <DrugGroupList isDrug={true} isGroup={false} />;
}

export function ProductGroupList() {
  return <DrugGroupList isDrug={false} isGroup={true} />;
}

export function ProductCategoryList() {
  return <DrugGroupList isDrug={false} isGroup={false} />;
}
