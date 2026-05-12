import { useTranslation } from "react-i18next";
import { FormGroup } from "reactstrap";
import Loader from "@/components/commonComponent/Loader";
import MultiSelectField from "@/components/inputFields/MultiSelectField";

const BrandTab = ({ values, setFieldValue, brandData, brandLoader }) => {
  const { t } = useTranslation("common");
  if (brandLoader) return <Loader />;

  // Read current visibility, defaulting to enabled. We accept legacy
  // `content.brand` shape too in case a previous save left it behind.
  const currentStatus = values?.content?.brands?.status ?? values?.content?.brand?.status ?? true;
  const isOn = currentStatus === true || currentStatus === 1 || currentStatus === "1";

  const handleToggle = (e) => {
    const next = e.target.checked;
    const existing = values?.content?.brands || values?.content?.brand || {};
    setFieldValue("content.brands", {
      title: existing.title || "Our Brands",
      brand_ids: existing.brand_ids || [],
      status: next,
    });
    // Strip legacy alias if it was carried in
    if (values?.content?.brand) setFieldValue("content.brand", undefined);
  };

  return (
    <>
      <MultiSelectField values={values} setFieldValue={setFieldValue} name="brandItems" title="Brand" data={brandData} />
      <FormGroup switch className="ps-0 form-switch custom-switch-flex form-check">
        <label className="form-label fw-semibold mb-1">{t("Status")}</label>
        <label className="switch">
          <input type="checkbox" checked={isOn} onChange={handleToggle} />
          <span className="switch-state"></span>
        </label>
        <p className="help-text mb-0">{isOn ? t("Visible") || "Visible on storefront" : t("Hidden") || "Hidden from storefront"}</p>
      </FormGroup>
    </>
  );
};
export default BrandTab;
