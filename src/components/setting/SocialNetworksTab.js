import { useTranslation } from "react-i18next";
import SimpleInputField from "../inputFields/SimpleInputField";

/**
 * Site-wide social profiles, saved under settings.values.social.
 * These feed the storefront wherever social links appear (contact page,
 * footer, etc.) and are independent of the selected theme or footer style —
 * changing themes never touches them.
 */
const SocialNetworksTab = () => {
  const { t } = useTranslation("common");
  return (
    <SimpleInputField
      nameList={[
        { name: `[values][social][facebook]`, title: "Facebook", placeholder: "https://facebook.com/xdope" },
        { name: `[values][social][instagram]`, title: "Instagram", placeholder: "https://www.instagram.com/xdope276" },
        { name: `[values][social][twitter]`, title: "Twitter", placeholder: "https://x.com/xdope" },
        { name: `[values][social][pinterest]`, title: "Pinterest", placeholder: "https://pinterest.com/xdope" },
      ]}
    />
  );
};

export default SocialNetworksTab;
