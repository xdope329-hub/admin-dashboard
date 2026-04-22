import Loader from "@/components/commonComponent/Loader";
import FormBtn from "@/elements/buttons/FormBtn";
import request from "@/utils/axiosUtils";
import { YupObject, nameSchema, permissionsSchema } from "@/utils/validation/ValidationSchemas";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import SimpleInputField from "../inputFields/SimpleInputField";
import PermissionsCheckBoxForm from "./widgets/PermissionsCheckBoxForm";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const PermissionForm = ({ updateId, buttonName, mutate }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { data: oldData, isLoading } = useCustomQuery(
    [updateId ? `role/${updateId}` : null],
    () => request({ url: `role/${updateId}` }, router),
    {
      enabled: !!updateId,
      refetchOnWindowFocus: false,
      select: (data) => ({ name: data?.data?.name || "", permissions: data?.data?.permissions || [] }),
    }
  );

  if (updateId && isLoading) return <Loader />;

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: updateId ? oldData?.name || "" : "",
          permissions: updateId ? oldData?.permissions || [] : [],
        }}
        validationSchema={YupObject({
          name: nameSchema,
          permissions: permissionsSchema,
        })}
        onSubmit={(values) => {
          if (mutate) mutate(values);
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="theme-form theme-form-2 mega-form">
              <SimpleInputField nameList={[{ name: "name", placeholder: t("RoleName"), require: "true" }]} />
            </div>
            <PermissionsCheckBoxForm values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
            <FormBtn buttonName={buttonName} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PermissionForm;
