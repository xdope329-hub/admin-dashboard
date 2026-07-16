import Image from "next/image";
import { useTranslation } from "react-i18next";
import { RiCheckLine, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Badge, Button, Card, CardBody } from "reactstrap";

// Visual card for a single preset. Presets are picked by look, so we lead
// with the thumbnail and reserve the actions to the footer.
const PresetCard = ({ preset, onApply, onEdit, onDelete, applying }) => {
  const { t } = useTranslation("common");
  const thumb = preset?.thumbnail?.original_url;

  const typeLabelKey = {
    both: "PresetTypeBoth",
    themeOption: "PresetTypeThemeOption",
    settings: "PresetTypeSettings",
  }[preset?.type] || "PresetTypeBoth";

  return (
    <Card className="preset-card h-100">
      <div
        className="preset-card-thumb"
        style={{
          position: "relative",
          height: 160,
          background: "#f5f5f7",
          overflow: "hidden",
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
        }}
      >
        {thumb ? (
          <Image src={thumb} alt={preset.name} fill sizes="320px" style={{ objectFit: "cover" }} unoptimized />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            {t("NoThumbnail")}
          </div>
        )}
      </div>
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="m-0">{preset.name}</h5>
          <Badge color="secondary" pill>{t(typeLabelKey)}</Badge>
        </div>
        {preset.description && (
          <p className="text-muted small mb-3" style={{ minHeight: 32 }}>
            {preset.description}
          </p>
        )}
        <div className="d-flex gap-2">
          <Button color="primary" size="sm" onClick={() => onApply(preset)} disabled={applying}>
            <RiCheckLine className="me-1" />
            {applying ? t("Applying") : t("Apply")}
          </Button>
          <Button color="light" size="sm" onClick={() => onEdit(preset)}>
            <RiEdit2Line />
          </Button>
          <Button color="light" size="sm" onClick={() => onDelete(preset)}>
            <RiDeleteBin6Line />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PresetCard;
