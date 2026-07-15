import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownLine, RiCloseLine } from "react-icons/ri";
import { Col, Row } from "reactstrap";
import Btn from "@/elements/buttons/Btn";
import { getHelperText } from "@/utils/customFunctions/getHelperText";
import CheckBoxField from "@/components/inputFields/CheckBoxField";
import FileUploadField from "@/components/inputFields/FileUploadField";
import SimpleInputField from "@/components/inputFields/SimpleInputField";
import SearchableSelectInput from "@/components/inputFields/SearchableSelectInput";
import ColorPickerField from "@/components/inputFields/ColorPickerField";
import CommonRedirect from "../../CommonRedirect";
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

const textPositionOptions = [
  { id: "left", name: "Left (default)" },
  { id: "center", name: "Center" },
  { id: "right", name: "Right" },
];

const HomeBannerTab = ({ values, setFieldValue, productData, categoryData, setSearch }) => {
  
  const { t } = useTranslation( "common");
  const [active, setActive] = useState();
  const removeBanners = (index) => {
    if (values["content"]["home_banner"]["banners"].length > 1) {
      let filterValue = values["content"]["home_banner"]["banners"].filter((item, i) => i !== index);
      setFieldValue("[content][home_banner][banners]", filterValue);
      filterValue?.forEach((elem, i) => {
        elem?.image_url && setFieldValue(`homeBannerImage${i}`, { original_url: elem?.image_url });
        elem?.image_url_mobile && setFieldValue(`homeBannerImageMobile${i}`, { original_url: elem?.image_url_mobile });
        elem?.redirect_link?.link_type && setFieldValue(`homeRedirectLinkType${i}`, elem?.redirect_link?.link_type);
        elem?.redirect_link?.link && setFieldValue(`homeRedirectLink${i}`, elem?.redirect_link?.link);
      });
    }
  };

  return (
    <>
      {<Btn className="btn-theme my-4" onClick={() => setFieldValue("[content][home_banner][banners]", [...values["content"]?.["home_banner"]["banners"], { title: "", description: "" }])} title="AddBanner" />}
      {values["content"]?.["home_banner"]?.["banners"]?.map((elem, index) => {
        return (
          <Row className="align-items-center" key={index}>
            <Col xs="11">
              <div className="shipping-accordion-custom">
                <div className="p-3 rule-dropdown d-flex justify-content-between" onClick={() => setActive((prev) => prev !== index && index)}>
                  {t("Banner") + " " + (index + 1)}
                  <RiArrowDownLine />
                </div>
                {active == index && (
                  <div className="rule-edit-form">
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`homeBannerImage${index}`} title="Image" id={`homeBannerImage${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`homeBannerImage${index}`]} helpertext={getHelperText("376x231px")} />
                    <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name={`homeBannerImageMobile${index}`} title="Image (Mobile)" id={`homeBannerImageMobile${index}`} type="file" values={values} setFieldValue={setFieldValue} showImage={values[`homeBannerImageMobile${index}`]} helpertext={getHelperText("Optional — used on screens < 768px")} />
                    <SimpleInputField nameList={[
                      { name: `[content][home_banner][banners][${index}][subtitle]`, title: "Subtitle", placeholder: "Subtitle" },
                      { name: `[content][home_banner][banners][${index}][subtitle_mobile]`, title: "Subtitle (Mobile)", placeholder: "Optional — mobile subtitle" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][home_banner][banners][${index}][subtitle_font_family]`, values?.content?.home_banner?.banners?.[index]?.subtitle_font_family, setFieldValue, `homeBannerSubtitleFont${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][home_banner][banners][${index}][subtitle_font_size]`, title: "Subtitle Font Size (px)", placeholder: "e.g. 20", type: "number" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][home_banner][banners][${index}][subtitle_font_family_mobile]`, values?.content?.home_banner?.banners?.[index]?.subtitle_font_family_mobile, setFieldValue, `homeBannerSubtitleFontMobile${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][home_banner][banners][${index}][subtitle_font_size_mobile]`, title: "Subtitle Font Size Mobile (px)", placeholder: "e.g. 14", type: "number" },
                      { name: `[content][home_banner][banners][${index}][title]`, title: "Title", placeholder: "Title" },
                      { name: `[content][home_banner][banners][${index}][title_mobile]`, title: "Title (Mobile)", placeholder: "Optional — mobile title" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][home_banner][banners][${index}][title_font_family]`, values?.content?.home_banner?.banners?.[index]?.title_font_family, setFieldValue, `homeBannerTitleFont${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][home_banner][banners][${index}][title_font_size]`, title: "Title Font Size (px)", placeholder: "e.g. 48", type: "number" },
                    ]} />
                    <SearchableSelectInput nameList={[fontSelect(`[content][home_banner][banners][${index}][title_font_family_mobile]`, values?.content?.home_banner?.banners?.[index]?.title_font_family_mobile, setFieldValue, `homeBannerTitleFontMobile${index}`)]} />
                    <SimpleInputField nameList={[
                      { name: `[content][home_banner][banners][${index}][title_font_size_mobile]`, title: "Title Font Size Mobile (px)", placeholder: "e.g. 28", type: "number" },
                      { name: `[content][home_banner][banners][${index}][button_text]`, title: "Button Text", placeholder: "Shop Now" },
                    ]} />
                    <SearchableSelectInput nameList={[{
                      name: `[content][home_banner][banners][${index}][text_position]`,
                      title: "Text Position",
                      inputprops: {
                        name: `[content][home_banner][banners][${index}][text_position]`,
                        id: `homeBannerTextPosition${index}`,
                        options: textPositionOptions,
                        value: textPositionOptions.find(o => o.id === values?.content?.home_banner?.banners?.[index]?.text_position)?.name || "",
                        close: true,
                      },
                      store: "obj",
                      setvalue: (name, value) => setFieldValue(`[content][home_banner][banners][${index}][text_position]`, value?.id ?? ""),
                    }]} />
                    <ColorPickerField
                      name={`[content][home_banner][banners][${index}][text_color]`}
                      title="Text Color"
                      value={values?.content?.home_banner?.banners?.[index]?.text_color}
                      setFieldValue={setFieldValue}
                    />
                    <CheckBoxField name={`[content][home_banner][banners][${index}][text_bg]`} title="Dark Text Background" />
                    <CommonRedirect values={values} setFieldValue={setFieldValue} productData={productData} categoryData={categoryData} nameList={{ selectNameKey: `homeRedirectLinkType${index}`, multipleNameKey: `homeRedirectLink${index}` }} setSearch={setSearch} />
                    <CheckBoxField name={`[content][home_banner][banners][${index}][status]`} title="Status" />
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

export default HomeBannerTab;
