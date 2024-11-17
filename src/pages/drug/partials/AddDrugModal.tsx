import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "components/modal/modal";
import { IActionModal, IOption, ITabContent } from "model/OtherModel";
import Dialog, { IContentDialog } from "components/dialog/dialog";
import TabContent from "components/tabContent/tabContent";
import Loading from "components/loading";
import { IDrug } from "model/drug/response/DrugModelResponse";
import DrugService from "services/DrugService";
import { filterObj, isDifferenceObj, showToast } from "utils/common";
import Checkbox from "components/checkbox/checkbox";
import InfoGeneral from "./InfoGeneral";
import { IFormData } from "model/FormModel";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import UnitPrice from "./UnitPrice";
import Warning from "./Warning";
import { AddDrugModalProps } from "model/drug/PropsModel";
import { tabListDefault } from "model/drug/DataModelInitial";
import DrugMasterDataModal from "./DrugMasterDataModal";
import { IDrugMaster } from "model/drug/response/DrugMasterModelResponse";
import { useActiveElement } from "utils/hookCustom";
import "./AddDrugModal.scss";
import { IFormDataExchange } from "model/drug/OtherModel";

export default function AddDrugModal(props: AddDrugModalProps) {
  const { onShow, id, isDrug, onHide } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const focusedElement = useActiveElement();
  const [dataDrug, setDataDrug] = useState<IDrug>(null);
  const [valuesDefault, setValuesDefault] = useState<Record<string, any>>();
  const [valuesUnitDefault, setValuesUnitDefault] = useState<any[]>();
  const [listCategory, setListCategory] = useState<IOption[]>(null);
  const [listGroup, setListGroup] = useState<IOption[]>(null);
  const [listUnit, setListUnit] = useState<IOption[]>(null);
  const errorBridge=[]

  const refInfoGeneral = React.useRef(null);
  const refUnit = React.useRef(null);
  const refWarning = React.useRef(null);

  const abortController = new AbortController();
  const getDetailDrug = async () => {
    setIsLoading(true);
    const response = await DrugService.detail(id, abortController.signal);
    if (response.code === 200) {
      const result = response.result;
      setDataDrug(result);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {

    
    if (id && onShow) {
      getDetailDrug();
    }
    if (!id && onShow) {
      setFormData({ values: valuesDefault });
      setListFormUnitExchange([]);
      setDataDrug(null);
      setIsLoading(false);
    }
    if (onShow) {
      setIsSubmit(false);
      setTabList(
        tabList.map((t) => {
          return {
            ...t,
            active: t.value === "general" ? true : false,
          };
        })
      );
      setDrugMasterData(null);
    }
    return () => {
      abortController.abort();
    };
  }, [id, onShow]);

  const [formData, setFormData] = useState<IFormData>(null);

  const [listFormUnitExchange, setListFormUnitExchange] = useState<IFormDataExchange[]>([]);
  useEffect(() => {
    const baseRatio =
      dataDrug?.main_cost > 0 && dataDrug?.current_cost > 0
        ? (100 * ((dataDrug?.current_cost ?? 0) - (dataDrug?.main_cost ?? 0))) / (dataDrug?.main_cost ?? 0)
        : 0;
    const valuesTemp = {
      ...(id ? { id: id } : {}),
      is_master_data: dataDrug?.is_master_data ?? false,
      is_monopoly: dataDrug?.is_monopoly ?? false,
      name: dataDrug?.name ?? "",
      short_name: dataDrug?.short_name ?? "",
      drug_category_id: dataDrug?.drug_category_id ?? "",
      drug_group_id: dataDrug?.drug_group_id ?? "",
      unit_id: dataDrug?.unit_id ?? "",
      current_cost: dataDrug?.current_cost ?? 0,
      main_cost: dataDrug?.main_cost ?? 0,
      base_ratio: baseRatio,
      drug_code: dataDrug?.drug_code ?? "",
      barcode: dataDrug?.barcode ?? "",
      registry_number: dataDrug?.registry_number ?? "",
      country: dataDrug?.country ?? "",
      company: dataDrug?.company ?? "",
      package_form: dataDrug?.package_form ?? "",
      concentration: dataDrug?.concentration ?? "",
      substances: dataDrug?.substances ?? "",
      image: dataDrug?.image ?? "",
      quantity: dataDrug?.quantity ?? 0,

      warning_unit: dataDrug?.warning_unit ?? "",
      warning_quantity_min: dataDrug?.warning_quantity_min ?? "",
      warning_quantity_max: dataDrug?.warning_quantity_max ?? "",
      warning_days: dataDrug?.warning_days ?? "",
    };
    const unitsExchangeTemp =
      dataDrug?.units
        ?.filter((unit) => unit.is_basic === "no")
        .map((unit) => {
          const unitRatio =
            dataDrug?.main_cost > 0 && +unit.current_cost > 0 && +unit.current_cost > dataDrug?.main_cost * unit.exchange
              ? (100 * (+unit.current_cost - dataDrug?.main_cost * unit.exchange)) / (dataDrug?.main_cost * unit.exchange)
              : 0;
          return {
            uuid: uuidv4(),
            values: {
              unit_id: unit.unit_id,
              exchange: unit.exchange,
              current_cost: unit.current_cost,
              ratio: unitRatio,
              main_cost: (dataDrug?.main_cost ?? 0) * unit.exchange,
            },
          };
        }) ?? [];
    setValuesDefault(valuesTemp);
    setFormData({ values: valuesTemp, errors: {} });
    setValuesUnitDefault(unitsExchangeTemp);
    setListFormUnitExchange(
      unitsExchangeTemp?.map((unit, index) => {
        return {
          uuid: unit.uuid,
          active: index === 0 ? true : false,
          values: unit.values,
        };
      }) ?? []
    );
    return () => {
      setValuesDefault(null);
    };
  }, [dataDrug]);

  const disabledOnSubmit = useCallback(() => {
    let isDisabled = true;
    if (
      isDifferenceObj(formData?.values, valuesDefault) &&
      (!formData?.errors || (formData?.errors && Object.keys(formData?.errors).length === 0)) &&
      listFormUnitExchange?.filter((formUnit) => formUnit.errors && Object.keys(formUnit.errors).length > 0).length === 0
    ) {
      isDisabled = false;
    }
    if (
      isDisabled &&
      (listFormUnitExchange?.filter((formUnit) =>
        isDifferenceObj(valuesUnitDefault.find((unit) => unit.uuid === formUnit.uuid)?.values, formUnit.values)
      ).length > 0 ||
        valuesUnitDefault?.filter((unit) =>
          isDifferenceObj(listFormUnitExchange.find((formUnit) => formUnit.uuid === unit.uuid)?.values, unit.values)
        ).length > 0) &&
      listFormUnitExchange?.filter((formUnit) => formUnit.errors && Object.keys(formUnit.errors).length > 0).length === 0 &&
      (!formData?.errors || (formData?.errors && Object.keys(formData?.errors).length === 0))
    ) {
      isDisabled = false;
    }
    if (isSubmit) {
      isDisabled = true;
    }
    return isDisabled;
  }, [isSubmit, formData, listFormUnitExchange]);

  const actions = useMemo<IActionModal>(
    () => ({
      actions_left: {
        text: (
          <p className="note">
            Lưu ý: Bắt buộc điền vào những mục có dấu (<span className="required">*</span>)
          </p>
        ),
      },
      actions_right: {
        buttons: [
          {
            title: "Hủy",
            color: "primary",
            variant: "outline",
            disabled: isSubmit,
            callback: () => {
              !isDifferenceObj(formData?.values, valuesDefault) &&
              listFormUnitExchange.length === valuesUnitDefault.length &&
              listFormUnitExchange.filter((formUnit) =>
                isDifferenceObj(valuesUnitDefault.find((unit) => unit.uuid === formUnit.uuid).values, formUnit.values)
              ).length === 0
                ? onHide(false)
                : showDialogConfirmCancel();
            },
          },
          {
            title: id ? "Cập nhật" : "Tạo mới",
            type: "submit",
            color: "primary",
            disabled: disabledOnSubmit(),
            is_loading: isSubmit,
          },
        ],
      },
    }),
    [isSubmit, formData, dataDrug, listFormUnitExchange]
  );

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<IContentDialog>(null);

  const showDialogConfirmCancel = () => {
    const contentDialog: IContentDialog = {
      color: "warning",
      className: "dialog-cancel",
      isCentered: true,
      title: `Hủy bỏ thao tác thêm mới ${isDrug ? "thuốc" : "sản phẩm"}`,
      message: "Bạn có chắc chắn muốn hủy bỏ? Thao tác này không thể khôi phục.",
      cancelText: id ? "Hủy" : "Quay lại",
      cancelAction: () => {
        setShowDialog(false);
        setContentDialog(null);
      },
      defaultText: "Xác nhận",
      defaultAction: () => {
        onHide(false);
        setShowDialog(false);
        setContentDialog(null);
      },
    };
    setContentDialog(contentDialog);
    setShowDialog(true);
  };

  const [tabList, setTabList] = useState<ITabContent[]>(tabListDefault);
  const setActiveTab = (value) => {
    if (!isSubmit) {
      setTabList(
        tabList.map((t) => {
          return {
            ...t,
            active: value === t.value ? true : false,
          };
        })
      );
    }
  };

  const updateFormData = (form: IFormData) => {
    if (form.values) {
      let formDataTemp = _.cloneDeep(formData);
      if (formDataTemp) {
        formDataTemp.values = { ...formDataTemp.values, ...form.values };
        if (formDataTemp.errors) {
          for (const value in formDataTemp.values) {
            if (formDataTemp.errors.hasOwnProperty(value)) {
              delete formDataTemp.errors[value];
            }
          }
          formDataTemp.errors = { ...formDataTemp.errors, ...(form.errors ?? {}) };
        } else {
          formDataTemp.errors = form.errors ?? {};
        }
      } else {
        formDataTemp = { values: form.values, errors: form.errors ?? {} };
      }
      setFormData(formDataTemp);
    }
  };

  const [stateFocusInput, setStateFocusInput] = useState<boolean>(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    const isErrorsGeneral = refInfoGeneral.current();
    const errorsUnit = refUnit.current();
    const isErrorsWarning = refWarning.current();
    // Check error and change tab error
    if (isErrorsGeneral || errorsUnit?.unit_basic || !!errorsUnit?.unit_exchange || isErrorsWarning) {
      setStateFocusInput(true);
      setErrorWithTab(isErrorsGeneral, errorsUnit, isErrorsWarning);
      return;
    }
    setIsSubmit(true);
    const body = new FormData();

    body.append("is_drug",isDrug.toString())

    for (const key in formData.values) {
      body.append(key, formData.values[key]);
    }
    if (formData?.values?.is_master_data && drugMasterData) {
      body.append("drug_master_data_id", drugMasterData.id.toString());
    }
    listFormUnitExchange.map((unit, index) => {
      for (const key in unit.values) {
        body.append(`units[${index}][${key}]`, unit.values[key]);
      }
    });
    const response = await DrugService.save(body);
    if (response.code === 200) {
      showToast(`${id ? "Cập nhật" : "Thêm mới"} ${isDrug ? "thuốc" : "danh mục"} thành công`, "success");
      onHide(true);
    } else {
      showToast(response.message ?? "Có lỗi xảy ra. Vui lòng thử lại sau", "error");
      if (response.errors && Object.keys(response.errors).length > 0) {
        setStateFocusInput(true);
        const errorsGeneral = filterObj(response.errors, "units.", "no");
        const errorsUnitFilter = filterObj(response.errors, "units.", "yes");
        const errorsWarning = filterObj(response.errors, "warning", "yes");
        if (Object.keys(errorsUnitFilter).length > 0) {
          const listFormUnitExchangeTemp = _.cloneDeep(listFormUnitExchange);
          for (const key in errorsUnitFilter) {
            const keySplit = key.split(".");
            const index = keySplit[1];
            if (listFormUnitExchangeTemp[index].errors) {
              listFormUnitExchangeTemp[index].errors = { ...listFormUnitExchangeTemp[index].errors, [keySplit[2]]: errorsUnitFilter[key] };
            } else {
              listFormUnitExchangeTemp[index].errors = { [keySplit[2]]: errorsUnitFilter[key] };
            }
          }
          setListFormUnitExchange(listFormUnitExchangeTemp);
        }
        setActiveTab(
          Object.keys(errorsWarning).length === 0 && Object.keys(errorsGeneral).length > 0
            ? "general"
            : Object.keys(errorsUnitFilter).length > 0
            ? "unit_price"
            : "warning"
        );
        setFormData({
          ...formData,
          errors: filterObj(response.errors, "units.", "no"),
        });
      }
      setIsSubmit(false);
    }
  };

  const setErrorWithTab = (isErrorsGeneral, errorsUnit, isErrorsWarning) => {
    let activeTab = null;
    switch (tabList.find((tab) => tab.active === true).value) {
      case "general":
          activeTab = "general";
          if ((errorsUnit?.unit_basic || !!errorsUnit?.unit_exchange) && !isErrorsGeneral ) {
            activeTab = "unit_price";
          } else if (isErrorsWarning){
            activeTab = "warning";
          }
        break;
      case "unit_price":
        activeTab = "unit_price";
        if (!errorsUnit?.unit_basic && !errorsUnit?.unit_exchange) {
          if (isErrorsGeneral) {
            activeTab = "general";
          } else if (isErrorsWarning) {
            activeTab = "warning";
          }
        }
        break;
      case "warning":
        activeTab = "warning";
        if (!isErrorsWarning) {
          if (isErrorsGeneral) {
            activeTab = "general";
          } else if (errorsUnit?.unit_basic || !!errorsUnit?.unit_exchange) {
            activeTab = "unit_price";
          }
        }
        break;
    }

    if (errorsUnit?.unit_exchange) {
      setListFormUnitExchange((prevState) => [
        ...prevState.map((unit) => {
          return {
            ...unit,
            active: unit.uuid === errorsUnit?.unit_exchange,
          };
        }),
      ]);
    }

    if (activeTab) {
      setActiveTab(activeTab);
    }
  };

  useEffect(() => {
    if (stateFocusInput === true) {
      let errElm = document.querySelector(".modal-drug .invalid");
      switch (tabList.find((tab) => tab.active === true).value) {
        case "general":
          errElm = document.querySelector(".modal-drug .tab-pane-general .invalid");
          break;
        case "unit_price":
          errElm = document.querySelector(".modal-drug .tab-pane-unit-price .invalid");
          break;
        default:
          errElm = document.querySelector(".modal-drug .tab-pane-warning .invalid");
          break;
      }
      if (errElm !== null) {
        errElm.querySelector("input").focus();
      }
      setStateFocusInput(false);
    }
  }, [formData?.errors, stateFocusInput, listFormUnitExchange]);

  // Check unit duplicate
  useEffect(() => {
    if (formData?.values?.unit_id) {
      let errors = { ...formData.errors };
      if (listFormUnitExchange.filter((formUnit) => formUnit?.values?.unit_id === formData.values.unit_id).length > 0) {
        errors = { ...formData.errors, unit_id: "Trùng với đơn vị quy đổi" };
      } else {
        delete errors["unit_id"];
      }
      if (isDifferenceObj(errors, formData.errors)) {
        setFormData({ ...formData, errors: errors });
      }
    }
  }, [formData?.values?.unit_id, listFormUnitExchange]);

  //Add event button esc
  const checkKeyDown = useCallback(
    (e) => {
      const { keyCode } = e;
      if (keyCode === 27 && !showDialog) {
        if (isDifferenceObj(formData?.values, valuesDefault)) {
          showDialogConfirmCancel();
          if (focusedElement instanceof HTMLElement) {
            focusedElement.blur();
          }
        } else {
          onHide(false);
        }
      }
    },
    [formData]
  );

  useEffect(() => {
    window.addEventListener("keydown", checkKeyDown);
    return () => {
      window.removeEventListener("keydown", checkKeyDown);
    };
  }, [checkKeyDown]);

  //Modal drug master data
  const [showModalMasterData, setShowModalMasterData] = useState<boolean>(false);
  const [drugMasterData, setDrugMasterData] = useState<IDrugMaster>(null);
  const callbackChooseDrugMaster = (item: IDrugMaster) => {
    setFormData({
      ...formData,
      values: {
        ...formData.values,
        name: item?.name ?? "",
        short_name: item?.short_name ?? "",
        drug_category_id: item?.drug_category_id ?? "",
        drug_group_id: item?.drug_group_id ?? "",
        unit_id: item?.unit_id ?? "",
        current_cost: 0,
        main_cost: 0,
        base_ratio: 0,
        barcode: item?.barcode ?? "",
        registry_number: item?.registry_number ?? "",
        country: item?.country ?? "",
        company: item?.company ?? "",
        package_form: item?.package_form ?? "",
        concentration: item?.concentration ?? "",
        substances: item?.substances ?? "",
        image: item?.image ?? "",
        quantity: 0,
      },
    });
    setDrugMasterData(item);
    setShowModalMasterData(false);
  };

  const tabActive=tabList.find((tab) => tab.active === true)

  return (
    <Fragment>
      <Modal isOpen={onShow} className="modal-drug" isFade={true} staticBackdrop={true} toggle={() => !isSubmit && onHide(false)} isCentered={true}>
        <ModalHeader
          title={`${id ? "Chỉnh sửa" : "Thêm mới"}${isDrug ? " thuốc" : " sản phẩm"}${
            id && dataDrug ? ` ${dataDrug.name} - ${dataDrug.drug_code}` : ""
          }`}
          toggle={() => !isSubmit && onHide(false)}
        />
        {isLoading ? (
          <ModalBody>
            <Loading />
          </ModalBody>
        ) : (
          <Fragment>
            <form className="form-drug" onSubmit={(e) => onSubmit(e)} noValidate={true}>
              <ModalBody>
                <TabContent listTab={tabList} onChangeTab={(tab) => setActiveTab(tab.value)}>
                  <div className={`tab-pane tab-pane-general${tabList.find((tab) => tab.active === true).value === "general" ? " active" : ""}`}>
                    <div className="option-master-monopoly">
                      {isDrug && !id && !dataDrug && tabList.find((tab) => tab.active === true).value === "general" && (
                        <Checkbox
                          checked={formData?.values?.is_master_data}
                          className="checkbox-dqg"
                          label="Chọn thuốc từ dữ liệu Quốc gia"
                          onChange={(e) => {
                            setFormData((prevState) => ({ ...prevState, values: { ...prevState.values, is_master_data: e.target.checked } }));
                            e.target.checked === true ? setShowModalMasterData(true) : setDrugMasterData(null);
                          }}
                        />
                      )}
                      <Checkbox
                        checked={formData?.values?.is_monopoly}
                        className="checkbox-monopoly"
                        label={`${isDrug ? "Thuốc" : "Sản phẩm"} độc quyền`}
                        onChange={(e) =>
                          setFormData((prevState) => ({ ...prevState, values: { ...prevState.values, is_monopoly: e.target.checked } }))
                        }
                      />
                    </div>
                    <InfoGeneral
                      errorBridge={errorBridge}
                      isDrug={isDrug}
                      dataDrug={dataDrug}
                      formData={formData}
                      listCategory={listCategory}
                      setListCategory={setListCategory}
                      listGroup={listGroup}
                      setListGroup={setListGroup}
                      listUnit={listUnit}
                      setListUnit={setListUnit}
                      listFormUnitExchange={listFormUnitExchange}
                      handleUpdate={(formDataGeneral: IFormData) => updateFormData(formDataGeneral)}
                      handleSubmit={refInfoGeneral}
                      drugMasterData={drugMasterData}
                    />
                  </div>
                  <div
                    className={`tab-pane tab-pane-unit-price${tabList.find((tab) => tab.active === true).value === "unit_price" ? " active" : ""}`}
                  >
                    <UnitPrice
                      tabActive={tabActive}
                      errorBridge={errorBridge}
                      isDrug={isDrug}
                      dataDrug={dataDrug}
                      formData={formData}
                      listUnit={listUnit}
                      setListUnit={setListUnit}
                      listFormUnitExchange={listFormUnitExchange}
                      setListFormUnitExchange={(listFormUnitExchangeTemp: IFormDataExchange[]) => setListFormUnitExchange(listFormUnitExchangeTemp)}
                      handleUpdate={(formDataUnitPrice: IFormData) => updateFormData(formDataUnitPrice)}
                      handleSubmit={refUnit}
                      drugMasterData={drugMasterData}
                    />
                  </div>
                  <div className={`tab-pane tab-pane-warning${tabList.find((tab) => tab.active === true).value === "warning" ? " active" : ""}`}>
                    <Warning
                      tabActive={tabActive}
                      errorBridge={errorBridge}
                      isDrug={isDrug}
                      dataDrug={dataDrug}
                      formData={formData}
                      listUnit={listUnit}
                      listFormUnitExchange={listFormUnitExchange}
                      handleUpdate={(formDataUnitPrice: IFormData) => updateFormData(formDataUnitPrice)}
                      handleSubmit={refWarning}
                    />
                  </div>
                </TabContent>
              </ModalBody>
              <ModalFooter actions={actions} />
            </form>
          </Fragment>
        )}
      </Modal>
      <DrugMasterDataModal
        onShow={showModalMasterData}
        onHide={() => {
          if (!drugMasterData) {
            setFormData((prevState) => ({ ...prevState, values: { ...prevState.values, is_master_data: false } }));
          }
          setShowModalMasterData(!showModalMasterData);
        }}
        callback={(item: IDrugMaster) => callbackChooseDrugMaster(item)}
      />
      <Dialog content={contentDialog} isOpen={showDialog} />
    </Fragment>
  );
}
