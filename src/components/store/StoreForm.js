import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { store } from "../../utils/axiosUtils/API";
import { getHelperText } from "../../utils/customFunctions/getHelperText";
import { YupObject, passwordConfirmationSchema, passwordSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import AddressComponent from "../inputFields/AddressComponent";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import SimpleInputField from "../inputFields/SimpleInputField";
import { StoreInitialValue } from "./widgets/StoreInitialValue";
import { StoreValidationSchema } from "./widgets/StoreValidationSchema";
import StoreVendor from "./widgets/StoreVendor";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import useCreate from "../../utils/hooks/useCreate";

const StoreForm = ({ updateId, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { mutate, isLoading: submitLoading } = useCreate(store, updateId, "/store");
  const {
    data: oldData,
    isLoading,
    refetch,
  } = useCustomQuery(["store/id"], () => request({ url: store + "/" + updateId }, router), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: false,
    select: (data) => data?.data,
  });
  useEffect(() => {
    updateId && refetch();
  }, [updateId]);
  if (updateId && isLoading) return <Loader />;
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ ...StoreInitialValue(updateId, oldData) }}
        validationSchema={YupObject({
          ...StoreValidationSchema,
          password: !updateId && passwordSchema,
          password_confirmation: !updateId && passwordConfirmationSchema,
        })}
        onSubmit={(values) => {
          if (updateId) values["_method"] = "put";
          mutate(values);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="theme-form theme-form-2 mega-form" style={{ position: 'relative' }}>
            {submitLoading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 'inherit' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }} />
                <p className="mt-2 mb-0 fw-semibold">{t("Uploading")}...</p>
              </div>
            )}
            <Row>
              <FileUploadField values={values} setFieldValue={setFieldValue} title="StoreLogo" type="file" id="store_logo_id" name="store_logo_id" updateId={updateId} errors={errors} touched={touched} helpertext={getHelperText("500x500px")} />
              <SimpleInputField
                nameList={[
                  { name: "store_name", placeholder: t("EnterStoreName"), require: "true" },
                  { name: "description", title: "StoreDescription", type: "textarea", placeholder: t("EnterDescription"), require: "true" },
                ]}
              />
              <AddressComponent values={values} />
              <StoreVendor />
              <div>
                {!updateId && (
                  <>
                    <SimpleInputField
                      nameList={[
                        { name: "password", type: "password", placeholder: t("EnterPassword"), require: "true" },
                        { name: "password_confirmation", title: "ConfirmPassword", type: "password", placeholder: t("Re-EnterPassword"), require: "true" },
                      ]}
                    />
                  </>
                )}
              </div>
              <SimpleInputField
                nameList={[
                  { name: "facebook", type: "url", placeholder: t("EnterFacebookurl") },
                  { name: "pinterest", type: "url", placeholder: t("EnterPinteresturl") },
                  { name: "instagram", type: "url", placeholder: t("EnterInstagramurl") },
                  { name: "twitter", type: "url", placeholder: t("EnterTwitterurl") },
                  { name: "youtube", type: "url", placeholder: t("EnterYoutubeurl") },
                ]}
              />
              <CheckBoxField name="hide_vendor_email" title="HideEmail" />
              <CheckBoxField name="hide_vendor_phone" title="HidePhone" />
              <CheckBoxField name="status" />
              <FormBtn buttonName={buttonName} />
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StoreForm;
