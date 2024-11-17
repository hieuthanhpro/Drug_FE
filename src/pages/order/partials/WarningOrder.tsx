import BoxTable from "components/boxTable/boxTable";
import { BulkActionItemModel } from "components/bulkAction/bulkAction";
import Loading from "components/loading";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import SearchBox from "components/searchBox/searchBox";
import { SystemNotification } from "components/systemNotification/systemNotification";
import { IActionModal, ISaveSearch } from "model/OtherModel";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrderService from "services/OrderService";
import { formatCurrency, isDifferenceObj } from "utils/common";

interface WarningOrderProps {
  onShow: boolean;
  toggle: any;
  handleListChecked: any;
}
export default function WarningOrder(props: WarningOrderProps) {
  const { onShow, toggle, handleListChecked } = props;
  const [orderList, setOrderList] = useState([]);
  const [listIdChecked, setListIdChecked] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      const res = await OrderService.getWarningOrder();

      setOrderList(res.result);
      setIsLoading(false);
    };
    getData();
  }, []);

  const dataFormat = ["", "", "", "text-right", "text-right", ""];

  const titles = ["Mã sản phẩm", "Mã vạch", "Tên sản phẩm", "Tồn kho", "Số lượng cảnh báo tối thiểu", "Đơn vị"];

  const dataMappingArray = (item) => [
    item.drug_code,
    item.barcode,
    item.name,
    formatCurrency(item.quantity, ",", ""),
    formatCurrency(item.warning_quantity_min, ",", ""),
    item.warning_unit_name,
  ];

  const bulkActionList: BulkActionItemModel[] = [
    {
      title: "Đặt hàng",
      callback: () => undefined,
    },
  ];

  const [listSaveSearch] = useState<ISaveSearch[]>([
    {
      key: "all",
      name: "Tất cả sản phẩm",
      is_active: true,
      params: [],
    },
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<any>({
    query: searchParams.get("query") ?? "",
  });

  const actions = useMemo<IActionModal>(
    () => ({
      actions_right: {
        buttons: [
          {
            title: "Hủy",
            color: "primary",
            variant: "outline",
            callback: () => toggle(),
          },
          {
            title: "Chọn",
            color: "primary",
            callback: () => {
              handleListChecked(listIdChecked, orderList);
              toggle();
            },
          },
        ],
      },
    }),
    [params, listIdChecked]
  );

  return (
    <div className="warning-order">
      <Modal
        isOpen={onShow}
        className="modal-drug modal-order"
        isFade={true}
        staticBackdrop={true}
        toggle={toggle}
        isCentered={true}
      >
        <ModalHeader title="ĐẶT HÀNG TỪ HÀNG SẮP HẾT" toggle={toggle} />
        <ModalBody>
          <div className="card-box d-flex flex-column mt-5">
            <SearchBox
              name={"sản phẩm"}
              params={params}
              isShowFilterList={true}
              isSaveSearch={true}
              listSaveSearch={listSaveSearch}
              updateParams={(paramsNew) =>
                isDifferenceObj(params, paramsNew)
                  ? setParams(params.query !== paramsNew.query ? { ...paramsNew, page: 1 } : paramsNew)
                  : undefined
              }
            />
            {!isLoading && orderList && orderList.length > 0 ? (
              <BoxTable
                name={"Danh sách hàng sắp hết"}
                titles={titles}
                items={params?.query.length > 0 ? orderList.filter((item) => item.name == params?.query) : orderList}
                dataFormat={dataFormat}
                dataMappingArray={(item) => dataMappingArray(item)}
                isBulkAction={true}
                listIdChecked={listIdChecked}
                striped={true}
                setListIdChecked={(listId) => setListIdChecked(listId)}
                bulkActionItems={bulkActionList}
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
        </ModalBody>

        <ModalFooter actions={actions} />
      </Modal>
    </div>
  );
}
