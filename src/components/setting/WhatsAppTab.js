import CheckBoxField from "../inputFields/CheckBoxField";
import SimpleInputField from "../inputFields/SimpleInputField";
import { useTranslation } from "react-i18next";

/**
 * Storefront floating WhatsApp button.
 * Saved under settings.values.whatsapp and read by the storefront at runtime,
 * so the number can be changed here without a redeploy.
 */
const WhatsAppTab = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <CheckBoxField name={`[values][whatsapp][status]`} title="ShowWhatsAppButton" helpertext={t("ShowWhatsAppButtonHelp")} />
      <SimpleInputField
        nameList={[
          {
            name: `[values][whatsapp][number]`,
            title: "WhatsAppNumber",
            placeholder: "+57 300 123 4567",
            helpertext: t("WhatsAppNumberHelp"),
          },
          {
            name: `[values][whatsapp][message]`,
            type: "textarea",
            rows: "3",
            title: "WhatsAppMessage",
            placeholder: t("WhatsAppMessagePlaceholder"),
            helpertext: t("WhatsAppMessageHelp"),
          },
        ]}
      />
    </>
  );
};

export default WhatsAppTab;
