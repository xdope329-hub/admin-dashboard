import SimpleInputField from "../inputFields/SimpleInputField";

const SeoTab = () => {
  return (
    <>
      <SimpleInputField
        nameList={[
          { name: "[values][seo][meta_title]", title: "meta_title", placeholder: "Enter meta_title" },
          { name: "[values][seo][meta_description]", title: "meta_description", type: "textarea", placeholder: "Enter meta_description" },
          { name: "[values][seo][meta_tags]", title: "meta_tags", placeholder: "Enter meta_tags" },
          { name: "[values][seo][og_title]", title: "og_title", placeholder: "Enter og_title" },
          { name: "[values][seo][og_description]", title: "og_description", type: "textarea", placeholder: "Enter og_description" },
          { name: "[values][seo][google_site_verification]", title: "google_site_verification", placeholder: "Google Search Console verification code" },
          { name: "[values][seo][bing_site_verification]", title: "bing_site_verification", placeholder: "Bing Webmaster Tools verification code" },
        ]}
      />
    </>
  );
};

export default SeoTab;
