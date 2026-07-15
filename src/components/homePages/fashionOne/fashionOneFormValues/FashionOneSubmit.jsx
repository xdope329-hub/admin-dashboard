import { concatDynamicProductKeys } from "../../../../utils/customFunctions/ConcatDynamicProductKeys";

const FashionOneSubmit = (values, mutate) => {
  values["content"]["products_ids"] = Array.from(new Set(concatDynamicProductKeys(values)));

  values["content"]["home_banner"]["banners"]?.forEach((elem, i) => {
    if (!values["content"]["home_banner"]["banners"][i]["redirect_link"]) {
      values["content"]["home_banner"]["banners"][i]["redirect_link"] = {}; // Initialize redirect_link if undefined
    }

    if (values[`homeBannerImage${i}`]) {
      values["content"]["home_banner"]["banners"][i]["image_url"] = values[`homeBannerImage${i}`].original_url;
    } else {
      values["content"]["home_banner"]["banners"][i]["image_url"] = "";
    }

    if (values[`homeBannerImageMobile${i}`]) {
      values["content"]["home_banner"]["banners"][i]["image_url_mobile"] = values[`homeBannerImageMobile${i}`].original_url;
    } else {
      values["content"]["home_banner"]["banners"][i]["image_url_mobile"] = "";
    }

    if (values[`homeRedirectLinkType${i}`] || values[`homeRedirectLink${i}`]) {
      values["content"]["home_banner"]["banners"][i]["redirect_link"]["link_type"] = values[`homeRedirectLinkType${i}`];
      values["content"]["home_banner"]["banners"][i]["redirect_link"]["link"] = values[`homeRedirectLink${i}`];
      if (values[`homeRedirectLinkType${i}`] == "product") {
        values["content"]["home_banner"]["banners"][i]["redirect_link"]["product_ids"] = values[`homeRedirectLink${i}`];
      } else {
        values["content"]["home_banner"]["banners"][i]["redirect_link"]["product_ids"] = "";
      }
    } else {
      values["content"]["home_banner"]["banners"][i]["redirect_link"]["link_type"] = "";
      values["content"]["home_banner"]["banners"][i]["redirect_link"]["link"] = "";
    }
  });

  values["content"]["social_media"]["banners"].forEach((elem, i) => {
    if (!values["content"]["social_media"]["banners"][i]["redirect_link"]) {
      values["content"]["social_media"]["banners"][i]["redirect_link"] = {}; // Initialize redirect_link if undefined
    }
    if (!values["content"]["social_media"]["banners"][i]["redirect_link"]) {
      values["content"]["social_media"]["banners"][i]["redirect_link"] = {}; // Initialize redirect_link if undefined
    }
    if (values[`socialMediaBannerImage${i}`]) {
      values["content"]["social_media"]["banners"][i]["image_url"] = values[`socialMediaBannerImage${i}`].original_url;
    } else {
      values["content"]["social_media"]["banners"][i]["image_url"] = "";
    }
    if (values[`socialMediaBannerImageMobile${i}`]) {
      values["content"]["social_media"]["banners"][i]["image_url_mobile"] = values[`socialMediaBannerImageMobile${i}`].original_url;
    } else {
      values["content"]["social_media"]["banners"][i]["image_url_mobile"] = "";
    }
    if (values[`socialMediaRedirectLinkType${i}`] || values[`socialMediaRedirectLink${i}`]) {
      values["content"]["social_media"]["banners"][i]["redirect_link"]["link_type"] = values[`socialMediaRedirectLinkType${i}`];
      values["content"]["social_media"]["banners"][i]["redirect_link"]["link"] = values[`socialMediaRedirectLink${i}`];
      if (values[`socialMediaRedirectLinkType${i}`] == "product") {
        values["content"]["social_media"]["banners"][i]["redirect_link"]["product_ids"] = values[`socialMediaRedirectLink${i}`];
      } else {
        values["content"]["social_media"]["banners"][i]["redirect_link"]["product_ids"] = "";
      }
    } else {
      values["content"]["social_media"]["banners"][i]["redirect_link"]["link_type"] = "";
      values["content"]["social_media"]["banners"][i]["redirect_link"]["link"] = "";
    }
  });

  values["content"]["services"]?.["banners"]?.forEach((elem, i) => {
    if (values[`serviceBannerImage${i}`]) {
      values["content"]["services"]["banners"][i]["image_url"] = values[`serviceBannerImage${i}`]?.original_url;
    } else {
      values["content"]["services"]["banners"][i]["image_url"] = "";
    }
    if (values[`serviceBannerImageMobile${i}`]) {
      values["content"]["services"]["banners"][i]["image_url_mobile"] = values[`serviceBannerImageMobile${i}`]?.original_url;
    } else {
      values["content"]["services"]["banners"][i]["image_url_mobile"] = "";
    }
  });

  // =============================================================================================================

  // Ensure nested objects exist before writing to them
  if (!values["content"]["offer_banner"]) values["content"]["offer_banner"] = {};
  if (!values["content"]["offer_banner"]["banner_1"]) values["content"]["offer_banner"]["banner_1"] = {};
  if (!values["content"]["offer_banner"]["banner_1"]["redirect_link"]) values["content"]["offer_banner"]["banner_1"]["redirect_link"] = {};
  if (!values["content"]["offer_banner"]["banner_2"]) values["content"]["offer_banner"]["banner_2"] = {};
  if (!values["content"]["offer_banner"]["banner_2"]["redirect_link"]) values["content"]["offer_banner"]["banner_2"]["redirect_link"] = {};
  if (!values["content"]["banner"]) values["content"]["banner"] = { redirect_link: {} };
  if (!values["content"]["banner"]["redirect_link"]) values["content"]["banner"]["redirect_link"] = {};
  if (!values["content"]["featured_blogs"]) values["content"]["featured_blogs"] = {};

  // Images
  if (values["offerBanner1Image"]) {
    values["content"]["offer_banner"]["banner_1"]["image_url"] = values["offerBanner1Image"].original_url;
  } else values["content"]["offer_banner"]["banner_1"]["image_url"] = "";
  if (values["offerBanner1ImageMobile"]) {
    values["content"]["offer_banner"]["banner_1"]["image_url_mobile"] = values["offerBanner1ImageMobile"].original_url;
  } else values["content"]["offer_banner"]["banner_1"]["image_url_mobile"] = "";

  if (values["banner1Image"]) {
    values["content"]["banner"]["image_url"] = values["banner1Image"].original_url;
  } else values["content"]["banner"]["image_url"] = "";

  if (values["offerBanner2Image"]) {
    values["content"]["offer_banner"]["banner_2"]["image_url"] = values["offerBanner2Image"].original_url;
  } else values["content"]["offer_banner"]["banner_2"]["image_url"] = "";
  if (values["offerBanner2ImageMobile"]) {
    values["content"]["offer_banner"]["banner_2"]["image_url_mobile"] = values["offerBanner2ImageMobile"].original_url;
  } else values["content"]["offer_banner"]["banner_2"]["image_url_mobile"] = "";

  // =============================================================================================================

  // For Passing Redirect Link
  if (values["offerBanner1LinkType"]) {
    values["content"]["offer_banner"]["banner_1"]["redirect_link"]["link_type"] = values["offerBanner1LinkType"];
  } else {
    values["content"]["offer_banner"]["banner_1"]["redirect_link"]["link_type"] = "";
    values["content"]["offer_banner"]["banner_1"]["redirect_link"]["link"] = "";
    values["offerBanner1LinkType"] = "";
  }
  if (values["offerBanner1Link"]) {
    values["content"]["offer_banner"]["banner_1"]["redirect_link"]["link"] = values["offerBanner1Link"];
    if (values["offerBanner1LinkType"] == "product") {
      values["content"]["offer_banner"]["banner_1"]["redirect_link"]["product_ids"] = values["offerBanner1Link"];
    } else {
      values["content"]["offer_banner"]["banner_1"]["redirect_link"]["product_ids"] = "";
    }
  } else {
    values["content"]["offer_banner"]["banner_1"]["redirect_link"]["link"] = "";
  }
  // ---------------------------------------------------------------------

  if (values["offerBanner2LinkType"]) {
    values["content"]["offer_banner"]["banner_2"]["redirect_link"]["link_type"] = values["offerBanner2LinkType"];
  } else {
    values["content"]["offer_banner"]["banner_2"]["redirect_link"]["link_type"] = "";
    values["content"]["offer_banner"]["banner_2"]["redirect_link"]["link"] = "";
    values["offerBanner2LinkType"] = "";
  }
  if (values["offerBanner2Link"]) {
    values["content"]["offer_banner"]["banner_2"]["redirect_link"]["link"] = values["offerBanner2Link"];
    if (values["offerBanner2LinkType"] == "product") {
      values["content"]["offer_banner"]["banner_2"]["redirect_link"]["product_ids"] = values["offerBanner2Link"];
    } else {
      values["content"]["offer_banner"]["banner_2"]["redirect_link"]["product_ids"] = "";
    }
  } else {
    values["content"]["offer_banner"]["banner_2"]["redirect_link"]["link"] = "";
  }

  if (values["banner1LinkType"]) {
    values["content"]["banner"]["redirect_link"]["link_type"] = values["banner1LinkType"];
  } else {
    values["content"]["banner"]["redirect_link"]["link_type"] = "";
    values["content"]["banner"]["redirect_link"]["link"] = "";
    values["banner1LinkType"] = "";
  }
  if (values["banner1Link"]) {
    values["content"]["banner"]["redirect_link"]["link"] = values["banner1Link"];
    if (values["banner1LinkType"] == "product") {
      values["content"]["banner"]["redirect_link"]["product_ids"] = values["banner1Link"];
    } else {
      values["content"]["banner"]["redirect_link"]["product_ids"] = "";
    }
  } else {
    values["content"]["banner"]["redirect_link"]["link"] = "";
  }

  // ==========================================================================

  //MultiSelect
  if (values["productList1Product"]) {
    values["content"]["products_list"]["product_ids"] = values["productList1Product"];
  }

  if (values["featuredBlogList"]) {
    values["content"]["featured_blogs"]["blog_ids"] = values["featuredBlogList"];
  }

  if (values["productCategories"]) {
    values["content"]["category_product"]["category_ids"] = values["productCategories"];
  }

  // ── Brands section ────────────────────────────────────────────────
  // Always emit a normalized { status, title, brand_ids } object so the
  // backend gets the admin's exact intent on every save.
  const existingBrands = values["content"]["brands"] || values["content"]["brand"] || {};
  const rawStatus = existingBrands.status;
  // Coerce truthy/falsy variants (true / 1 / "1" → 1, otherwise 0)
  const normalizedStatus = (rawStatus === true || rawStatus === 1 || rawStatus === "1") ? 1 : 0;
  values["content"]["brands"] = {
    status: normalizedStatus,
    title: existingBrands.title || "Our Brands",
    brand_ids: values["brandItems"] !== undefined ? values["brandItems"] : (existingBrands.brand_ids || []),
  };
  // Drop the legacy singular alias if a previous save left it behind
  if (values["content"]["brand"]) delete values["content"]["brand"];

  const updatedValues = {
    ...values,
    content: {
      ...values.content,
      products_ids: Array.from(new Set(concatDynamicProductKeys(values))),
    },
  };
  if (mutate) mutate(updatedValues);
};
export default FashionOneSubmit;
