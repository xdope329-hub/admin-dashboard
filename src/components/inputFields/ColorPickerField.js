import { Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const ColorPickerField = ({ name, title, value, setFieldValue }) => {
  const { t } = useTranslation("common");
  return (
    <div className="input-error">
      <div className="mb-4 align-items-center row">
        <Col sm="3">
          <label className="col-form-label form-label-title">{t(title)}</label>
        </Col>
        <Col sm="9" className="d-flex align-items-center gap-2">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => setFieldValue(name, e.target.value)}
            className="form-control form-control-color"
            style={{ width: "60px", height: "38px", padding: "2px", cursor: "pointer" }}
          />
          {value && (
            <span
              className="cursor-pointer text-muted small"
              onClick={() => setFieldValue(name, "")}
            >
              Reset
            </span>
          )}
        </Col>
      </div>
    </div>
  );
};

export default ColorPickerField;
