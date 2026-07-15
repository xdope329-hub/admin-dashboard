import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownLine, RiCloseLine } from "react-icons/ri";
import { Col, Row } from "reactstrap";
import Btn from "@/elements/buttons/Btn";
import { getHelperText } from "@/utils/customFunctions/getHelperText";
import CheckBoxField from "@/components/inputFields/CheckBoxField";
import FileUploadField from "@/components/inputFields/FileUploadField";
import CommonRedirect from "../../CommonRedirect";
import { mediaConfig } from "@/data/MediaConfig";

const SocialMediaTab = ({ values, setFieldValue, productData, categoryData, setSearch }) => {
  const { t } = useTranslation("common");
  const [active, setActive] = useState();
  const removeBanners = (index) => {
    const banners = values["content"]["social_media"]["banners"];
    if (banners.length <= 1) return;
    const filterValue = banners.filter((_, i) => i !== index);
    setFieldValue("[content][social_media][banners]", filterValue);
    // Re-index per-banner Formik fields using current values (not stale elem.image_url)
    let newIdx = 0;
    for (let oldIdx = 0; oldIdx < banners.length; oldIdx++) {
      if (oldIdx === index) continue;
      setFieldValue(`socialMediaBannerImage${newIdx}`, values[`socialMediaBannerImage${oldIdx}`] ?? null);
      setFieldValue(`socialMediaBannerImageMobile${newIdx}`, values[`socialMediaBannerImageMobile${oldIdx}`] ?? null);
      setFieldValue(`socialMediaRedirectLinkType${newIdx}`, values[`socialMediaRedirectLinkType${oldIdx}`] ?? "");
      setFieldValue(`socialMediaRedirectLink${newIdx}`, values[`socialMediaRedirectLink${oldIdx}`] ?? "");
      newIdx++;
    }
    // Clear the now-orphaned last slot
    setFieldValue(`socialMediaBannerImage${filterValue.length}`, null);
    setFieldValue(`socialMediaBannerImageMobile${filterValue.length}`, null);
    setFieldValue(`socialMediaRedirectLinkType${filterValue.length}`, "");
    setFieldValue(`socialMediaRedirectLink${filterValue.length}`, "");
  };

  return (
    <>
      {<Btn className="btn-theme my-4" onClick={() => setFieldValue("[content][social_media][banners]", [...values["content"]?.["social_media"]["banners"], { title: "", description: "", status: true }])} title="AddBanner" />}
      {values["content"]?.["social_media"]?.["banners"]?.map((elem, index) => {
        return (
          <Row className="align-items-center" key={index}>
            <Col xs="11">
              <div className="shipping-accordion-custom">
                <div className="p-3 rule-dropdown d-flex justify-content-between" onClick={() => setActive((prev) => prev !== index && index)}>
                  {t("SocialMedia") + " " + (index + 1)}
                  <RiArrowDownLine />
                </div>
                {active == index && (
                  <div className="rule-edit-form">
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`socialMediaBannerImage${index}`} title="Image" id={`socialMediaBannerImage${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`socialMediaBannerImage${index}`]} helpertext={getHelperText("375x586px")} />
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`socialMediaBannerImageMobile${index}`} title="Image (Mobile)" id={`socialMediaBannerImageMobile${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`socialMediaBannerImageMobile${index}`]} helpertext={getHelperText("Optional — used on screens < 768px")} />
                    <CommonRedirect values={values} setFieldValue={setFieldValue} productData={productData} categoryData={categoryData} nameList={{ selectNameKey: `socialMediaRedirectLinkType${index}`, multipleNameKey: `socialMediaRedirectLink${index}` }} setSearch={setSearch} />
                    <CheckBoxField name={`[content][social_media][banners][${index}][status]`} title="Status" />
                  </div>
                )}
              </div>
            </Col>
            <Col xs="1">
              <a className="h-100 w-100 cursor-pointer close-icon" onClick={() => removeBanners(index)}>
                <RiCloseLine />
              </a>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default SocialMediaTab;
