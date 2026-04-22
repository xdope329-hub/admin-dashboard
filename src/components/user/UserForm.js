import React from "react";
import { Form, Formik } from "formik";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { emailSchema, nameSchema, passwordConfirmationSchema, passwordSchema, phoneSchema, YupObject } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import UserAddress from "./widgets/UserAddress";
import CreateUser from "./widgets/CreateUser";
import { useRouter } from "next/navigation";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const UserForm = ({ mutate, loading, updateId, fixedRole, noRoleField, addAddress, type, buttonName }) => {
  const router = useRouter();
  const {
    data: rolesData,
    isLoading: roleLoading,
  } = useCustomQuery(["/role"], () => request({ url: "/role" }, router), {
    refetchOnWindowFocus: false,
    enabled: !fixedRole,
    select: (data) => data?.data?.data,
  });

  const { data: oldData, isLoading: oldDataLoading } = useCustomQuery(
    [updateId ? `/user/${updateId}` : null],
    () => request({ url: `/user/${updateId}` }, router),
    { enabled: !!updateId, refetchOnWindowFocus: false }
  );
  if (roleLoading && updateId && oldDataLoading) return <Loader />;
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: updateId ? oldData?.data?.name || "" : "",
        email: updateId ? oldData?.data?.email || "" : "",
        phone: updateId ? Number(oldData?.data?.phone) || "" : "",
        password: "",
        password_confirmation: "",
        role_id: updateId ? oldData?.data?.role?.id || "" : fixedRole ? 2 : "",
        status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
        address: [],
        country_code: updateId ? oldData?.data?.country_code || "" : "91",
      }}
      validationSchema={YupObject({
        name: nameSchema,
        email: emailSchema,
        phone: phoneSchema,
        password: !updateId && passwordSchema,
        password_confirmation: !updateId && passwordConfirmationSchema,
        role_id: noRoleField ? null : nameSchema,
      })}
      onSubmit={(values) => {
        if (mutate) mutate(values);
      }}
    >
      {({ values }) => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            {!addAddress && (
              <>
                <CreateUser updateId={updateId} rolesData={rolesData} fixedRole={fixedRole} />
              </>
            )}
            <UserAddress addAddress={addAddress} type={type} />
            <FormBtn loading={loading} buttonName={buttonName} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
