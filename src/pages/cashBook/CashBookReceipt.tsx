import Badge from "components/badge/badge";
import BoxTable from "components/boxTable/boxTable";
import ExportModal from "components/exportModal/exportModal";
import Icon from "components/icon";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import SearchBox from "components/searchBox/searchBox";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import { ExportExcel } from "exports/excel";
import { ExportPdf } from "exports/pdf";
import TableDocDefinition from "exports/pdf/table";
import {
  CashBookData,
  CashBookReceiptData,
  ICashBookModelResponse,
} from "model/cashBook/response/cashBookModelResponse";
import { ICategory } from "model/drug/response/CategoryModelResponse";
import { IGroup } from "model/drug/response/GroupModelResponse";
import { IAction, IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import AddReceiptModal from "./partials/AddReceiptModal";
import ReceiptModalDetail from "./partials/ReceiptModalDetail";
import "./index.scss";
import CashBookService from "services/CashBookService";
import _ from "lodash";
import { SystemNotification } from "components/systemNotification/systemNotification";
import { ContextType, UserContext } from "contexts/userContext";

export default function CashBookReceipt({ isReciept = true }) {
  document.title = isReciept ? "Danh sách phiếu thu" : "Danh sách phiếu chi";
  const type = isReciept ? "PT" : "PC";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [listCashBook, setListCashBook] = useState([]);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);

  const [dataDetail, setDataDetail] = useState(null);
  const [onShowModalDetail, setOnShowModalDetail] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    // is_drug: isDrug,
  });

  const { name, drug_store } = useContext(UserContext) as ContextType;

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Sổ quỹ",
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

    const response = await CashBookService.getList(paramsSearch, abortController.signal, type);
    if (response.code === 200) {
      const result = response.result;
      setListCashBook(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (!isDifferenceObj(params, { query: "" }) && +result.total === 0) {
        // setIsNoItem(true);
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
  }, [params, showModalAdd]);
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: `Tất cả`,
      is_active: true,
    },
  ]);

  const titles = [
    isReciept ? "Mã phiếu thu" : "Mã phiếu chi",
    isReciept ? "Loại thu" : "Loại chi",
    "Người tạo",
    isReciept ? "Người nộp" : "Người nhận tiền",
    "Số điện thoại",
    "Số tiền",
    "Trạng thái",
    "Ngày tháng",
  ];

  const titleActions: ITitleActions = {
    actions: [
      {
        title: isReciept ? "Tạo phiếu thu" : "Tạo phiếu chi",
        callback: () => {
          setShowModalAdd(true);
        },
      },
    ],
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        callback: () => setOnShowModalExport(true),
      },
    ],
  };

  const dataFormat = ["", "", "", "", "text-right", "text-right", "text-center", ""];

  const dataMappingArray = (item: ICashBookModelResponse, type: string) => [
    item.code ?? "",
    item.cash_type_name ?? "",
    item.created_by_name ?? "",
    item.name ?? "",
    item.phone ?? "",
    formatCurrency(+item.amount ?? 0),
    ...(type !== "export"
      ? [
          <Badge
            key={`product-active-${item.id}`}
            text={item.status === "done" ? "Hoàn thành" : "Đã hủy"}
            variant={item.status === "done" ? "success" : "error"}
          />,
        ]
      : [item.status === "done" ? "Hoàn thành" : "Đã hủy"]),
    item.cash_date ?? "",
  ];

  useEffect(() => {
    setListCashBook(CashBookReceiptData);
    setPagination({
      ...pagination,
      page: 1,
      sizeLimit: 10,
      totalItem: CashBookReceiptData.length,
      totalPage: Math.ceil(CashBookReceiptData.length / 10),
    });
  }, []);

  const cashBookFilterList: IFilterItem[] = useMemo(
    () => [
      {
        key: "date",
        name: "Lọc theo ngày",
        type: "date-two",
        is_featured: true,
        list: [],
        value: searchParams.get("from_date") ?? "",
        value_extra: searchParams.get("to_date") ?? "",
      },
      {
        key: "type",
        name: "Loại thu",
        type: "select",
        is_featured: true,
        list: [],
        value: searchParams.get("type") ?? "",
      },
      {
        key: "status",
        name: "Trạng thái",
        type: "select",
        is_featured: true,
        list: [],
        value: searchParams.get("type") ?? "",
      },
      {
        key: "payment",
        name: "Phương thức thanh toán",
        type: "select",
        is_featured: true,
        list: [],
        value: searchParams.get("payment") ?? "",
        // params: { is_drug: isDrug },
      },
    ],
    [searchParams]
  );

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
        title: "In",
        icon: <Icon name="Print" />,
        callback: () => {
          // showDialogConfirmDelete(item);
        },
      },
    ];
  };

  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả ${isReciept ? "phiếu thu" : "phiếu chi"}`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} ${isReciept ? "phiếu thu" : "phiếu chi"} phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "" }),
      },
    ],
    [pagination, listIdChecked, params]
  );

  const exportCallback = useCallback(
    async (type, extension) => {
      let response = null;
      response = await CashBookService.export({
        ...params,
        type_export: type,
        ...(isReciept ? { type: "PT" } : { type: "PC" }),
      });
      if (response?.data) {
        if (extension === "excel") {
          ExportExcel({
            fileName: isReciept ? "DanhSachPhieuThu" : "DanhSachPhieuChi",
            title: isReciept ? `Danh sách phiếu thu` : `Danh sách phiếu chi`,
            header: titles,
            data: response?.data.map((item) => dataMappingArray(item, "export")),
            info: { name, drug_store },
          });
        } else {
          ExportPdf(
            TableDocDefinition({
              info: { name, drug_store },
              title: isReciept ? `Danh sách phiếu thu` : `Danh sách phiếu chi`,
              header: titles,
              items: response?.data.map((item) => dataMappingArray(item, "export")),
              mapFooter: undefined,
              customFooter: undefined,
              options: {
                smallTable: true,
              },
            }),
            isReciept ? "DanhSachPhieuThu" : "DanhSachPhieuChi"
          );
        }
        showToast("Xuất file thành công", "success");
        setOnShowModalExport(false);
      } else {
        showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
        setOnShowModalExport(false);
      }
    },
    [params]
  );
  return (
    <div className={`page-content page-category-group`}>
      <TitleAction title={`Danh sách phiếu ${isReciept ? "thu" : "chi"}`} titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={isReciept ? "Phiếu thu" : "Phiếu chi"}
          params={params}
          isFilter={true}
          listFilterItem={cashBookFilterList}
          isShowFilterList={true}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew)
              ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)
              : undefined
          }
        />
        {!isLoading && listCashBook && listCashBook.length > 0 ? (
          <BoxTable
            name={`Danh sách phiếu ${isReciept ? "thu" : "chi"}`}
            titles={titles}
            items={listCashBook}
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
          </Fragment>
        )}

        <AddReceiptModal
          onShow={showModalAdd}
          isReceipt={isReciept}
          onHide={() => setShowModalAdd(false)}
          type={type}
        />
        <ExportModal
          name={isReciept ? "Phiếu thu" : "Phiếu chi"}
          onShow={onShowModalExport}
          onHide={() => setOnShowModalExport(false)}
          options={optionsExport}
          callback={(type, extension) => exportCallback(type, extension)}
        />

        <ReceiptModalDetail
          isReceipt={isReciept}
          onShow={onShowModalDetail}
          data={dataDetail}
          toggle={() => setOnShowModalDetail(false)}
        />
      </div>
    </div>
  );
}

export function CashBookPayment() {
  return <CashBookReceipt isReciept={false} />;
}
