const ThemeOptionSubmit = (values, mutate) => {
  // Initialize nested option objects to avoid "Cannot set properties of undefined" errors
  const o = values["options"];
  if (!o["logo"]) o["logo"] = {};
  if (!o["seo"]) o["seo"] = {};
  if (!o["header"]) o["header"] = {};
  if (!o["footer"]) o["footer"] = {};
  if (!o["seller"]) o["seller"] = {};
  if (!o["seller"]["services"]) o["seller"]["services"] = {};
  if (!o["seller"]["services"]["service_1"]) o["seller"]["services"]["service_1"] = {};
  if (!o["seller"]["services"]["service_2"]) o["seller"]["services"]["service_2"] = {};
  if (!o["seller"]["services"]["service_3"]) o["seller"]["services"]["service_3"] = {};
  if (!o["seller"]["services"]["service_4"]) o["seller"]["services"]["service_4"] = {};
  if (!o["seller"]["about"]) o["seller"]["about"] = {};
  if (!o["popup"]) o["popup"] = {};
  if (!o["popup"]["news_letter"]) o["popup"]["news_letter"] = {};
  if (!o["popup"]["exit"]) o["popup"]["exit"] = {};
  if (!o["popup"]["auth"]) o["popup"]["auth"] = {};
  if (!o["contact_us"]) o["contact_us"] = {};
  if (!o["collection"]) o["collection"] = {};
  if (!o["product"]) o["product"] = {};
  if (!o["about_us"]) o["about_us"] = {};
  if (!o["about_us"]["about"]) o["about_us"]["about"] = {};
  if (!o["about_us"]["team"]) o["about_us"]["team"] = {};
  if (!o["about_us"]["testimonial"]) o["about_us"]["testimonial"] = {};

  // Header logo: if a new image was selected via modal, update both object and ID;
  // otherwise keep existing values (never wipe to null)
  if (values["header_logo"]) {
    values["options"]["logo"]["header_logo"] = values["header_logo"];
    values["options"]["logo"]["header_logo_id"] = values["header_logo"].id;
  } else if (values["header_logo_id"]) {
    values["options"]["logo"]["header_logo_id"] = values["header_logo_id"];
  }
  // Footer logo
  if (values["footer_logo"]) {
    values["options"]["logo"]["footer_logo"] = values["footer_logo"];
    values["options"]["logo"]["footer_logo_id"] = values["footer_logo"].id;
  } else if (values["footer_logo_id"]) {
    values["options"]["logo"]["footer_logo_id"] = values["footer_logo_id"];
  }
  // Favicon icon
  if (values["favicon_icon"]) {
    values["options"]["logo"]["favicon_icon"] = values["favicon_icon"];
    values["options"]["logo"]["favicon_icon_id"] = values["favicon_icon"].id;
  } else if (values["favicon_icon_id"]) {
    values["options"]["logo"]["favicon_icon_id"] = values["favicon_icon_id"];
  }
  if (values["og_image_id"]) {
    values["options"]["seo"]["og_image_id"] = values["og_image_id"];
  } else {
    values["options"]["seo"]["og_image_id"] = null;
  }
  if (values["twitter_image_id"]) {
    values["options"]["seo"]["twitter_image_id"] = values["twitter_image_id"];
  } else {
    values["options"]["seo"]["twitter_image_id"] = null;
  }
  if (values["headerCategories"]) {
    values["options"]["header"]["category_ids"] = values["headerCategories"];
  }
  if (values["footer_categories"]) {
    values["options"]["footer"]["footer_categories"] = values["footer_categories"];
  }
  if (values["useful_link"]) {
    values["options"]["footer"]["useful_link"] = values["useful_link"];
  }
  if (values["help_center"]) {
    values["options"]["footer"]["help_center"] = values["help_center"];
  }
  if (values["today_deals"]) {
    values["options"]["header"]["today_deals"] = values["today_deals"];
  }
  if (values["footer_pages"]) {
    values["options"]["footer"]["footer_pages"] = values["footer_pages"];
  }

  if (values["serviceImage1"]) {
    values["options"]["seller"]["services"]["service_1"]["image_url"] = values["serviceImage1"].original_url;
  } else values["options"]["seller"]["services"]["service_1"]["image_url"] = "";

  if (values["serviceImage2"]) {
    values["options"]["seller"]["services"]["service_2"]["image_url"] = values["serviceImage2"].original_url;
  } else values["options"]["seller"]["services"]["service_2"]["image_url"] = "";

  if (values["serviceImage3"]) {
    values["options"]["seller"]["services"]["service_3"]["image_url"] = values["serviceImage3"].original_url;
  } else values["options"]["seller"]["services"]["service_3"]["image_url"] = "";

  if (values["serviceImage4"]) {
    values["options"]["seller"]["services"]["service_4"]["image_url"] = values["serviceImage4"].original_url;
  } else values["options"]["seller"]["services"]["service_4"]["image_url"] = "";

  if (values["newsLetterImage"]) {
    values["options"]["popup"]["news_letter"]["image_url"] = values["newsLetterImage"].original_url;
  } else values["options"]["popup"]["news_letter"]["image_url"] = "";

  if (values["exitImage"]) {
    values["options"]["popup"]["exit"]["image_url"] = values["exitImage"].original_url;
  } else values["options"]["popup"]["exit"]["image_url"] = "";

  if (values["authImage"]) {
    values["options"]["popup"]["auth"]["image_url"] = values["authImage"].original_url;
  } else values["options"]["popup"]["auth"]["image_url"] = "";

  if (values["aboutSellerImage"]) {
    values["options"]["seller"]["about"]["image_url"] = values["aboutSellerImage"].original_url;
  } else values["options"]["seller"]["about"]["image_url"] = "";

  if (values["contactUsImage"]) {
    values["options"]["contact_us"]["imageUrl"] = values["contactUsImage"].original_url;
  } else values["options"]["contact_us"]["imageUrl"] = "";

  if (values["collection_banner_image"]) {
    values["options"]["collection"]["collection_banner_image_url"] = values["collection_banner_image"].original_url;
  } else values["options"]["collection"]["collection_banner_image_url"] = "";

  if (values["FooterSubscribeImage"]) {
    values["options"]["footer"]["bg_image"] = values["FooterSubscribeImage"].original_url;
  } else values["options"]["footer"]["bg_image"] = "";

  if (values["banner_image_url"]) {
    values["options"]["product"]["banner_image_url"] = values["banner_image_url"].original_url;
  } else values["options"]["product"]["banner_image_url"] = "";

  if (values["safe_checkout_image"]) {
    values["options"]["product"]["safe_checkout_image"] = values["safe_checkout_image"].original_url;
  } else values["options"]["product"]["safe_checkout_image"] = "";

  if (values["secure_checkout_image"]) {
    values["options"]["product"]["secure_checkout_image"] = values["secure_checkout_image"].original_url;
  } else values["options"]["product"]["secure_checkout_image"] = "";

  if (values["footerImage"]) {
    values["options"]["footer"]["bg_image"] = values["footerImage"].original_url;
  } else values["options"]["footer"]["bg_image"] = "";

  if (values["paymentOptionImage"]) {
    values["options"]["footer"]["payment_option_image_url"] = values["paymentOptionImage"].original_url;
  } else values["options"]["footer"]["payment_option_image_url"] = "";

  // About Us
  if (values["content_left_image_url"]) {
    values["options"]["about_us"]["about"]["content_left_image_url"] = values["content_left_image_url"].original_url;
  } else values["options"]["about_us"]["about"]["content_left_image_url"] = "";

  if (values["content_right_image_url"]) {
    values["options"]["about_us"]["about"]["content_right_image_url"] = values["content_right_image_url"].original_url;
  } else values["options"]["about_us"]["about"]["content_right_image_url"] = "";

  values["options"]["about_us"]["about"]["futures"]?.forEach((elem, i) => {
    if (values[`futureIcons${i}`]) {
      values["options"]["about_us"]["about"]["futures"][i]["icon"] = values[`futureIcons${i}`].original_url;
    } else {
      values["options"]["about_us"]["about"]["futures"][i]["icon"] = "";
    }
  });

  values["options"]["about_us"]["team"]["members"]?.forEach((elem, i) => {
    if (values[`teamContentImage${i}`]) {
      values["options"]["about_us"]["team"]["members"][i]["profile_image_url"] = values[`teamContentImage${i}`].original_url;
    } else {
      values["options"]["about_us"]["team"]["members"][i]["profile_image_url"] = "";
    }
  });

  values["options"]["about_us"]["testimonial"]["reviews"]?.forEach((elem, i) => {
    if (values[`testimonialReviewImage${i}`]) {
      values["options"]["about_us"]["testimonial"]["reviews"][i]["profile_image_url"] = values[`testimonialReviewImage${i}`].original_url;
    } else {
      values["options"]["about_us"]["testimonial"]["reviews"][i]["profile_image_url"] = "";
    }
  });

  delete values?.options?.seo?.og_image;
  delete values?.options?.seo?.twitter_image;
  values["_method"] = "put";
  mutate(values);
};

export default ThemeOptionSubmit;
