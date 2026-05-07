import { Col, Row } from 'reactstrap'
import { getHelperText } from '../../utils/customFunctions/getHelperText'
import FileUploadField from '../inputFields/FileUploadField'
import SimpleInputField from '../inputFields/SimpleInputField'
import SelectField from '../inputFields/SelectField'
import { useTranslation } from "react-i18next"

const twitterCardOptions = [
  { id: "summary_large_image", name: "Summary Large Image (recommended)" },
  { id: "summary", name: "Summary" },
];

const robotsOptions = [
  { id: "index, follow", name: "index, follow (default)" },
  { id: "noindex, follow", name: "noindex, follow" },
  { id: "index, nofollow", name: "index, nofollow" },
  { id: "noindex, nofollow", name: "noindex, nofollow" },
];

const SeoTab = ({ values, setFieldValue, errors }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Row>
        <Col sm="12">
          <SimpleInputField
            nameList={[
              { name: "[options][seo][site_name]", title: "SiteName", placeholder: "Your Store Name" },
              { name: "[options][seo][meta_title]", title: "MetaTitle", placeholder: t("EnterMetaTitle") },
              { name: "[options][seo][meta_description]", type: "textarea", title: "MetaDescription", placeholder: t("EnterMetaDescription") },
              { name: "[options][seo][meta_tags]", title: "MetaTags", placeholder: t("EnterMetaTags") },
            ]}
          />

          {/* Open Graph */}
          <SimpleInputField
            nameList={[
              { name: "[options][seo][og_title]", title: "OgTitle", placeholder: t("OgTitle") },
              { name: "[options][seo][og_description]", type: "textarea", title: "OgDescription", placeholder: t("EnterOgDescription") },
            ]}
          />
          <FileUploadField errors={errors} name="og_image_id" title={"OgImage"} id="og_image_id" type="file" values={values} setFieldValue={setFieldValue} uniquename={values?.options?.seo?.og_image} helpertext={getHelperText('1200x630px')} />

          {/* Twitter Cards */}
          <SelectField name="[options][seo][twitter_card]" title="TwitterCard" inputprops={{ options: twitterCardOptions, id: "twitter_card", name: "[options][seo][twitter_card]" }} />
          <SimpleInputField
            nameList={[
              { name: "[options][seo][twitter_title]", title: "TwitterTitle", placeholder: t("EnterMetaTitle") },
              { name: "[options][seo][twitter_description]", type: "textarea", title: "TwitterDescription", placeholder: t("EnterMetaDescription") },
              { name: "[options][seo][twitter_site]", title: "TwitterSite", placeholder: "@yourusername" },
            ]}
          />
          <FileUploadField errors={errors} name="twitter_image_id" title={"TwitterImage"} id="twitter_image_id" type="file" values={values} setFieldValue={setFieldValue} uniquename={values?.options?.seo?.twitter_image} helpertext={getHelperText('1200x628px')} />

          {/* Robots & Canonical */}
          <SelectField name="[options][seo][robots]" title="Robots" inputprops={{ options: robotsOptions, id: "seo_robots", name: "[options][seo][robots]" }} />
          <SimpleInputField
            nameList={[
              { name: "[options][seo][canonical_url]", title: "CanonicalURL", placeholder: "https://yourdomain.com" },
            ]}
          />

          {/* Search Console Verification */}
          <SimpleInputField
            nameList={[
              { name: "[options][seo][google_site_verification]", title: "GoogleSiteVerification", placeholder: "Google Search Console verification code" },
              { name: "[options][seo][bing_site_verification]", title: "BingSiteVerification", placeholder: "Bing Webmaster Tools verification code" },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default SeoTab
