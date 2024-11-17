import React, { useState, useMemo, Fragment, useEffect, useRef, useCallback } from "react";
import { IFieldCustomize, IValidation } from "model/FormModel";
import Button from "components/button/button";
import Icon from "components/icon";
import { SelectOptionData } from "utils/selectCommon";
import FieldCustomize from "components/fieldCustomize/fieldCustomize";
import Validate, { handleChangeValidate } from "utils/validate";
import NoImage from "assets/images/no-image.png";
import { AddDrugProps } from "model/drug/PropsModel";
import { showToast } from "utils/common";
import "./InfoGeneral.scss";

export default function InfoGeneral(props: AddDrugProps) {
  const {
    errorBridge,
    isDrug,
    dataDrug,
    formData,
    listCategory,
    setListCategory,
    listGroup,
    setListGroup,
    listUnit,
    setListUnit,
    handleUpdate,
    handleSubmit,
    drugMasterData,
  } = props;
  const [showExtraInfo, setShowExtraInfo] = useState<boolean>(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);
  const [isLoadingGroup, setIsLoadingGroup] = useState<boolean>(false);
  const [isLoadingUnit, setIsLoadingUnit] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    onSelectOpenUnit();
    return () => {
      setIsLoadingCategory(false);
      setIsLoadingGroup(false);
      setIsLoadingUnit(false);
    };
  }, []);

  const refInputUpload = useRef<HTMLInputElement>();

  const onSelectOpenCategory = async () => {
    if (!listCategory || listCategory.length === 0) {
      setIsLoadingCategory(true);
      const dataOption = await SelectOptionData("category", { is_drug: isDrug });
      if (dataOption) {
        setListCategory([
          { value: "", label: `Chọn danh mục ${isDrug ? "thuốc" : "sản phẩm"}` },
          ...(dataOption.length > 0 ? dataOption : []),
        ]);
      }
      setIsLoadingCategory(false);
    }
  };

  const onSelectOpenGroup = async () => {
    if (!listGroup || listGroup.length === 0) {
      setIsLoadingGroup(true);
      const dataOption = await SelectOptionData("group", { is_drug: isDrug });
      if (dataOption) {
        setListGroup([
          { value: "", label: `Chọn nhóm ${isDrug ? "thuốc" : "sản phẩm"}` },
          ...(dataOption.length > 0 ? dataOption : []),
        ]);
      }
      setIsLoadingGroup(false);
    }
  };

  const onSelectOpenUnit = async () => {
    if (!listUnit || listUnit.length === 0) {
      setIsLoadingUnit(true);
      const dataOption = await SelectOptionData("unit");
      if (dataOption) {
        setListUnit([{ value: "", label: "Chọn đơn vị nhỏ nhất" }, ...(dataOption.length > 0 ? dataOption : [])]);
      }
      setIsLoadingUnit(false);
    }
  };

  const validations: IValidation[] = [
    {
      name: "name",
      rules: "required|max:500",
    },
    {
      name: "short_name",
      rules: "max:50",
    },
    {
      name: "unit_id",
      rules: "required",
    },
    {
      name: "current_cost",
      rules: "required|min:0",
    },
    {
      name: "barcode",
      rules: "max:100",
    },
    {
      name: "registry_number",
      rules: "max:500",
    },
    {
      name: "country",
      rules: "max:50",
    },
    {
      name: "company",
      rules: "max:150",
    },
    {
      name: "package_form",
      rules: "max:500",
    },
    {
      name: "concentration",
      rules: "max:500",
    },
    {
      name: "substances",
      rules: "max:500",
    },
  ];

  const listFieldGeneral: IFieldCustomize[] = useMemo(
    () => [
      {
        label: `Tên ${isDrug ? "thuốc" : "sản phẩm"}`,
        placeholder: `Nhập tên ${isDrug ? "thuốc" : "sản phẩm"}`,
        name: "name",
        type: "text",
        required: true,
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Tên viết tắt",
        placeholder: "Nhập tên viết tắt",
        name: "short_name",
        type: "text",
      },
       {
        label: "Mã sản phẩm",
        placeholder: "Nhập mã sản phẩm",
        name: "drug_code",
        type: "text",
        required: true,
      },
      {
        label: `Nhóm ${isDrug ? "thuốc" : "sản phẩm"}`,
        name: "drug_group_id",
        type: "select",
        options: listGroup,
        onMenuOpen: onSelectOpenGroup,
        isLoading: isLoadingGroup,
      },
      {
        label: `Danh mục ${isDrug ? "thuốc" : "sản phẩm"}`,
        name: "drug_category_id",
        type: "select",
        options: listCategory,
        onMenuOpen: onSelectOpenCategory,
        isLoading: isLoadingCategory,
      },
      {
        label: "Đơn vị nhỏ nhất",
        name: "unit_id",
        type: "select",
        required: true,
        options: listUnit,
        onMenuOpen: onSelectOpenUnit,
        isLoading: isLoadingUnit,
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Giá bán đơn vị nhỏ nhất",
        placeholder: "",
        name: "current_cost",
        type: "number",
        currency: "VND",
        suffixes: "₫",
        required: true,
      },
    ],
    [
      listGroup,
      listCategory,
      isLoadingGroup,
      isLoadingCategory,
      listUnit,
      isLoadingUnit,
      dataDrug,
      drugMasterData,
      formData,
    ]
  );

  const listFieldExtra: IFieldCustomize[] = useMemo(
    () => [
      {
        label: `Mã vạch ${isDrug ? "thuốc" : "sản phẩm"}`,
        placeholder: `Nhập mã vạch ${isDrug ? "thuốc" : "sản phẩm"}`,
        name: "barcode",
        type: "text",
      },
      {
        label: "Số đăng ký",
        placeholder: `Nhập số đăng ký`,
        name: "registry_number",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Nước sản xuất",
        placeholder: `Nhập nước sản xuất`,
        name: "country",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Hãng sản xuất",
        placeholder: `Nhập hãng sản xuất`,
        name: "company",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Quy cách đóng gói",
        placeholder: `Nhập quy cách đóng gói`,
        name: "package_form",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Hàm lượng",
        placeholder: `Nhập hàm lượng`,
        name: "concentration",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
      {
        label: "Hoạt chất",
        placeholder: `Nhập hoạt chất`,
        name: "substances",
        type: "text",
        disabled: (drugMasterData && formData?.values?.is_master_data) || dataDrug?.is_master_data,
      },
    ],
    [
      listGroup,
      listCategory,
      isLoadingGroup,
      isLoadingCategory,
      listUnit,
      isLoadingUnit,
      dataDrug,
      drugMasterData,
      formData,
    ]
  );

  const handleImageUpload = (e) => {
    if (e.target.files[0] !== null && e.target.files.length > 0) {
      const maxSize = 1048576;
      if (e.target.files[0].size > maxSize) {
        showToast(`Ảnh ${isDrug ? "thuốc" : "sản phẩm"} giới hạn dung lượng không quá 2Mb`, "error");
        e.target.value = "";
      } else {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        handleUpdate({ ...formData, values: { ...formData.values, image_file: e.target.files[0] } });
      }
    }
  };

  useEffect(() => {
    if (dataDrug?.units?.find((unit) => unit.is_basic === "yes")?.unit_id) {
      const field = listFieldGeneral.find((field) => field.name === "unit_id");
      handleChangeValidate(formData?.values?.unit_id, field, formData, validations, listFieldGeneral, handleUpdate);
      if (!listUnit || listUnit.length === 0) {
        onSelectOpenUnit();
      }
    }
    if (dataDrug?.drug_group_id) {
      const field = listFieldGeneral.find((field) => field.name === "drug_group_id");
      handleChangeValidate(dataDrug?.drug_group_id, field, formData, validations, listFieldGeneral, handleUpdate);
      if (!listGroup || listGroup.length === 0) {
        onSelectOpenGroup();
      }
    }
    if (dataDrug?.drug_category_id) {
      const field = listFieldGeneral.find((field) => field.name === "drug_category_id");
      handleChangeValidate(dataDrug?.drug_category_id, field, formData, validations, listFieldGeneral, handleUpdate);
      if (!listCategory || listCategory.length === 0) {
        onSelectOpenCategory();
      }
    }
  }, [dataDrug]);

  // Add event call from parent
  useEffect(() => {
    handleSubmit.current = handleSubmitForm;
  }, [formData]);

  const handleSubmitForm = useCallback(() => {
    const errors = Validate(validations, formData, [...listFieldGeneral, ...listFieldExtra]);
    if (errors && Object.keys(errors).length > 0 ) {
      errorBridge.push(errors)
      handleUpdate({ ...formData, errors: errors });
      return true;
    } 

    return false;
  }, [formData]);

  return (
    <Fragment>
      <div className="info-general">
        <div className="info-general__main">
          <div className="drug-image">
            {formData?.values?.image || formData?.values?.image_file ? (
              <Fragment>
                {imagePreview && formData?.values?.image_file ? (
                  <img src={imagePreview} alt={formData?.values?.name} />
                ) : (
                  <img
                    src={formData?.values?.image}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = NoImage;
                    }}
                    alt={formData?.values?.name}
                  />
                )}
                <span className="actions">
                  <span className="btn-change-image" onClick={() => refInputUpload.current.click()}>
                    Chọn ảnh khác
                  </span>
                  |
                  <Button
                    type="button"
                    className="btn-remove-image"
                    color="link"
                    onClick={(e) => {
                      e.preventDefault();
                      setImagePreview("");
                      handleUpdate({ ...formData, values: { ...formData.values, image: "", image_file: "" } });
                    }}
                  >
                    Xóa
                  </Button>
                </span>
              </Fragment>
            ) : (
              <label
                htmlFor="imageUpload"
                className={`btn-upload-image${formData?.values?.image ? " has-image" : ""}`}
                onClick={(e) => (formData?.values?.image ? e.preventDefault() : undefined)}
              >
                <span>
                  <Icon name="Plus" />
                  Tải ảnh lên
                </span>
              </label>
            )}
            <input
              type="file"
              accept="image/gif,image/jpeg,image/png,image/jpg"
              className="d-none"
              id="imageUpload"
              onChange={(e) => handleImageUpload(e)}
              ref={refInputUpload}
            />
          </div>
          <div className="drug-info">
            {drugMasterData && formData?.values?.is_master_data ? (
              <p className="drug-master-data-code">
                Mã thuốc DQG: <strong>{drugMasterData.drug_code}</strong>
              </p>
            ) : null}
            <div className="list-form-group">
              {listFieldGeneral.map((field, index) => (
                <FieldCustomize
                  field={field}
                  key={index}
                  handleUpdate={(value) =>
                    handleChangeValidate(value, field, formData, validations, listFieldGeneral, handleUpdate)
                  }
                  formData={formData}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          type="button"
          color="link"
          hasIcon={true}
          onClick={() => setShowExtraInfo(!showExtraInfo)}
          className="btn-show-extra"
        >
          <Icon name={showExtraInfo ? "CaretDown" : "CaretRight"} />
          Thông tin chi tiết
        </Button>
        {showExtraInfo && (
          <div className="info-general__extra">
            <div className="list-form-group">
              {listFieldExtra.map((field, index) => (
                <FieldCustomize
                  field={field}
                  key={index}
                  handleUpdate={(value) =>
                    handleChangeValidate(value, field, formData, validations, listFieldGeneral, handleUpdate)
                  }
                  formData={formData}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
