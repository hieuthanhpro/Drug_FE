import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import TitleAction, { ITitleActions } from "components/titleAction/titleAction";
import BoxTable from "components/boxTable/boxTable";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import Loading from "components/loading";
import { DataPaginationDefault, PaginationProps } from "components/pagination/pagination";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import { IUser } from "model/user/response/UserResponseModel";
import { IWarehouse } from "model/warehouse/response/WarehouseInvoiceResponseModel";
import { formatCurrency, isDifferenceObj, showToast } from "utils/common";
import moment from "moment";
import WarehouseService from "services/WarehouseService";
import Icon from "components/icon";
import ExportModal from "components/exportModal/exportModal";
import TableDocDefinition from "exports/pdf/table";
import { ExportPdf } from "exports/pdf";
import { ExportExcel } from "exports/excel";
import { ContextType, UserContext } from "contexts/userContext";
import { IOption } from "model/OtherModel";

export default function WarehouseInventory({isReport=false}) {
  document.title = !isReport ? "Quản lý tồn kho": "Báo cáo xuất nhập tồn" 
  const [searchParams, setSearchParams] = useSearchParams();
  const [listInvoice, setListInvoice] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNoItem, setIsNoItem] = useState<boolean>(false);
  const { name, drug_store } = useContext(UserContext) as ContextType;
  const isMounted = useRef(false);
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const [pagination, setPagination] = useState<PaginationProps>({
    ...DataPaginationDefault,
    name: !isReport ? "Quản lý tồn kho": "Báo cáo xuất nhập tồn" ,
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
    response = await WarehouseService.filterInventory(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      console.log("result", result);
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
      0;
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
        title: !isReport ? "Xuất phiếu quản lý tồn kho": "Xuất báo cáo xuất nhập tồn" ,
        icon: <Icon name="Upload" />,
        // callback: () => !isNoItem && !isLoading && listInvoice.length > 0 && setOnShowModalExport(true),
        callback: () =>!isLoading && setOnShowModalExport(true),
      },
    ],
  };

  const titles = [
    "Mã thuốc",
    "Tên thuốc",
    "Số lô",
    "Hạn dùng",
    "Quy cách đóng gói",
    "Đơn vị tính",
    "Giá mua",
    "Giá bán",
    "Số lượng tồn kho",
    "Tổng tiền mua vào",
    "Tổng tiền bán ra",
  ];

  const dataMappingArray = (item: IWarehouse) => [
    item.drug_code,
    item.drug_name,
    item.number,
    moment(item.expiry_date).format("DD/MM/YYYY"),
    item.package_form,
    item.unit_name,
    formatCurrency(+item.main_cost, ","),
    formatCurrency(+item.current_cost, ","),
    formatCurrency(+item.quantity, ","),
    formatCurrency(+item.total_buy, ","),
    formatCurrency(+item.total_sell, ","),
  ];

  //export
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
    const response = await WarehouseService.exportInventory({ ...params, type_export: type });

    if (response?.result?.data) {
      if (extension === "excel") {
        ExportExcel({
          fileName: "TonKho",
          title: !isReport ? "Danh sách tồn kho":"Danh sách xuất nhập tồn",
          header: titles,
          data: response?.result?.data.map((item) => dataMappingArray(item)),
          info: { name, drug_store },
        });
      } else {
        ExportPdf(
          TableDocDefinition({
            info: { name, drug_store },
            title: !isReport ? "Danh sách tồn kho":"Danh sách xuất nhập tồn",
            header: titles,
            items: response?.result?.data.map((item) => dataMappingArray(item)),
            mapFooter: undefined,
            customFooter: undefined,
            options: {
              smallTable: true,
              pageOrientation: "landscape",
            },
          }),
          "TonKho"
        );
      }
      showToast("Xuất file thành công", "success");
      setOnShowModalExport(false);
    } else {
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
      setOnShowModalExport(false);
    }
  };

  const dataFormat = ["", "", "", "", "", "text-center", "text-right", "text-right", "text-right", "text-right", "text-right"];

  return (
    <div className={`page-content page-warehouse-inventory${isNoItem ? " bg-white" : ""}`}>
      <TitleAction title={!isReport ? "Quản lý tồn kho" : "Báo cáo xuất nhập tồn" } titleActions={titleActions} />
      <div className="card-box d-flex flex-column">
        <SearchBox
          name="Đơn hàng"
          placeholderSearch="Tìm kiếm theo mã thuốc, tên thuốc, số lô"
          params={params}
          updateParams={(paramsNew) =>
            isDifferenceObj(params, paramsNew) ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew) : undefined
          }
        />
        {!isLoading && listInvoice && listInvoice.length > 0 ? (
          <BoxTable
            name={"Tổng số mặt hàng: "}
            titles={titles}
            items={listInvoice}
            dataFormat={dataFormat}
            isPagination={true}
            dataPagination={pagination}
            dataMappingArray={(item) => dataMappingArray(item)}
            isBulkAction={true}
            striped={true}
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
      </div>
      <ExportModal
        name={"Doanh thu - lợi nhuận gộp"}
        onShow={onShowModalExport}
        onHide={() => setOnShowModalExport(false)}
        options={optionsExport}
        callback={(type, extension) => exportCallback(type, extension)}
      />
    </div>
  );
}

export function WarehouseInventoryReport() {
  return <WarehouseInventory isReport={true} />;
}