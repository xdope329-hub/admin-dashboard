import SimpleInputField from "@/components/inputFields/SimpleInputField";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownLine, RiCloseLine } from "react-icons/ri";
import { Col, Row } from "reactstrap";
import Btn from "@/elements/buttons/Btn";
import { getHelperText } from "@/utils/customFunctions/getHelperText";
import CheckBoxField from "@/components/inputFields/CheckBoxField";
import FileUploadField from "@/components/inputFields/FileUploadField";
import SearchableSelectInput from "@/components/inputFields/SearchableSelectInput";
import { mediaConfig } from "@/data/MediaConfig";
import { FontOptions } from "@/data/FontOptions";

const fontSelect = (path, current, setFieldValue, idBase) => ({
  name: path,
  title: "Font Family",
  inputprops: {
    name: path,
    id: idBase,
    options: FontOptions,
    value: FontOptions.find((o) => o.id === current)?.name || "",
    close: true,
  },
  store: "obj",
  setvalue: (_, value) => setFieldValue(path, value?.id ?? ""),
});

const ServicesTab = ({ values, setFieldValue}) => {
  
  const { t } = useTranslation( "common");
  const [active, setActive] = useState();
  const removeBanners = (index) => {
    if (values["content"]["services"]["banners"].length > 1) {
      let filterValue = values["content"]["services"]["banners"].filter((item, i) => i !== index);
      setFieldValue("[content][services][banners]", filterValue);
      filterValue?.forEach((elem, i) => {
        elem?.image_url && setFieldValue(`serviceBannerImage${i}`, { original_url: elem?.image_url });
        elem?.image_url_mobile && setFieldValue(`serviceBannerImageMobile${i}`, { original_url: elem?.image_url_mobile });
      });
    }
  };
  return (
    <>
      {<Btn className="btn-theme my-4" onClick={() => setFieldValue("[content][services][banners]", [...values["content"]?.["services"]["banners"], { title: "", description: "" }])} title="AddBanner" />}
      {values["content"]?.["services"]?.["banners"]?.map((elem, index) => {
        return (
          <Row className="align-items-center" key={index}>
            <Col xs="11">
              <div className="shipping-accordion-custom">
                <div className="p-3 rule-dropdown d-flex justify-content-between" onClick={() => setActive((prev) => prev !== index && index)}>
                  {t("Service") + " " + (index + 1)}
                  <RiArrowDownLine />
                </div>
                {active == index && (
                  <div className="rule-edit-form">
                    <SimpleInputField
                      nameList={[
                        { name: `[content][services][banners][${index}][title]`, placeholder: t("EnterTitle"), title: "Title" },
                        { name: `[content][services][banners][${index}][title_mobile]`, placeholder: "Optional — mobile title", title: "Title (Mobile)" },
                      ]}
                    />
                    <SearchableSelectInput nameList={[fontSelect(`[content][services][banners][${index}][title_font_family]`, values?.content?.services?.banners?.[index]?.title_font_family, setFieldValue, `serviceTitleFont${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][services][banners][${index}][title_font_size]`, title: "Title Font Size (px)", placeholder: "e.g. 20", type: "number" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][services][banners][${index}][title_font_family_mobile]`, values?.content?.services?.banners?.[index]?.title_font_family_mobile, setFieldValue, `serviceTitleFontMobile${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][services][banners][${index}][title_font_size_mobile]`, title: "Title Font Size Mobile (px)", placeholder: "e.g. 16", type: "number" },
                      { name: `[content][services][banners][${index}][description]`, placeholder: t("EnterDescription"), title: "Description", type: "textarea" },
                      { name: `[content][services][banners][${index}][description_mobile]`, placeholder: "Optional — mobile description", title: "Description (Mobile)", type: "textarea" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][services][banners][${index}][description_font_family]`, values?.content?.services?.banners?.[index]?.description_font_family, setFieldValue, `serviceDescFont${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][services][banners][${index}][description_font_size]`, title: "Description Font Size (px)", placeholder: "e.g. 14", type: "number" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][services][banners][${index}][description_font_family_mobile]`, values?.content?.services?.banners?.[index]?.description_font_family_mobile, setFieldValue, `serviceDescFontMobile${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][services][banners][${index}][description_font_size_mobile]`, title: "Description Font Size Mobile (px)", placeholder: "e.g. 12", type: "number" },
                    ]} />
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`serviceBannerImage${index}`} title="Image" id={`serviceBannerImage${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`serviceBannerImage${index}`]} helpertext={getHelperText("375x586px")} />
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`serviceBannerImageMobile${index}`} title="Image (Mobile)" id={`serviceBannerImageMobile${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`serviceBannerImageMobile${index}`]} helpertext={getHelperText("Optional — used on screens < 768px")} />
                    <CheckBoxField name={`[content][services][banners][${index}][status]`} title="Status" />
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

export default ServicesTab;
