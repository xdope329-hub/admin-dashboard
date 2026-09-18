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

  // ── Auto SKU / name for new variations ───────────────────────────────────────
  // Name = the variant label verbatim, e.g. "Blanco Marfil/S".
  // SKU  = <productname>_<label>,   e.g. "gatocurioso_Blanco Marfil/S"
  // (product name lowercased with spaces removed; label kept as-is).
  // Only fills EMPTY fields (never overwrites a manual or saved value), and
  // re-runs when the product name changes or variants are regenerated —
  // clearing the field by hand does not trigger an instant refill.
  // Build the label in the order the attributes were configured (Color first,
  // then Talla) — newId is alphabetically sorted, which would give "L/Negro".
  const variantLabel = (() => {
    if (!(Array.isArray(elem) && elem.length && elem.every((v) => v && v.value))) return "";
    const attrOrder = (values["combination"] || []).map((c) => c?.name?.id);
    return [...elem]
      .sort((a, b) => attrOrder.indexOf(a.attribute_id) - attrOrder.indexOf(b.attribute_id))
      .map((v) => v.value)
      .join("/");
  })();
  useEffect(() => {
    if (!variantLabel) return;
    const current = values["variations"]?.[index] || {};
    const productSlug = (values["name"] || "").trim().toLowerCase().replace(/\s+/g, "");
    // Fill only fields that were never set (undefined/null — i.e. a freshly
    // generated variation). A field the user cleared to "" is left alone.
    // Depends on the variations ARRAY identity: any regeneration replaces the
    // array, so this re-runs even when React batches the intermediate states.
    if (current.sku == null && productSlug) {
      setFieldValue(`variations[${index}][sku]`, `${productSlug}_${variantLabel}`);
    }
    if (current.name == null) {
      setFieldValue(`variations[${index}][name]`, variantLabel);
    }
  }, [values["name"], variantLabel, values["variations"]]);

  // ── Share images across same-color variations ────────────────────────────────
  // Photos are per color, not per size: "S / Negro" and "L / Negro" use the
  // same gallery. This copies this variation's images to every variation with
  // the same Color value (or to all variations when no Color attribute exists).
  const colorOf = (i) =>
    values["variation_options"]?.[i]?.filter(Boolean).find((o) => /col(o|ou)r/i.test(o?.name || ""))?.value;
  const myColor = colorOf(index);
  const imageTargets = (values["variations"] || [])
    .map((_, i) => i)
    .filter((i) => i !== index && (myColor ? colorOf(i) === myColor : true));

  const copyImagesToSiblings = () => {
    const source = values["variations"][index];
    const ids = source?.variation_images_id || [];
    if (!ids.length) return;
    const updated = values["variations"].map((v, i) =>
      imageTargets.includes(i)
        ? {
            ...v,
            variation_images_id: [...ids],
            variation_images: source.variation_images?.length ? [...source.variation_images] : v.variation_images,
          }
        : v
    );
    setFieldValue("variations", updated);
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
          {values["variations"]?.[index]?.["variation_images_id"]?.length > 0 && imageTargets.length > 0 && (
            <div className="mb-3 text-end">
              <button type="button" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={copyImagesToSiblings}>
                <RiFileCopyLine />
                {myColor
                  ? `${t("CopyImagesToSameColor")} (${myColor} · ${imageTargets.length})`
                  : `${t("CopyImagesToAllVariations")} (${imageTargets.length})`}
              </button>
            </div>
          )}

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
