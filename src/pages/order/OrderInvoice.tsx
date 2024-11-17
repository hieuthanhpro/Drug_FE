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
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import "./OrderCreate.scss";
import CashBookService from "services/CashBookService";
import _ from "lodash";
import { SystemNotification } from "components/systemNotification/systemNotification";

export default function OrderInvoice({ isTemp = false }) {
  document.title = `Danh sách đơn đặt ${isTemp ? "lưu tạm" : "hàng"}`;
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

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Đơn đặt hàng",
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
    const response = await CashBookService.getList(paramsSearch, abortController.signal, "PT");
    if (response.ERR_CODE === "200") {
      const result = response.RESULT;
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
    "Mã đơn",
    "Ngày nhận hàng mong muốn",
    "Nhà cung cấp",
    "Người tạo",
    "Tiền hàng tạm tính",
    "Ngày đặt hàng",
    "Trạng thái",
    "",
  ];

  const titleActions: ITitleActions = {
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        callback: () => setOnShowModalExport(true),
      },
    ],
  };

  const dataFormat = ["", "", "", "", "text-right", "text-right", "text-center", ""];

  const dataMappingArray = (item: ICashBookModelResponse, index: number) => [
    item.code,
    item.cash_type_name,
    item.created_by_name,
    item.name,
    item.phone,
    formatCurrency(+item.amount),
    <Badge
      key={`product-active-${item.id}`}
      text={item.status === "done" ? "Hoàn thành" : "Đã hủy"}
      variant={item.status === "done" ? "success" : "error"}
    />,
    item.cash_date,
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
        key: "dateTo",
        name: "Ngày nhận hàng mong muốn",
        type: "date",
        is_featured: true,
        list: [],
        value: searchParams.get("date") ?? "",
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
        label: `Tất cả đơn hàng`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} đơn hàng phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "" }),
      },
    ],
    [pagination, listIdChecked, params]
  );

  const exportCallback = async (type, extension) => {
    if (extension === "excel") {
      ExportExcel({
        fileName: isTemp ? "DanhSachDonDatHangLuuTam" : "DanhSachDonDatHang",
        title: isTemp ? "Danh sách đơn đặt hàng lựu tạm" : "Danh sách đơn đặt hàng",
        header: titles,
        data: listCashBook.map((item, index) => dataMappingArray(item, index)),
        // info: { name, drug_store },
      });
    } else {
      ExportPdf(
        TableDocDefinition({
          info: {},
          title: isTemp ? "Danh sách đơn đặt hàng lưu tạm" : "Danh sách đơn đặt hàng",
          header: titles,
          items: listCashBook.map((item, index) => dataMappingArray(item, index)),
          mapFooter: undefined,
          customFooter: undefined,
          widths: [70],
          options: {
            smallTable: true,
          },
        }),
        isTemp ? "DanhSachDonDatHangLuuTam" : "DanhSachDonDatHang"
      );
    }
    showToast("Xuất file thành công", "success");
    setOnShowModalExport(false);
  };

  return (
    <div className={`page-content page-category-group`}>
      <TitleAction
        title={isTemp ? "Danh sách đơn đặt hàng lưu tạm" : "Danh sách đơn đặt hàng"}
        titleActions={titleActions}
      />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={isTemp ? "Đơn đặt hàng lưu tạm" : "Đơn đặt hàng"}
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
            name={isTemp ? "Danh sách đơn đặt hàng lưu tạm" : "Danh sách đơn đặt hàng"}
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

        <ExportModal
          name={isTemp ? "Danh sách đơn đặt hàng lưu tạm" : "Danh sách đơn đặt hàng"}
          onShow={onShowModalExport}
          onHide={() => setOnShowModalExport(false)}
          options={optionsExport}
          callback={(type, extension) => exportCallback(type, extension)}
        />
      </div>
    </div>
  );
}

export function OrderInvoiceTemp() {
  return <OrderInvoice isTemp={true} />;
}
