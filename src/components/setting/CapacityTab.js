import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";
import request from "../../utils/axiosUtils";
import useCustomQuery from "../../utils/hooks/useCustomQuery";
import CheckBoxField from "../inputFields/CheckBoxField";
import SimpleInputField from "../inputFields/SimpleInputField";

/**
 * Capacidad diaria de producción. XDOPE produce bajo pedido: aquí se define
 * cuántas unidades (o pedidos) se atienden por día. Cuando el cupo de hoy se
 * llena, la tienda oculta el carrito y el checkout y solo ofrece WhatsApp
 * para coordinar el pedido; el API además rechaza cualquier pedido extra.
 * Se guarda en settings.values.capacity y se lee en caliente.
 */
const CapacityTab = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { values, setFieldValue } = useFormikContext();
  const path = "[values][capacity]";
  const mode = values?.values?.capacity?.mode === "orders" ? "orders" : "units";

  // Uso de hoy, calculado por el API (GET /capacity) con el mismo criterio
  // que aplica la tienda.
  const { data: today } = useCustomQuery(["capacity-today"], () => request({ url: "/capacity" }, router), {
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  const unit = (n) => (mode === "orders" ? t(n === 1 ? "CapacityOrderSingular" : "CapacityOrderPlural") : t(n === 1 ? "CapacityUnitSingular" : "CapacityUnitPlural"));

  return (
    <>
      <CheckBoxField name={`${path}[status]`} title="CapacityEnable" helpertext={t("CapacityEnableHelp")} />

      <SimpleInputField
        nameList={[
          {
            name: `${path}[daily_limit]`,
            type: "number",
            title: "CapacityDailyLimit",
            placeholder: "4",
            helpertext: t("CapacityDailyLimitHelp"),
          },
        ]}
      />

      <div className="mb-3">
        <label className="col-form-label form-label-title">{t("CapacityMode")}</label>
        <Input type="select" value={mode} onChange={(e) => setFieldValue(`${path}[mode]`, e.target.value)}>
          <option value="units">{t("CapacityModeUnits")}</option>
          <option value="orders">{t("CapacityModeOrders")}</option>
        </Input>
        <p className="help-text mb-0">{t("CapacityModeHelp")}</p>
      </div>

      <SimpleInputField
        nameList={[
          {
            name: `${path}[whatsapp_message]`,
            type: "textarea",
            rows: "3",
            title: "CapacityWhatsAppMessage",
            placeholder: t("CapacityWhatsAppMessagePlaceholder"),
            helpertext: t("CapacityWhatsAppMessageHelp"),
          },
        ]}
      />

      {today && (
        <div className={`alert ${today.enabled ? (today.reached ? "alert-danger" : "alert-info") : "alert-secondary"} mb-0`} role="status">
          <strong>{t("CapacityToday")}: </strong>
          {!today.enabled && t("CapacityTodayDisabled")}
          {today.enabled && today.reached && `${today.used} ${unit(today.used)}. ${t("CapacityTodayReached")}`}
          {today.enabled && !today.reached && `${today.used} ${t("CapacityOf")} ${today.daily_limit} ${unit(today.daily_limit)} · ${t("CapacityRemaining")} ${today.remaining}`}
        </div>
      )}
    </>
  );
};

export default CapacityTab;
