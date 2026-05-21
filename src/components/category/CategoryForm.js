import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo } from "react";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import CategoryContext from "../../helper/categoryContext";
import request from "../../utils/axiosUtils";
import { nameSchema, YupObject } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import MultiSelectField from "../inputFields/MultiSelectField";
import SimpleInputField from "../inputFields/SimpleInputField";

import { mediaConfig } from "@/data/MediaConfig";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import SelectField from "../inputFields/SelectField";

const robotsOptions = [
  { id: "index, follow", name: "index, follow (default)" },
  { id: "noindex, follow", name: "noindex, follow" },
  { id: "index, nofollow", name: "index, nofollow" },
  { id: "noindex, nofollow", name: "noindex, nofollow" },
];

const CategoryForm = ({ setResetData, updateId, loading, type, buttonName, mutate }) => {
  const { t } = useTranslation("common");
  const { categoryState } = useContext(CategoryContext);
  const router = useRouter();
  const { data: oldData, isLoading, refetch } = useCustomQuery(["category/" + updateId], () => request({ url: `category/${updateId}` }, router), { enabled: false });
  useEffect(() => {
    updateId && refetch();
  }, [updateId]);
  const updatedData = useMemo(() => {
    return categoryState;
  }, [categoryState]);

  if (updateId && isLoading) return <Loader />;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: updateId ? oldData?.data?.name || "" : "",
        description: updateId ? oldData?.data?.description || "" : "",
        category_image_id: updateId ? oldData?.data?.category_image?.id : "",
        meta_title: updateId ? oldData?.data?.meta_title || "" : "",
        meta_description: updateId ? oldData?.data?.meta_description || "" : "",
        meta_keywords: updateId ? oldData?.data?.meta_keywords || "" : "",
        og_title: updateId ? oldData?.data?.og_title || "" : "",
        og_description: updateId ? oldData?.data?.og_description || "" : "",
        canonical_url: updateId ? oldData?.data?.canonical_url || "" : "",
        robots: updateId ? oldData?.data?.robots || "index, follow" : "index, follow",
        category_meta_image_id: updateId ? oldData?.data?.category_meta_image?.id : "",
        category_meta_image: updateId ? oldData?.data?.category_meta_image : "",
        category_icon_id: updateId ? oldData?.data?.category_icon?.id : "",
        category_image: updateId ? oldData?.data?.category_image : "",
        category_icon: updateId ? oldData?.data?.category_icon : "",
        commission_rate: updateId ? oldData?.data?.commission_rate : "",
        type: type,
        status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
        parent_id: updateId ? Number(oldData?.data?.parent_id) || undefined : undefined,
      }}
      validationSchema={YupObject({
        name: nameSchema,
      })}
      onSubmit={(values, helpers) => {
        const payload = {
          ...values, //Copies all the existing form fields into the new payload.
          status: values.status ? 1 : 0,
          parent_id: values.parent_id || null, // If `parent_id` is undefined or null, it will be set to null.
          commission_rate: values.commission_rate === "" ? null : values.commission_rate, // If `commission_rate` is empty, it will be set to null.
        };
        if (mutate) {
          mutate(payload, {
            onSuccess: () => {
              // Triggers a state update elsewhere in the app to refresh  the categories
              setResetData && setResetData(true);
              // If `updateId` is not present (which means the user is creating a new category), it clears
              // out all the form fields so they can add another category.
              if (!updateId) helpers.resetForm();
            },
          });
        } else {
          setResetData && setResetData(true);
          router.push(`/category`);
        }
      }}
    >
      {({ setFieldValue, values, errors }) => (
        <Form className="theme-form theme-form-2 mega-form" style={{ position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 'inherit' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }} />
              <p className="mt-2 mb-0 fw-semibold">{t("Uploading")}...</p>
            </div>
          )}
          <Row>
            <SimpleInputField
              nameList={[
                {
                  name: "name",
                  title: "Name",
                  placeholder: t("EnterCategoryName"),
                  require: "true",
                },
                {
                  name: "description",
                  type: "textarea",
                  rows: "3",
                  placeholder: t("EnterCategoryDescription"),
                },
              ]}
            />
            {type == "product" && <SimpleInputField nameList={[{ name: "commission_rate", title: "CommissionRate", postprefix: "%", inputaddon: "true", placeholder: t("EnterCommissionRate"), min: "0", max: "100", type: "number", helpertext: "*Define the percentage of earnings retained as commission." }]} />}
            <MultiSelectField errors={errors} values={values} setFieldValue={setFieldValue} name="parent_id" title={"SelectParent"} data={updatedData} />
            <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="category_image_id" id="category_image_id" title="Image" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} loading={loading} />
            <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="category_icon_id" id="category_icon_id" title="Icon" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} loading={loading} />
            <SimpleInputField
              nameList={[
                { name: "meta_title", title: "meta_title", placeholder: t("enter_meta_title") },
                { name: "meta_description", title: "meta_description", type: "textarea", rows: "3", placeholder: t("enter_meta_description") },
                { name: "meta_keywords", title: "MetaKeywords", placeholder: "keyword1, keyword2, keyword3" },
                { name: "og_title", title: "OgTitle", placeholder: t("enter_meta_title") },
                { name: "og_description", title: "OgDescription", type: "textarea", rows: "3", placeholder: t("enter_meta_description") },
                { name: "canonical_url", title: "CanonicalURL", placeholder: "https://yourdomain.com/category/..." },
              ]}
            />
            <SelectField name="robots" title="Robots" inputprops={{ options: robotsOptions, id: "robots", name: "robots" }} />
            <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="category_meta_image_id" id="category_meta_image_id" title="MetaImage" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} loading={loading} />
            <CheckBoxField name="status" />
            <FormBtn loading={loading} buttonName={buttonName} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};
export default CategoryForm;
