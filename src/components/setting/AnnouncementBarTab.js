import { useTranslation } from "react-i18next";
import { RiAddLine, RiArrowDownLine, RiArrowUpLine, RiDeleteBinLine } from "react-icons/ri";
import { Col, Input, Row } from "reactstrap";
import Btn from "../../elements/buttons/Btn";
import CheckBoxField from "../inputFields/CheckBoxField";
import ColorPickerField from "../inputFields/ColorPickerField";
import SimpleInputField from "../inputFields/SimpleInputField";

/**
 * Cinta de anuncios de la tienda (estilo koaj.co): una tira que se desplaza
 * en la parte superior del storefront con mensajes informativos, p. ej.
 * "Envío gratis después de $200.000 en compras".
 *
 * Se guarda en settings.values.announcement_bar y el storefront la lee en
 * caliente, así que los mensajes se cambian sin redesplegar.
 */
const AnnouncementBarTab = ({ values, setFieldValue }) => {
  const { t } = useTranslation("common");
  const bar = values?.values?.announcement_bar || {};
  const messages = Array.isArray(bar.messages) ? bar.messages : [];
  const path = "[values][announcement_bar]";

  const setMessages = (next) => setFieldValue(`${path}[messages]`, next);
  const addMessage = () => setMessages([...messages, { text: "", status: true }]);
  const removeMessage = (i) => setMessages(messages.filter((_, idx) => idx !== i));
  const moveMessage = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= messages.length) return;
    const next = [...messages];
    [next[i], next[j]] = [next[j], next[i]];
    setMessages(next);
  };

  return (
    <>
      <CheckBoxField name={`${path}[status]`} title="ShowAnnouncementBar" helpertext={t("ShowAnnouncementBarHelp")} />

      <div className="mb-3">
        <label className="col-form-label form-label-title">{t("AnnouncementMessages")}</label>
        <p className="help-text mb-2">{t("AnnouncementMessagesHelp")}</p>
        {messages.length === 0 && <p className="text-muted small mb-2">{t("NoAnnouncementMessages")}</p>}
        {messages.map((msg, i) => (
          <Row key={i} className="g-2 mb-2 align-items-center">
            <Col>
              <Input
                type="text"
                value={msg?.text ?? ""}
                placeholder={t("AnnouncementMessagePlaceholder")}
                onChange={(e) => setFieldValue(`${path}[messages][${i}][text]`, e.target.value)}
              />
            </Col>
            <Col xs="auto" className="d-flex align-items-center gap-2">
              {/* Interruptor por mensaje: apagarlo lo saca de la cinta sin borrarlo */}
              <label className="switch mb-0" title={t("EnableDisableMessage")}>
                <input
                  type="checkbox"
                  checked={Boolean(msg?.status)}
                  onChange={(e) => setFieldValue(`${path}[messages][${i}][status]`, e.target.checked)}
                />
                <span className="switch-state"></span>
              </label>
              <a className="btn btn-sm p-1" title={t("MoveUp")} onClick={() => moveMessage(i, -1)}><RiArrowUpLine /></a>
              <a className="btn btn-sm p-1" title={t("MoveDown")} onClick={() => moveMessage(i, 1)}><RiArrowDownLine /></a>
              <a className="btn btn-sm p-1 text-danger" title={t("Delete")} onClick={() => removeMessage(i)}><RiDeleteBinLine /></a>
            </Col>
          </Row>
        ))}
        <Btn className="btn-outline btn-sm mt-1" type="button" onClick={addMessage}>
          <RiAddLine className="me-1" /> {t("AddMessage")}
        </Btn>
      </div>

      <ColorPickerField
        name={`${path}[bg_color]`}
        title="AnnouncementBgColor"
        value={bar.bg_color}
        setFieldValue={setFieldValue}
      />
      <p className="help-text mb-3">{t("AnnouncementBgColorHelp")}</p>
      <ColorPickerField
        name={`${path}[text_color]`}
        title="AnnouncementTextColor"
        value={bar.text_color}
        setFieldValue={setFieldValue}
      />

      <SimpleInputField
        nameList={[
          {
            name: `${path}[speed]`,
            type: "number",
            title: "AnnouncementSpeed",
            placeholder: "30",
            helpertext: t("AnnouncementSpeedHelp"),
          },
        ]}
      />
    </>
  );
};

export default AnnouncementBarTab;
