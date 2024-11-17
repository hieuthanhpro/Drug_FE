import Checkbox from "components/checkbox/checkbox";
import Icon from "components/icon";
import Input from "components/input/input";
import Loading from "components/loading";
import Modal, { ModalBody, ModalHeader } from "components/modal/modal";
import { Pagination, PaginationProps } from "components/pagination/pagination";
import SelectCustom from "components/selectCustom/selectCustom";
import { SystemNotification } from "components/systemNotification/systemNotification";
import { IDrug } from "model/drug/response/DrugModelResponse";
import { IActionModal } from "model/OtherModel";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import DrugService from "services/DrugService";
import OrderService from "services/OrderService";
import { formatCurrency, showToast } from "utils/common";

interface OrderModalProps {
  onShow?: boolean;
  toggle?: any;
  callback: (drug: IDrug, quantity?: number) => void;
  isFilter?: string;
}

export default function OrderModal(props: OrderModalProps) {
  const { onShow, toggle, callback, isFilter } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [listOption, setListOption] = useState([]);
  const [valueOption, setValueOption] = useState(null);
  const [isDrug, setIsDrug] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [alphabet, setAlphabet] = useState<string>("");
  const [listDrug, setListDrug] = useState<IDrug[]>([]);
  const [listDrugWarehouse, setListDrugWarehouse] = useState<IDrug[]>([]);
  const [listDrugOrder, setListDrugOrder] = useState([
    {
      drug: {},
      quantity: 0,
      store: null,
    },
  ]);

  const [drugQuantity, setDrugQuantity] = useState(0);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(16);
  const [pagination, setPagination] = useState<PaginationProps>({
    name: "Sản phẩm",
    displayNumber: 3,
    page: page,
    sizeLimit: limit,
    totalPage: 16,
    totalItem: 100,
    isChooseSizeLimit: false,
    setPage: (pageNew) => setPage(pageNew),
    chooseSizeLimit: (limitNew) => setLimit(limitNew),
  });

  const onSubmit = (e) => {
    console.log("Submit");
  };

  useEffect(() => {
    const getDrugStore = async () => {
      const res = await OrderService.drugStore();

      const options = res.RESULT.map((item) => {
        return { value: item.id, label: item.name };
      });
      setListOption(options);
      setIsLoading(false);
    };

    getDrugStore();
  }, [valueOption]);

  useEffect(() => {
    const getListDrug = async () => {
      setIsLoading(true);
      if (valueOption) {
        const res = await OrderService.filterDrug(page, valueOption, null, null, searchText);
        const result = res.RESULT;
        setListDrug(result?.data);
        setPagination({
          ...pagination,
          totalItem: result?.total,
          totalPage: result?.last_page,
          page: page,
        });
      }
      setIsLoading(false);
    };

    getListDrug();
  }, [valueOption, page, searchText]);

  const handleOnChange = (e) => {
    setSearchText(e.target.value);
  };

  const actions = useMemo<IActionModal>(
    () => ({
      actions_right: {
        buttons: [
          {
            title: "Hủy",
            color: "primary",
            variant: "outline",
            callback: () => {
              toggle();
            },
          },
          {
            title: "Cập nhật giỏ hàng",
            // type: "submit",
            color: "primary",
            // disabled: disabledOnSubmit(),
            // is_loading: isSubmit,
            // callback: () => {},
          },
        ],
      },
    }),
    [drugQuantity]
  );

  const handleChangeNumber = (quantity, item) => {
    if (quantity > 0) {
      const itemTemp = {
        drug: item,
        quantity: quantity,
        store: valueOption,
      };
      if (itemTemp.drug.id === item.id) {
        const newItem = { ...itemTemp, quantity: quantity };
        setListDrugOrder([...listDrugOrder, newItem]);
      } else {
        const newLineItem = {
          drug: item,
          quantity: quantity,
          store: valueOption,
        };
        setListDrugOrder([...listDrugOrder, newLineItem]);
      }
    }
  };

  const abortController = new AbortController();
  const getListDrugSale = async (paramsSearch) => {
    setIsLoading(true);
    const response = await DrugService.filterForSale(paramsSearch, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setListDrugWarehouse(result.data);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getListDrugSale(searchText);
  }, []);

  return (
    <Fragment>
      <Modal
        isOpen={onShow}
        className="modal-drug modal-order"
        isFade={true}
        staticBackdrop={true}
        toggle={toggle}
        isCentered={true}
      >
        <ModalHeader title="ĐẶT HÀNG" toggle={toggle} />
        <Fragment>
          <form className="form-drug" onSubmit={(e) => onSubmit(e)} noValidate={true}>
            <ModalBody>
              <div className="order-modal__body">
                {isFilter ? (
                  <div className="row mb-6">
                    <div className="col-3">
                      <SelectCustom
                        options={listOption}
                        placeholder="Chọn nhà cung cấp"
                        value={valueOption}
                        isSearchable={true}
                        onChange={(e) => setValueOption(e.value)}
                        fill={true}
                      />
                    </div>
                    <div className="col-9">
                      <div className="order-modal__body__filter__content__search">
                        <Input
                          placeholder="Chọn sản phẩm Đặt hàng / nhập thông tin tìm kiếm sản phẩm"
                          icon={<Icon name="Search" />}
                          value={searchText || ""}
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row mb-6">
                    <div className="col-12">
                      <div className="order-modal__body__filter__content__search">
                        <Input
                          placeholder="Chọn sản phẩm Đặt hàng / nhập thông tin tìm kiếm sản phẩm"
                          icon={<Icon name="Search" />}
                          value={searchText || ""}
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  {isFilter && (
                    <div className="col-3">
                      <div className="order-modal__body__filter">
                        <div className="order-modal__body__filter__item">
                          <h4>Loại</h4>
                          <div className="list-item">
                            <Checkbox label={"Thuốc"} />
                            <Checkbox label={"SP không phải là thuốc"} />
                          </div>
                        </div>
                        <div className="order-modal__body__filter__item">
                          <h4>Tồn kho</h4>
                          <div className="list-item">
                            <div>
                              <Input type="radio" name="type" id="type1" checked />
                              <label htmlFor="type1">Tất cả</label>
                            </div>
                            <div>
                              <Input type="radio" name="type" id="type2" />
                              <label htmlFor="type2">Hàng có sẵn</label>
                            </div>
                          </div>
                        </div>
                        <div className="order-modal__body__filter__item">
                          <h4>Tên thuốc</h4>
                          <ul className="list-item-name">
                            <li>A-D</li>
                            <li>E-H</li>
                            <li>I-L</li>
                            <li>M-P</li>
                            <li>Q-T</li>
                            <li>U-Z</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={`${isFilter ? "col-9" : "col-12"}`}>
                    <div className="order-modal__body__filter__content">
                      <div className="order-modal__body__filter__content__body">
                        {isFilter && isLoading ? (
                          <Loading />
                        ) : isFilter && listDrug.length > 0 ? (
                          <>
                            <div className="row ">
                              {listDrug.map((item) => (
                                <div key={item.id} className="col-3 order-modal__drug" onClick={() => callback(item)}>
                                  <div className="order-modal__drug__img">
                                    {item.image ? <img src={item.image} alt={item.name} /> : <Icon name="NoImage" />}
                                  </div>
                                  <div className="order-modal__drug__name">{item.name}</div>
                                  <div className="order-modal__drug__price">
                                    {formatCurrency(item.current_cost)}/{item.unit_name}
                                  </div>
                                  {/* <QuantityController
                                    item={item}
                                    callback={(number, item) => handleChangeNumber(number, item)}
                                  /> */}
                                </div>
                              ))}
                            </div>
                            <div className="row drug-pagination">
                              <Pagination
                                name={pagination.name}
                                displayNumber={pagination.displayNumber}
                                page={page}
                                setPage={(page) => setPage(page)}
                                sizeLimit={pagination.sizeLimit}
                                totalItem={pagination.totalItem}
                                totalPage={pagination.totalPage}
                                isChooseSizeLimit={pagination.isChooseSizeLimit}
                                chooseSizeLimit={(limit) =>
                                  pagination.chooseSizeLimit && pagination.chooseSizeLimit(limit)
                                }
                              />
                            </div>
                          </>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            {/* <ModalFooter actions={actions} /> */}
          </form>
        </Fragment>
      </Modal>
    </Fragment>
  );
}
