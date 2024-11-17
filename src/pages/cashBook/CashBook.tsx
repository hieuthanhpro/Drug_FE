import BoxTable from "components/boxTable/boxTable";
import Icon from "components/icon";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import _ from "lodash";
import { CashBookData, ICashBookModelResponse } from "model/cashBook/response/cashBookModelResponse";
import { IFilterItem, ISaveSearch } from "model/OtherModel";
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CashBookService from "services/CashBookService";
import { convertParamsToString, formatCurrency, isDifferenceObj, showToast } from "utils/common";
import AddReceiptModal from "./partials/AddReceiptModal";
import { CashbookTypes, PaymentMethods } from "model/invoice/DataModelInitial";
import ExportModal from "components/exportModal/exportModal";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";

export default function CashBook() {
  document.title = "Sổ quỹ";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [listCashBook, setListCashBook] = useState([]);
  const [listIdChecked, setListIdChecked] = useState<number[]>([]);
  const [showModalExport,setOnShowModalExport]=useState<boolean>(false)
  const [page, setPage] = useState<number>(1);

  const [totalOpeningBalance, setTotalOpeningBalance] = useState(64400379);

  const [searchParams, setSearchParams] = useSearchParams();


  const { name, drug_store } = useContext(UserContext) as ContextType;
  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
    // is_drug: isDrug,
  });

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
    const response = await CashBookService.getList(paramsSearch, abortController.signal);
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
  }, [params]);

  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: `Tất cả`,
      is_active: true,
    },
  ]);

  const titles = [
    "Ngày tháng ghi sổ",
    "Ngày tháng chứng từ",
    "Số hiệu chứng từ thu",
    "Số hiệu chứng từ chi",
    "Diễn giải",
    "Số tiền thu",
    "Số tiền chi",
    "Số tiền tồn",
    "Ghi chú",
  ];

  const titleActions: ITitleActions = {
    actions: [
      {
        title: "Tạo phiếu chi",
        callback: () => {
          setShowModalAdd(true);
        },
      },
      {
        title: "Tạo phiếu thu",
        callback: () => {
          setShowModalAdd(true);
        },
      },
    ],
    actions_extra: [
      {
        title: "Xuất danh sách",
        icon: <Icon name="Download" />,
        // callback: () => !isNoItem && !isLoading && listCategoryGroup.length > 0 && setOnShowModalExport(true),
        callback: () => !isLoading && setOnShowModalExport(true),
      },
    ],
  };

  const dataFormat = ["", "", "", "", "", "text-right", "text-right", "text-right", ""];

  const handleSetTotalOpeningBalance = (totalOpeningBalance, amount, type) => {
    let newTotal;
    if (type === "thu") {
      newTotal = totalOpeningBalance + parseInt(amount);
    } else {
      newTotal = totalOpeningBalance - parseInt(amount);
    }
    setTotalOpeningBalance(newTotal);
    return formatCurrency(newTotal);
  };

  const formatDate = (datetime) => {
    return datetime.split(" ")[0].split("-");
  };

  const dataMappingArray = (item: ICashBookModelResponse, index: number) => [
    formatDate(item.created_at)[2] + "/" + formatDate(item.created_at)[1] + "/" + formatDate(item.created_at)[0],
    formatDate(item.cash_date)[2] + "/" + formatDate(item.cash_date)[1] + "/" + formatDate(item.cash_date)[0],
    item.cash_type_type === "pay_slip" ? null : item.code,
    item.cash_type_type === "pay_slip" ? item.code : null,
    item.cash_type_name + "-" + item.reason,
    item.cash_type_type === "receipt" ? formatCurrency(parseInt(item.amount)) : "",
    item.cash_type_type === "pay_slip" ? formatCurrency(parseInt(item.amount)) : "",
    item.cash_type_type === "pay_slip"
      ? handleSetTotalOpeningBalance(totalOpeningBalance, item.amount, "thu")
      : handleSetTotalOpeningBalance(totalOpeningBalance, item.amount, "chi"),
    "",
  ];

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
        name: "Loại phiếu",
        type: "select",
        is_featured: true,
        list:CashbookTypes,
        value: searchParams.get("type") ?? ""
      },
      {
        key: "payment",
        name: "Phương thức thanh toán",
        type: "select",
        is_featured: true,
        list:PaymentMethods,
        value: searchParams.get("payment") ?? "",
      },
    ],
    [searchParams]
  );

  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả phiếu thu và chi`,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_select",
        label: `Các phiếu thu và chi được chọn`,
        disabled: listIdChecked.length === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} phiếu thu và chi phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: ""}),
      },
    ],
    [pagination, listIdChecked, params]
  );

  const getTotalReceiptCol = (type) => {
    let totalReceipt = 0;
    let totalPaySlip = 0;
    listCashBook.map((item, i) => {
      if (item.cash_type_type === "receipt") {
        totalReceipt += +item.amount;
      } else {
        totalPaySlip += +item.amount;
      }
    });

    if (type === "receipt") {
      return formatCurrency(totalReceipt);
    } else {
      return formatCurrency(totalPaySlip);
    }
  };

  const headerListRow = [
    [null, null, null, null, "Số dư đầu kì", null, null, formatCurrency(totalOpeningBalance), null],
    [null, null, null, null, "Số dư phát sinh", null, null, null, null],
  ];
  const bottomListRow = [
    [
      null,
      null,
      null,
      null,
      "Cộng phát sinh",
      getTotalReceiptCol("receipt"),
      getTotalReceiptCol("payslip"),
      formatCurrency(totalOpeningBalance),
      null,
    ],
    [null, null, null, null, "Số dư cuối kì", null, null, formatCurrency(totalOpeningBalance), null],
  ];


  useEffect(() => {
    setListCashBook(CashBookData);
    setPagination({
      ...pagination,
      page: 1,
      sizeLimit: 10,
      totalItem: CashBookData.length,
      totalPage: Math.ceil(CashBookData.length / 10),
    });
  }, []);


  const exportCallback = useCallback(
    async (type, extension) => {
      let response = null;
      response = await CashBookService.export({
        ...params,
        type_export: type,
        
      });
      if (response?.data) {
        if (extension === "excel") {
          ExportExcel({
            fileName: "Sổ Quỹ",
            title: "Sổ Quỹ",
            header: titles,
            data: response?.data.map((item) => dataMappingArray(item, "export")),
            info: { name, drug_store },
          });
        } else {
          ExportPdf(
            TableDocDefinition({
              info: { name, drug_store },
              title: "Sổ Quỹ",
              header: titles,
              items: response?.data.map((item) => dataMappingArray(item, "export")),
              mapFooter: undefined,
              customFooter: undefined,
              options: {
                smallTable: true,
              },
            }),
           "Sổ Quỹ"
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
      <TitleAction title={"Tổng quan sổ quỹ"} titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name={"Sổ quỹ"}
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
            name={"Tổng quan sổ quỹ"}
            titles={titles}
            items={listCashBook}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item, index) => dataMappingArray(item, index)}
            listIdChecked={listIdChecked}
            striped={true}
            setListIdChecked={(listId) => setListIdChecked(listId)}
            // actions={actionsTable}
            // actionType="inline"
            headerRow={headerListRow}
            bottomRow={bottomListRow}
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
      </div>

      <ExportModal
          name="Sổ Quỹ" 
          onShow={showModalExport}
          onHide={() => setOnShowModalExport(false)}
          options={optionsExport}
          callback={(type, extension) => exportCallback(type, extension)}
        />
      
      <AddReceiptModal 
        onHide={()=>{
          setShowModalAdd(false)
        }
        }
        onShow={showModalAdd}
        
      />

    </div>
  );
}
