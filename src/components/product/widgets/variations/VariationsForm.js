import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownSLine, RiFileCopyLine } from "react-icons/ri";
import allPossibleCases from "../../../../utils/customFunctions/AllPossibleCases";
import CheckBoxField from "../../../inputFields/CheckBoxField";
import FileUploadField from "../../../inputFields/FileUploadField";
import SearchableSelectInput from "../../../inputFields/SearchableSelectInput";
import SimpleInputField from "../../../inputFields/SimpleInputField";

const SHAREABLE_FIELDS = [
  { key: "price",        label: "Price" },
  { key: "discount",     label: "Discount" },
  { key: "quantity",     label: "Quantity" },
  { key: "sku",          label: "SKU" },
  { key: "stock_status", label: "Stock Status" },
];

const VariationsForm = ({ values, setFieldValue, newId, index, elem, errors, updateId }) => {
  useEffect(() => {
    if (values["variations"]?.[index]?.["is_licensable"] && values["variations"]?.[index]?.["digital_file_ids"]?.length) {
      setFieldValue(`variations[${index}]["is_licensekey_auto"]`, values[`variations`][index]["is_licensekey_auto"] ? values[`variations`][index]["is_licensekey_auto"] : false);
    }
  }, [values["variations"][index]?.["is_licensable"], values["variations"][index]?.["digital_file_ids"]?.length]);

  const { t } = useTranslation("common");
  const [active, setActive] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});

  useEffect(() => {
    setFieldValue(
      `variations[${index}][attribute_values]`,
      allPossibleCases(
        values["combination"]?.map((item) =>
          item?.values?.map((elem) => ({
            name: item.name?.name,
            value: item.name.attribute_values?.find((attr) => attr.id == elem)?.value,
          }))
        )
      )
    );
  }, [values["variation_options"]]);

  useEffect(() => {
    let priceValue, discountValue, salePriceValue;
    priceValue = values[`variations`][index]?.price || 0.0;
    discountValue = values[`variations`][index]?.discount || 0.0;
    salePriceValue = priceValue - (priceValue * discountValue) / 100;
    setFieldValue(`variations[${index}][sale_price]`, salePriceValue);
  }, [values[`variations`][index]?.price, values[`variations`][index]?.discount]);

  const toggleField = (key) => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyToAll = () => {
    const source = values["variations"][index];
    const updated = values["variations"].map((v, i) => {
      if (i === index) return v;
      const patch = {};
      SHAREABLE_FIELDS.forEach(({ key }) => {
        if (selectedFields[key]) patch[key] = source[key];
      });
      return { ...v, ...patch };
    });
    setFieldValue("variations", updated);
    setApplyOpen(false);
    setSelectedFields({});
  };

  return (
    <div className="shipping-accordion-custom" key={index}>
      <div className="p-3 rule-dropdown d-flex justify-content-between" onClick={() => setActive((prev) => prev !== index ? index : null)}>
        {newId}
        <RiArrowDownSLine />
      </div>
      {active === index && (
        <div className="rule-edit-form">
          <SimpleInputField
            nameList={[
              { name: `variations[${index}][name]`, title: "name", placeholder: "Enter Name", require: "true", errormsg: "Name" },
              { name: `variations[${index}][price]`, title: "price", type: "number", placeholder: "Enter Price", require: "true", inputaddon: "true", errormsg: "Price", min: "0" },
              { name: `variations[${index}][discount]`, title: "discount", type: "number", min: "0", max: "100", inputaddon: "true", placeholder: "Enter Discount", postprefix: "%" },
              { name: `variations[${index}][sale_price]`, title: "Sale Price", type: "number", inputaddon: "true", placeholder: "0.00", readOnly: true },
              { name: `variations[${index}][quantity]`, title: "Stock Quantity", type: "number", require: "true", errormsg: "Quantity", placeholder: "Enter Quantity" },
              { name: `variations[${index}][sku]`, title: "sku", require: "true", placeholder: "Enter SKU", errormsg: "SKU" },
            ]}
          />
          <SearchableSelectInput
            nameList={[
              {
                name: `variations[${index}][stock_status]`,
                require: "true",
                inputprops: {
                  name: `variations[${index}][stock_status]`,
                  id: `variations[${index}][stock_status]`,
                  options: [
                    { id: "in_stock", name: "InStock" },
                    { id: "out_of_stock", name: "OutOfStock" },
                  ],
                },
                title: "StockStatus",
              },
            ]}
          />

          <FileUploadField multiple={true} name={`variations[${index}][variation_images_id]`} id={`variations[${index}][variation_images_id]`} uniquename={values[`variations`][index]["variation_images"]?.length ? values[`variations`][index]["variation_images"] : undefined} type="file" values={values} setFieldValue={setFieldValue} title="Images" />

          {values.product_type == "digital" ? (
            <>
              <FileUploadField multiple={true} name={`variations[${index}][digital_file_ids]`} id={`variations[${index}][digital_file_ids]`} uniquename={values[`variations`][index]["digital_files"]} type="file" values={values} setFieldValue={setFieldValue} title="Upload Main Files" />
              <CheckBoxField name={`variations[${index}][is_licensable]`} title="Licensable" />
              {values["variations"][index]["is_licensable"] ? (
                <>
                  {values["variations"][index]["digital_file_ids"]?.length > 0 ? <CheckBoxField name={`variations[${index}][is_licensekey_auto]`} title="License Key Auto" /> : null}
                  {!values["variations"][index]["is_licensekey_auto"] ? (
                    <>
                      <SearchableSelectInput
                        nameList={[
                          {
                            name: `variations[${index}][separator]`,
                            title: "Separator",
                            inputprops: {
                              name: `variations[${index}][separator]`,
                              id: "separator",
                              options: [
                                { id: "comma", name: "Comma ( , )" },
                                { id: "semicolon", name: "Semicolon ( ; )" },
                                { id: "pipe", name: "Pipe ( | )" },
                              ],
                            },
                          },
                        ]}
                      />
                      <SimpleInputField nameList={[{ name: `variations[${index}][license_keys]`, title: "License Key", type: "textarea", rows: "3", placeholder: t("License Key") }]} />
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          <CheckBoxField name={`variations[${index}][status]`} title="status" require="true" />

          {/* Apply to all panel — only shown when there are multiple variations */}
          {values["variations"]?.length > 1 && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px dashed #dee2e6' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => setApplyOpen((p) => !p)}
              >
                <RiFileCopyLine /> {t("ApplyToAll") || "Apply to all variations"}
              </button>

              {applyOpen && (
                <div className="mt-2 p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
                  <p className="mb-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                    {t("SelectFieldsToCopy") || "Select fields to copy from this variation:"}
                  </p>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {SHAREABLE_FIELDS.map(({ key, label }) => (
                      <label key={key} className="d-flex align-items-center gap-1" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="checkbox"
                          checked={!!selectedFields[key]}
                          onChange={() => toggleField(key)}
                        />
                        {t(label) || label}
                        <span className="text-muted ms-1">
                          ({values["variations"][index]?.[key] ?? "—"})
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      disabled={!Object.values(selectedFields).some(Boolean)}
                      onClick={applyToAll}
                    >
                      {t("Apply") || "Apply"}
                    </button>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => setApplyOpen(false)}>
                      {t("Cancel") || "Cancel"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariationsForm;
