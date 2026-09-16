import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { ToastNotification } from "../../../utils/customFunctions/ToastNotification";

// Friendly labels for the fields the product form validates.
const FIELD_LABELS = {
  name: "Name",
  short_description: "Short Description",
  description: "Description",
  stock_status: "Stock Status",
  external_url: "External URL",
  sku: "SKU",
  quantity: "Stock Quantity",
  price: "Price",
  discount: "Discount",
  categories: "Categories",
  tax_id: "Tax",
  store_id: "Store",
  watermark_image_id: "Watermark Image",
  wholesale_prices: "Wholesale Prices",
  variations: "Variants",
};

// Flatten Formik's error object into human-readable entries, e.g.
//   "Price", "Categories", "Variant 2: Price, SKU"
export function flattenProductErrors(errors, t = (x) => x) {
  const out = [];
  Object.entries(errors || {}).forEach(([key, value]) => {
    if (value == null || value === false) return;
    const label = t(FIELD_LABELS[key] || key);
    if (key === "variations" && Array.isArray(value)) {
      value.forEach((varErr, i) => {
        if (!varErr || typeof varErr !== "object") return;
        const fields = Object.keys(varErr).map((k) => t(FIELD_LABELS[k] || k));
        if (fields.length) out.push(`${t("Variant")} ${i + 1}: ${fields.join(", ")}`);
      });
    } else if (typeof value === "string") {
      out.push(label);
    } else if (Array.isArray(value) || typeof value === "object") {
      out.push(label);
    }
  });
  return out;
}

/**
 * Renders nothing. Watches Formik submit attempts: when a submit is blocked
 * by validation, shows a toast naming the fields that need attention —
 * otherwise the only feedback is red text on a possibly hidden tab and the
 * form looks like it "did nothing".
 */
const ValidationErrorNotifier = () => {
  const { submitCount, isValid, isValidating, errors } = useFormikContext();
  const { t } = useTranslation("common");
  const lastNotified = useRef(0);

  useEffect(() => {
    // Formik reports an empty error bag briefly while validating; acting on
    // that window would swallow the toast.
    if (isValidating || submitCount === 0 || submitCount === lastNotified.current) return;
    lastNotified.current = submitCount;
    if (!isValid) {
      const fields = flattenProductErrors(errors, t);
      const shown = fields.slice(0, 6).join(" · ");
      const more = fields.length > 6 ? ` (+${fields.length - 6})` : "";
      ToastNotification("error", `${t("PleaseCompleteRequiredFields")}: ${shown}${more}`);
    }
  }, [submitCount, isValid, isValidating, errors]);

  return null;
};

export default ValidationErrorNotifier;
