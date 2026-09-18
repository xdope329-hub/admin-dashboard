import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { Col, Input, Label, Row } from "reactstrap";
import { dateFormat, safeDateRange, toValidDate } from "../../../utils/customFunctions/DateFormat";
import useOutsideDropdown from "../../../utils/hooks/customHooks/useOutsideDropdown";
import CheckBoxField from "../../inputFields/CheckBoxField";
import { useTranslation } from "react-i18next";

const ProductDateRangePicker = ({ values, setFieldValue }) => {
  const { t } = useTranslation("common");
  const { ref, isComponentVisible, setIsComponentVisible } = useOutsideDropdown();

  // react-date-range needs real Date objects. The saved values arrive as ISO
  // strings (or null for a product that has never had a sale window), both of
  // which used to crash <Month> with "RangeError: Invalid time value".
  const [state, setState] = useState(() => safeDateRange(values["sale_starts_at"], values["sale_expired_at"]));

  // Product data loads after mount on the edit page — adopt saved dates when
  // they arrive, without fighting the user's own selection.
  useEffect(() => {
    const start = toValidDate(values["sale_starts_at"]);
    const end = toValidDate(values["sale_expired_at"]);
    if (!start && !end) return;
    setState((prev) => {
      const next = safeDateRange(start || prev[0].startDate, end || start || prev[0].endDate);
      const same = prev[0].startDate?.getTime() === next[0].startDate.getTime() && prev[0].endDate?.getTime() === next[0].endDate.getTime();
      return same ? prev : next;
    });
  }, [values["sale_starts_at"], values["sale_expired_at"]]);

  // Write every selection straight back to the form. The previous version only
  // synced when start and end matched, so picking an actual range silently
  // never updated the product.
  const handleSelect = (item) => {
    const selection = item?.selection || {};
    const start = toValidDate(selection.startDate) || new Date();
    const rawEnd = toValidDate(selection.endDate);
    const isCompleteRange = Boolean(rawEnd) && rawEnd.getTime() > start.getTime();

    setState(safeDateRange(start, rawEnd || start));
    setFieldValue("sale_starts_at", start);
    // A single-day click means the user has only picked the start yet — keep
    // the old behaviour of defaulting the end to the next day.
    setFieldValue("sale_expired_at", isCompleteRange ? rawEnd : addDays(start, 1));

    // Close once a full range is chosen so the value is visible immediately.
    if (isCompleteRange) setIsComponentVisible("");
  };

  const renderPicker = () => <DateRange onChange={handleSelect} showSelectionPreview={true} moveRangeOnFirstSelection={false} definedRangesWrapper={false} months={2} ranges={state} direction="horizontal" />;

  return (
    <>
      <CheckBoxField name="is_sale_enable" title="SaleStatus" />
      <div className="input-error" ref={ref}>
        <Row className="mb-4 align-items-center g-md-4 g-2">
          <Col sm={3}>
            <Label className="col-form-label form-label-title">{t("StartDate")}</Label>
          </Col>
          <Col sm={9} className="calender-box">
            <Input placeholder="YYYY-MM-DD" value={dateFormat(values["sale_starts_at"], true)} readOnly onClick={() => setIsComponentVisible((prev) => (prev != "startDate" ? "startDate" : ""))} />
            <div className="rdrDateRangePickerWrapper">{isComponentVisible == "startDate" && renderPicker()}</div>
          </Col>
        </Row>
      </div>
      <div className="input-error">
        <Row className="mb-4 align-items-center g-md-4 g-2">
          <Col sm={3}>
            <Label className="col-form-label form-label-title">{t("EndDate")}</Label>
          </Col>
          <Col sm={9} className="calender-box">
            <Input placeholder="YYYY-MM-DD" value={dateFormat(values["sale_expired_at"], true)} readOnly onClick={() => setIsComponentVisible((prev) => (prev != "endDate" ? "endDate" : ""))} />
            <div className="rdrDateRangePickerWrapper">{isComponentVisible == "endDate" && renderPicker()}</div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProductDateRangePicker;
