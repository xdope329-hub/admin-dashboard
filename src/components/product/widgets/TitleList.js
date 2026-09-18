import { ProductTabTitleListData } from "@/data/TabTitleList";

export const generateTitleList = (values) => {
  const filteredTabs = ProductTabTitleListData.filter((tab) => {
    if (tab.title === "Bundle") return values.type === "bundle";
    if (tab.title === "Variations") return values.type === "classified";
    if (values.product_type == "physical" && tab.title !== "Digital Product") return tab;
    if (values.product_type == "digital" && tab.title !== "Shipping") return tab;
    if (values.product_type == "external" && tab.title !== "Shipping" && tab.title !== "Digital Product") return tab;
    return false;
  });

  return filteredTabs;
};
