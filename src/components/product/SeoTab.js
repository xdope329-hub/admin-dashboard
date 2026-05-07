import { useTranslation } from "react-i18next";
import FileUploadField from "../inputFields/FileUploadField";
import SimpleInputField from "../inputFields/SimpleInputField";
import SelectField from "../inputFields/SelectField";

const robotsOptions = [
  { id: "index, follow", name: "index, follow (default)" },
  { id: "noindex, follow", name: "noindex, follow" },
  { id: "index, nofollow", name: "index, nofollow" },
  { id: "noindex, nofollow", name: "noindex, nofollow" },
];

const SeoTab = ({ setFieldValue, values, updateId }) => {
  const { t } = useTranslation("common");
  return (
    <>
      <SimpleInputField
        nameList={[
          { name: "meta_title", placeholder: t("EnterMetaTitle") },
          { name: "meta_description", placeholder: t("EnterMetaDescription"), type: "textarea" },
          { name: "meta_keywords", title: "MetaKeywords", placeholder: "keyword1, keyword2, keyword3" },
          { name: "og_title", title: "OgTitle", placeholder: t("EnterMetaTitle") },
          { name: "og_description", title: "OgDescription", placeholder: t("EnterMetaDescription"), type: "textarea" },
          { name: "canonical_url", title: "CanonicalURL", placeholder: "https://yourdomain.com/products/..." },
        ]}
      />
      <SelectField name="robots" title="Robots" inputprops={{ options: robotsOptions, id: "robots", name: "robots" }} />
      <FileUploadField name="product_meta_image_id" title="ProductMetaImage" id="product_meta_image_id" type="file" values={values} setFieldValue={setFieldValue} updateId={updateId} />
    </>
  );
};

export default SeoTab;
