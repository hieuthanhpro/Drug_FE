import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import Report from "services/Report";
import { IReportSalePerson } from "model/report/response/ReportResponseModel";
import ExportModal from "components/exportModal/exportModal";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";

//CHƯA GHÉP API
export default function ReportRevenueProfit() {
  document.title = "Doanh số bán hàng";
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Doanh số bán hàng",
      is_active: true,
    },
  ]);

  const [salePersonFilter] = useState<IFilterItem[]>([
    {
      key: "created_at",
      name: "Thời gian",
      type: "date-two",
      is_featured: true,
      list: [],
      value: searchParams.get("from_date") ?? "",
      value_extra: searchParams.get("to_date") ?? "",
    },
    {
      key: "sale",
      name: "Nhân viên bán hàng",
      type: "select",
      is_featured: true,
      list: [],
      value: searchParams.get("sale") ?? "",
    },
    {
      key: "is_monopoly",
      name: "Loại thuốc",
      type: "select",
      is_featured: true,
      list: [
        {
          value: " ",
          label: "Tất cả",
        },
        {
          value: "true",
          label: "Hàng độc quyền",
        },
        {
          value: "false",
          label: "Hàng thương mại",
        },
      ],

      value: searchParams.get("is_monopoly") ?? "",
    },
  ]);

  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: "doanh số sale",
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

    const response = await Report.filterSalePerson(paramsSearch, abortController.signal);
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
      delete paramsTemp["invoice_type"];
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
        title: "Xuất phiếu doanh số sale",
        icon: <Icon name="Upload" />,
        // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
        callback: () =>!isLoading  && setOnShowModalExport(true),

      },
    ],
  };

  const titles = [
    "Mã HĐ",
    "Tên thuốc",
    "Đơn vị tính",
    "Số lượng bán hoàn thành",
    "Số lượng hàng bán trả lại",
    "Giá bán chưa VAT",
    "Thành tiền",
    "Loại thuốc",
    "Tên khách hàng",
    "Sale bán hàng",
    "Ngày bán",
  ];

  const dataMappingArray = (item: IReportSalePerson) => [
    item.invoice_code,
    item.drug_name,
    item.unit_name,
    item.quantity,
    item.return_quantity ? item.return_quantity : "0",
    formatCurrency(+item.cost, ","),
    formatCurrency((item.quantity - (item.return_quantity ? item.return_quantity : 0)) * parseFloat(item.cost), ","),
    item.is_monopoly == true ? "Hàng độc quyền" : "Hàng thương mại", //set monopoly
    item.customer_name,
    item.sale_name,
    moment(item.created_at).format("DD/MM/YYYY"),
  ];

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
    const response = await Report.exportSalePerson({ ...params, type_export: type });
    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: "DoanhSoSale",
          title: "Danh sách doanh số sale",
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item)),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: "Danh sách doanh số sale",
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item)),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
              pageOrientation: "landscape",
            },
          }),
          "DoanhSoSale"
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
    "text-center",
    "text-right",
    "text-right",
    "text-right",
    "text-right",
    "text-center",
    "text-center",
    "text-center",
    "text-center",
  ];
  return (
    <div className={`page-content page-sale-invoices${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title="Báo cáo doanh số bán hàng" titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name="Doanh số"
          placeholderSearch="Tìm kiếm theo mã HĐ, tên thuốc"
          params={params}
          isSaveSearch={true}
          listSaveSearch={listSaveSearch}
          isFilter={true}
          listFilterItem={salePersonFilter}
          isShowFilterList={true}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew) ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew) : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={"Doanh thu-lợi nhuận"}
            titles={titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            striped={true}
          />
        ) : isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            {
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
            }
          </Fragment>
        )}
      </div>
      <ExportModal
        name={"Thống kê danh sách bán hàng"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </div>
  );
}
