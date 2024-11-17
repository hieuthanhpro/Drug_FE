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

export default function ReportQualityControl() {
  document.title = "Sổ kiển soát chất lượng định kỳ và đột suất";
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

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "Sổ kiển soát chất lượng định kỳ và đột suất",
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
      "Ngày",
      "Dược sĩ phụ trách",
      "Nhân viên theo dõi"
  ],
    []
  );

  const dataMappingArray = useCallback(
    (item) => [
      item.date,
      item.responsiblePharmacist,
      item.monitoringStaff
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
  const actionsTable = (item: IGroup | ICategory): IAction[] => {
    return [
      {
        title: "Xem chi tiết",
        icon: <Icon name="Eye" />,
        callback: () => {
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
  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title="Sổ kiển soát chất lượng định kỳ và đột suất" titleActions={titleActions} />
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
                date: "2024-08-15",
                responsiblePharmacist: "Dược sĩ Nguyễn Văn A",
                monitoringStaff: "Nhân viên Trần Văn B"
              },
              {
                date: "2024-08-14",
                responsiblePharmacist: "Dược sĩ Lê Thị C",
                monitoringStaff: "Nhân viên Nguyễn Thị D"
              },
              {
                date: "2024-08-13",
                responsiblePharmacist: "Dược sĩ Trần Minh E",
                monitoringStaff: "Nhân viên Lê Văn F"
              },
              {
                date: "2024-08-12",
                responsiblePharmacist: "Dược sĩ Hoàng Thị G",
                monitoringStaff: "Nhân viên Phạm Thị H"
              }
            ]}
            dataFormat={dataFormat}
            actions={actionsTable}
            actionType="inline"
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
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
