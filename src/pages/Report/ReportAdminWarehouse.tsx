import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import { IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
import BoxTable from "components/boxTable/boxTable";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import { IUser } from "model/user/response/UserResponseModel";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import moment from "moment";
import { IReportWarehouseSell } from "model/report/response/ReportResponseModel";
import Report from "services/Report";
import ExportModal from "components/exportModal/exportModal";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";

export default function ReportAdminWarehouse() {
  document.title = "Báo cáo xuất nhập tồn";
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Báo cáo xuất nhập tồn",
      is_active: true,
    },
  ]);

  const [reportWarehouseSellFilter] = useState<IFilterItem[]>([
    {
      key: "created_at",
      name: "Thời gian",
      type: "date-two",
      is_featured: true,
      list: [],
      value: searchParams.get("from_date") ?? "",
      value_extra: searchParams.get("to_date") ?? "",
    },
  ]);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Chi tiết nhập-bán hàng",
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
    response = await Report.filterAdminWarehouse(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setListInvoice(result.data);
      setPagination({
        ...pagination,
        page: +result.current_page,
        sizeLimit: +result.per_page,
        totalItem: +result.total,
        totalPage: +result.last_page,
      });
      if (!isDifferenceObj(params, { query: "", page: 1 }) && +result.total === 0) {
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
    actions_extra: [
      {
        title: "Xuất báo cáo xuất nhập tồn",
        icon: <Icon name="Upload" />,
        // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
        callback: () => !isLoading && setOnShowModalExport(true),
      },
    ],
  };

  const titles = useMemo(
    () => ([
      "Mã thuốc",
      "Tên thuốc",
      "Số lô",
      "Hạn dùng",
      "Đơn vị tính",
      ["Tồn đầu kỳ","Số lượng", "Đơn giá", "Tổng giá trị"] ,
      ["Nhập trong kỳ","Số lượng", "Đơn giá", "Tổng giá trị"],
      ["Xuất trong kỳ","Số lượng", "Đơn giá", "Tổng giá trị"],
      ["Tồn cuối kỳ","Số lượng", "Đơn giá", "Tổng giá trị"],
    ]),
    []
  );

  const dataMappingArray = useCallback(
    (item) => [
      item.medicationCode,
      item.medicationName,
      item.batchNumber,
      item.expirationDate,
      item.unit,
      item.beginningInventory.quantity,
      item.beginningInventory.unitPrice,
      item.beginningInventory.totalValue,
      item.incoming.quantity,
      item.incoming.unitPrice,
      item.incoming.totalValue,
      item.outgoing.quantity,
      item.outgoing.unitPrice,
      item.outgoing.totalValue,
      item.endingInventory.quantity,
      item.endingInventory.unitPrice,
      item.endingInventory.totalValue,
    ],
    [params?.report_by]
  );

  //EXPORT
  const [onShowModalExport, setOnShowModalExport] = useState<boolean>(false);
  const optionsExport: IOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả hóa đơn `,
      },
      {
        value: "current_page",
        label: "Trên trang này",
        disabled: pagination.totalItem === 0,
      },
      {
        value: "current_search",
        label: `${pagination.totalItem} hóa đơn  phù hợp với kết quả tìm kiếm hiện tại`,
        disabled: pagination.totalItem === 0 || !isDifferenceObj(params, { query: "", type: "export" }),
      },
    ],
    [pagination, params]
  );
  const exportCallback = async (type, extension) => {
    const response = await Report.exportGoodsInOut({ ...params, type_export: type });
    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: "Baocaonhapton",
          title: "Báo cáo xuất nhập tồn",
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item)),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: "Báo cáo xuất nhập tồn",
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item)),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
              pageOrientation: "landscape",
            },
          }),
          "Baocaonhapton"
        );
      }
      showToast("Xuất file thành công", "success");
      setOnShowModalExport(false);
    } else {
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
      setOnShowModalExport(false);
    }
  };

  const dataFormat = [
    "",
    "",
    "",
    "",
    "text-center",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-center",
    "text-center",
    "",
  ];
  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title="Báo cáo xuất nhập tồn" titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name="Doanh số"
          placeholderSearch="Tìm kiếm theo tên thuốc, mã thuốc, số lô"
          params={params}
          // isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={reportWarehouseSellFilter}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew) ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew) : undefined
          }
        />
        <BoxTable
          name={"Doanh thu-lợi nhuận"}
          titles={titles}
          items={[
            {
              medicationCode: "MT001",
              medicationName: "Paracetamol",
              batchNumber: "SL1234",
              expirationDate: "2025-06-30",
              unit: "Viên",
              beginningInventory: {
                quantity: 1000,
                unitPrice: 500,
                totalValue: 500000
              },
              incoming: {
                quantity: 500,
                unitPrice: 550,
                totalValue: 275000
              },
              outgoing: {
                quantity: 300,
                unitPrice: 550,
                totalValue: 165000
              },
              endingInventory: {
                quantity: 1200,
                unitPrice: 500,
                totalValue: 600000
              }
            },
            {
              medicationCode: "MT002",
              medicationName: "Ibuprofen",
              batchNumber: "SL5678",
              expirationDate: "2024-12-31",
              unit: "Viên",
              beginningInventory: {
                quantity: 800,
                unitPrice: 700,
                totalValue: 560000
              },
              incoming: {
                quantity: 300,
                unitPrice: 720,
                totalValue: 216000
              },
              outgoing: {
                quantity: 400,
                unitPrice: 720,
                totalValue: 288000
              },
              endingInventory: {
                quantity: 700,
                unitPrice: 700,
                totalValue: 490000
              }
            },
            {
              medicationCode: "MT003",
              medicationName: "Amoxicillin",
              batchNumber: "SL9101",
              expirationDate: "2024-11-30",
              unit: "Viên",
              beginningInventory: {
                quantity: 600,
                unitPrice: 1000,
                totalValue: 600000
              },
              incoming: {
                quantity: 200,
                unitPrice: 1050,
                totalValue: 210000
              },
              outgoing: {
                quantity: 250,
                unitPrice: 1050,
                totalValue: 262500
              },
              endingInventory: {
                quantity: 550,
                unitPrice: 1000,
                totalValue: 550000
              }
            }
          ]}
          dataFormat={dataFormat}
          isPagination={true}
          dataPagination={pagination}
          dataMappingArray={(item) => dataMappingArray(item)}
          isBulkAction={true}
          striped={true}
        />
      </div>
      <ExportModal
        name={"Thống kê doanh thu"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </div>
  );
}
