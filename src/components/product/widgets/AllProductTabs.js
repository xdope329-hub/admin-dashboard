import { Col, TabContent, TabPane } from "reactstrap";
import DigitalTab from "../DigitalTab";
import GeneralTab from "../GeneralTab";
import InventoryTab from "../InventoryTab";
import OptionsTab from "../OptionsTab";
import ProductImageTab from "../ProductImageTab";
import SeoTab from "../SeoTab";
import SetupTab from "../SetupTab";
import ShippingTaxTab from "../ShippingTaxTab";
import BundleTab from "../BundleTab";
import { generateTitleList } from "./TitleList";
import { useEffect } from "react";
import VariationsTab from "./variations/VariationsTab";

const TAB_COMPONENTS = {
  General: GeneralTab,
  "Product Images": ProductImageTab,
  Inventory: InventoryTab,
  Variations: VariationsTab,
  Bundle: BundleTab,
  "Digital Product": DigitalTab,
  Setup: SetupTab,
  SEO: SeoTab,
  Shipping: ShippingTaxTab,
  Status: OptionsTab,
};

const AllProductTabs = ({ setErrors, setTouched, values, setFieldValue, errors, updateId, activeTab, isSubmitting, setActiveTab, touched }) => {
  useEffect(() => {
    let productTabs = generateTitleList(values)
      .map((main) => main.inputs.filter((item) => errors[item] && touched[item]))
      .findIndex((innerArray) => Array.isArray(innerArray) && innerArray.some((item) => typeof item == "string"));

    if (productTabs !== -1 && activeTab !== productTabs + 1) {
      setActiveTab(String(productTabs + 1));
    }
  }, [isSubmitting]);

  const tabs = generateTitleList(values);
  return (
    <Col xl="7" lg="8">
      <TabContent activeTab={activeTab}>
        {tabs.map((tab, i) => {
          const Component = TAB_COMPONENTS[tab.title];
          if (!Component) return null;
          return (
            <TabPane key={tab.title} tabId={String(i + 1)}>
              <Component
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                updateId={updateId}
                setErrors={setErrors}
                setTouched={setTouched}
                touched={touched}
              />
            </TabPane>
          );
        })}
      </TabContent>
    </Col>
  );
};

export default AllProductTabs;
