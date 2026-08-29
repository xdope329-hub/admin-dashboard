import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import Btn from "../../elements/buttons/Btn";
import request from "../../utils/axiosUtils";
import { shipping } from "../../utils/axiosUtils/API";
import SuccessHandle from "../../utils/customFunctions/SuccessHandle";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";
import useCustomMutation from "@/utils/hooks/useCustomMutation";
import SimpleInputField from "../inputFields/SimpleInputField";

/**
 * Tarifas de envío por zonas (Colombia):
 *   Zona 1 — ciudades principales y áreas metropolitanas
 *   Zona 2 — resto del país (incluye "Otra ciudad")
 * Más el umbral de envío gratis (0 = nunca gratis).
 * Guarda en el documento Shipping (PUT /shipping/:id); el checkout del
 * storefront usa estos valores en el siguiente pedido, sin redeploy.
 */
const DEFAULTS = { zone1: 9900, zone2: 14900, threshold: 200000 };

const ShippingZonesForm = ({ shippingData, refetch }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const zoneAmount = (zone, fallback) => {
    const z = shippingData?.zones?.find((x) => Number(x.zone) === zone);
    return z?.amount ?? fallback;
  };

  const { mutate, isLoading } = useCustomMutation(
    (data) => request({ url: `${shipping}/${shippingData?.id}`, method: "put", data }, router),
    {
      onSuccess: (resData) => {
        SuccessHandle(resData, false, false, t("ShippingZonesSaved"));
        refetch && refetch();
      },
      onError: () => ToastNotification("error"),
    }
  );

  if (!shippingData?.id) return null;

  return (
    <div className="shipping-accordion-custom mb-4">
      <div className="rule-edit-form">
        <h4 className="mb-1">{t("ShippingZones")}</h4>
        <p className="text-muted mb-3" style={{ fontSize: "13px" }}>{t("ShippingZonesHelp")}</p>
        <Formik
          enableReinitialize
          initialValues={{
            zone1_amount: zoneAmount(1, DEFAULTS.zone1),
            zone2_amount: zoneAmount(2, DEFAULTS.zone2),
            free_shipping_threshold: shippingData?.free_shipping_threshold ?? DEFAULTS.threshold,
          }}
          onSubmit={(values) => {
            mutate({
              zones: [
                { zone: 1, name: "Zona 1 — Ciudades principales", amount: Number(values.zone1_amount) || 0 },
                { zone: 2, name: "Zona 2 — Resto del país", amount: Number(values.zone2_amount) || 0 },
              ],
              free_shipping_threshold: Number(values.free_shipping_threshold) || 0,
            });
          }}
        >
          {() => (
            <Form className="theme-form theme-form-2 mega-form">
              <Row>
                <SimpleInputField
                  nameList={[
                    { name: "zone1_amount", type: "number", min: "0", title: "Zone1Rate", placeholder: "9900", inputaddon: "true", require: "true", helpertext: t("Zone1RateHelp") },
                    { name: "zone2_amount", type: "number", min: "0", title: "Zone2Rate", placeholder: "14900", inputaddon: "true", require: "true", helpertext: t("Zone2RateHelp") },
                    { name: "free_shipping_threshold", type: "number", min: "0", title: "FreeShippingThreshold", placeholder: "200000", inputaddon: "true", helpertext: t("FreeShippingThresholdHelp") },
                  ]}
                />
              </Row>
              <Col className="text-end">
                <Btn className="btn-theme" type="submit" title="Save" loading={Number(isLoading)} disabled={isLoading} />
              </Col>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ShippingZonesForm;
