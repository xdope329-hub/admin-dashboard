import { useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import { FashionOneFeatureBannerTitle } from "@/data/TabTitleList";
import { getHelperText } from "@/utils/customFunctions/getHelperText";
import CheckBoxField from "@/components/inputFields/CheckBoxField";
import FileUploadField from "@/components/inputFields/FileUploadField";
import SimpleInputField from "@/components/inputFields/SimpleInputField";
import SearchableSelectInput from "@/components/inputFields/SearchableSelectInput";
import ColorPickerField from "@/components/inputFields/ColorPickerField";
import TabTitle from "@/components/widgets/TabTitle";
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
    value: FontOptions.find((o) => o.id === current) ?.name || "",
    close: true,
  },
  store: "obj",
  setvalue: (_, value) => setFieldValue(path, value?.id ?? ""),
});

const textPositionOptions = [
  { id: 'left', name: 'Left (default)' },
  { id: 'right', name: 'Right' },
  { id: 'top-left', name: 'Top Left' },
  { id: 'top-right', name: 'Top Right' },
];

const OfferBannerTab = ({ values, setFieldValue, productData, categoryData, setSearch }) => {
  const [activeTab, setActiveTab] = useState("1");
  const setPosition = (bannerKey) => (name, value) => {
    setFieldValue(`[content][offer_banner][${bannerKey}][text_position]`, value?.id ?? '');
  };
  return (
    <div className="inside-horizontal-tabs">
      <TabTitle activeTab={activeTab} setActiveTab={setActiveTab} titleList={FashionOneFeatureBannerTitle} />
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="offerBanner1Image" title="Image" id="offerBanner1Image" showImage={values["offerBanner1Image"]} type="file" values={values} setFieldValue={setFieldValue} helpertext={getHelperText("806x670px")} />
          <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="offerBanner1ImageMobile" title="Image (Mobile)" id="offerBanner1ImageMobile" showImage={values["offerBanner1ImageMobile"]} type="file" values={values} setFieldValue={setFieldValue} helpertext={getHelperText("Optional — used on screens < 768px")} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_1][subtitle]", title: "Subtitle", placeholder: "Subtitle" },
            { name: "[content][offer_banner][banner_1][subtitle_mobile]", title: "Subtitle (Mobile)", placeholder: "Optional — mobile subtitle" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_1][subtitle_font_family]", values?.content?.offer_banner?.banner_1?.subtitle_font_family, setFieldValue, "offerBanner1SubtitleFont")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_1][subtitle_font_size]", title: "Subtitle Font Size (px)", placeholder: "e.g. 18", type: "number" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_1][subtitle_font_family_mobile]", values?.content?.offer_banner?.banner_1?.subtitle_font_family_mobile, setFieldValue, "offerBanner1SubtitleFontMobile")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_1][subtitle_font_size_mobile]", title: "Subtitle Font Size Mobile (px)", placeholder: "e.g. 14", type: "number" },
            { name: "[content][offer_banner][banner_1][title]", title: "Title", placeholder: "Title" },
            { name: "[content][offer_banner][banner_1][title_mobile]", title: "Title (Mobile)", placeholder: "Optional — mobile title" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_1][title_font_family]", values?.content?.offer_banner?.banner_1?.title_font_family, setFieldValue, "offerBanner1TitleFont")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_1][title_font_size]", title: "Title Font Size (px)", placeholder: "e.g. 32", type: "number" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_1][title_font_family_mobile]", values?.content?.offer_banner?.banner_1?.title_font_family_mobile, setFieldValue, "offerBanner1TitleFontMobile")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_1][title_font_size_mobile]", title: "Title Font Size Mobile (px)", placeholder: "e.g. 22", type: "number" },
          ]} />
          <ColorPickerField
            name="[content][offer_banner][banner_1][text_color]"
            title="Text Color"
            value={values?.content?.offer_banner?.banner_1?.text_color}
            setFieldValue={setFieldValue}
          />
          <CheckBoxField name="[content][offer_banner][banner_1][text_bg]" title="Dark Text Background" />
          <SearchableSelectInput nameList={[{
            name: "[content][offer_banner][banner_1][text_position]",
            title: "Text Position",
            inputprops: {
              name: "[content][offer_banner][banner_1][text_position]",
              id: "offerBanner1TextPosition",
              options: textPositionOptions,
              value: textPositionOptions.find(o => o.id === values?.content?.offer_banner?.banner_1?.text_position)?.name || '',
              close: true,
            },
            store: "obj",
            setvalue: setPosition('banner_1'),
          }]} />
          <CommonRedirect values={values} setFieldValue={setFieldValue} productData={productData} categoryData={categoryData} nameList={{ selectNameKey: "offerBanner1LinkType", multipleNameKey: "offerBanner1Link" }} setSearch={setSearch} />
          <CheckBoxField name={`[content][offer_banner][banner_1][status]`} title="Status" />
        </TabPane>
        <TabPane tabId="2">
          <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="offerBanner2Image" title="Image" id="offerBanner2Image" showImage={values["offerBanner2Image"]} type="file" values={values} setFieldValue={setFieldValue} helpertext={getHelperText("806x670px")} />
          <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="offerBanner2ImageMobile" title="Image (Mobile)" id="offerBanner2ImageMobile" showImage={values["offerBanner2ImageMobile"]} type="file" values={values} setFieldValue={setFieldValue} helpertext={getHelperText("Optional — used on screens < 768px")} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_2][subtitle]", title: "Subtitle", placeholder: "Subtitle" },
            { name: "[content][offer_banner][banner_2][subtitle_mobile]", title: "Subtitle (Mobile)", placeholder: "Optional — mobile subtitle" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_2][subtitle_font_family]", values?.content?.offer_banner?.banner_2?.subtitle_font_family, setFieldValue, "offerBanner2SubtitleFont")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_2][subtitle_font_size]", title: "Subtitle Font Size (px)", placeholder: "e.g. 18", type: "number" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_2][subtitle_font_family_mobile]", values?.content?.offer_banner?.banner_2?.subtitle_font_family_mobile, setFieldValue, "offerBanner2SubtitleFontMobile")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_2][subtitle_font_size_mobile]", title: "Subtitle Font Size Mobile (px)", placeholder: "e.g. 14", type: "number" },
            { name: "[content][offer_banner][banner_2][title]", title: "Title", placeholder: "Title" },
            { name: "[content][offer_banner][banner_2][title_mobile]", title: "Title (Mobile)", placeholder: "Optional — mobile title" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_2][title_font_family]", values?.content?.offer_banner?.banner_2?.title_font_family, setFieldValue, "offerBanner2TitleFont")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_2][title_font_size]", title: "Title Font Size (px)", placeholder: "e.g. 32", type: "number" },
          ]} />
          <SearchableSelectInput nameList={[fontSelect("[content][offer_banner][banner_2][title_font_family_mobile]", values?.content?.offer_banner?.banner_2?.title_font_family_mobile, setFieldValue, "offerBanner2TitleFontMobile")]} />
          <SimpleInputField nameList={[
            { name: "[content][offer_banner][banner_2][title_font_size_mobile]", title: "Title Font Size Mobile (px)", placeholder: "e.g. 22", type: "number" },
          ]} />
          <ColorPickerField
            name="[content][offer_banner][banner_2][text_color]"
            title="Text Color"
            value={values?.content?.offer_banner?.banner_2?.text_color}
            setFieldValue={setFieldValue}
          />
          <CheckBoxField name="[content][offer_banner][banner_2][text_bg]" title="Dark Text Background" />
          <SearchableSelectInput nameList={[{
            name: "[content][offer_banner][banner_2][text_position]",
            title: "Text Position",
            inputprops: {
              name: "[content][offer_banner][banner_2][text_position]",
              id: "offerBanner2TextPosition",
              options: textPositionOptions,
              value: textPositionOptions.find(o => o.id === values?.content?.offer_banner?.banner_2?.text_position)?.name || '',
              close: true,
            },
            store: "obj",
            setvalue: setPosition('banner_2'),
          }]} />
          <CommonRedirect values={values} setFieldValue={setFieldValue} productData={productData} categoryData={categoryData} nameList={{ selectNameKey: "offerBanner2LinkType", multipleNameKey: "offerBanner2Link" }} setSearch={setSearch} />
          <CheckBoxField name={`[content][offer_banner][banner_2][status]`} title="Status" />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default OfferBannerTab;
