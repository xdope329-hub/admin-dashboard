import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";

/**
 * Flatten Formik's nested error object into readable field paths, e.g.
 *   { values: { general: { site_title: "required" } } } -> ["site_title"]
 */
export function flattenFormErrors(errors, prefix = "") {
  const out = [];
  Object.entries(errors || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push(path);
    } else if (Array.isArray(value)) {
      value.forEach((entry, i) => out.push(...flattenFormErrors(entry, `${path}[${i + 1}]`)));
    } else if (typeof value === "object") {
      out.push(...flattenFormErrors(value, path));
    }
  });
  return out;
}

/** "values.general.site_title" -> "Site Title" */
export function humanizeFieldPath(path) {
  const last = String(path).split(".").pop().replace(/\[\d+\]$/, "");
  return last
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Renders nothing. When a submit is blocked by validation it raises a toast
 * naming the offending fields — otherwise the only feedback is red text on a
 * tab the user may not even have open, and the Save button looks broken.
 */
const FormValidationNotifier = ({ labels = {} }) => {
  const { submitCount, isValid, isValidating, errors } = useFormikContext();
  const { t } = useTranslation("common");
  const lastNotified = useRef(0);

  useEffect(() => {
    // Wait for validation to settle: Formik briefly reports an empty error bag
    // mid-submit, and acting on that window skipped the toast entirely.
    if (isValidating || submitCount === 0 || submitCount === lastNotified.current) return;
    lastNotified.current = submitCount;
    if (!isValid) {
      const fields = flattenFormErrors(errors).map((path) => {
        const key = String(path).split(".").pop();
        return t(labels[path] || labels[key] || humanizeFieldPath(path));
      });
      const unique = Array.from(new Set(fields));
      const shown = unique.slice(0, 6).join(" · ");
      const more = unique.length > 6 ? ` (+${unique.length - 6})` : "";
      ToastNotification("error", `${t("PleaseCompleteRequiredFields")}: ${shown}${more}`);
    }
  }, [submitCount, isValid, isValidating, errors]);

  return null;
};

export default FormValidationNotifier;
