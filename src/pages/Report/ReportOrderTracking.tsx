import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import Icon from "components/icon";
import { IAction, IFilterItem, IOption, ISaveSearch } from "model/OtherModel";
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
import { IGroup } from "src/model/drug/response/GroupModelResponse";
import { ICategory } from "src/model/drug/response/CategoryModelResponse";
import { CashBookReceiptData } from "model/cashBook/response/cashBookModelResponse";

export default function ReportOrderTracking() {
  document.title = "Theo dõi bán theo đơn";
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Danh sách Nhập - bán hàng",
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
  const actionsTable = (item: IGroup | ICategory): IAction[] => {
    return [
      {
        title: "Xem chi tiết",
        icon: <Icon name="Eye" />,
        callback: () => {
        },
      },
    ];
  };
  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Theo dõi bán theo đơn",
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
    response = await Report.filterWarehouseSell(paramsSearch, abortController.signal);
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
        title: "Xuất phiếu nhập-bán hàng",
        icon: <Icon name="Upload" />,
        // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
        callback: () => !isLoading&& setOnShowModalExport(true),
      },
    ],
  };

  const titles = useMemo(
    () => [
      "Hóa đơn bán hàng",
      "Ngày",
      "Tên bác sĩ kê đơn",
      "Tên bệnh nhân",
      "Tên thuốc",
      "Số lượng",
      "Đơn vị",
      "Ghi chú"
  ],
    []
  );

  const dataMappingArray = useCallback(
    (item) => [
      item.invoiceNumber,
      item.date,
      item.prescribingDoctor,
      item.patientName,
      item.medicationName,
      item.quantity,
      item.unit,
      item.notes
    ],
    []
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
          fileName: "Thongkenhaphangbanhang",
          title: "Danh sách nhập hàng - bán hàng",
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item)),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: "Danh sách nhập hàng - bán hàng",
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item)),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
              pageOrientation: "landscape",
            },
          }),
          "Thongkenhaphangbanhang"
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
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title="Theo dõi bán theo đơn" titleActions={titleActions} />
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
                invoiceNumber: "HD001",
                date: "2024-08-15",
                prescribingDoctor: "Dr. Nguyễn Văn A",
                patientName: "Trần Văn B",
                medicationName: "Paracetamol",
                quantity: 10,
                unit: "Viên",
                notes: "Uống sau khi ăn"
              },
              {
                invoiceNumber: "HD002",
                date: "2024-08-14",
                prescribingDoctor: "Dr. Lê Thị C",
                patientName: "Nguyễn Thị D",
                medicationName: "Ibuprofen",
                quantity: 20,
                unit: "Viên",
                notes: "Uống trước khi ăn"
              },
              {
                invoiceNumber: "HD003",
                date: "2024-08-13",
                prescribingDoctor: "Dr. Trần Minh E",
                patientName: "Lê Văn F",
                medicationName: "Amoxicillin",
                quantity: 15,
                unit: "Viên",
                notes: "Uống 3 lần/ngày"
              },
              {
                invoiceNumber: "HD004",
                date: "2024-08-12",
                prescribingDoctor: "Dr. Hoàng Thị G",
                patientName: "Phạm Thị H",
                medicationName: "Vitamin C",
                quantity: 30,
                unit: "Viên",
                notes: "Bổ sung vitamin"
              }
            ]}
            // dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            // isBulkAction={true}
            // striped={true}
            actions={actionsTable}
            actionType="inline"
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
