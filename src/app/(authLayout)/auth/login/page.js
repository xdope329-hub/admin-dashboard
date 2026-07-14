"use client";
import { ReactstrapInput } from "@/components/reactstrapFormik";
import ShowBox from "@/elements/alerts&Modals/ShowBox";
import Btn from "@/elements/buttons/Btn";
import SettingContext from "@/helper/settingContext";
import LoginBoxWrapper from "@/utils/hoc/LoginBoxWrapper";
import { YupObject, emailSchema, nameSchema } from "@/utils/validation/ValidationSchemas";
import request, { saveSession } from "@/utils/axiosUtils";
import { login } from "@/utils/axiosUtils/API";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Login = () => {
  const [showBoxMessage, setShowBoxMessage] = useState();
  const { state } = useContext(SettingContext);
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await request({ url: login, method: "post", data: values });
      if (res?.status === 200 || res?.status === 201) {
        // saveSession stores both uat (access) and urt (refresh) cookies via
        // the axios util. Both apps share the same key names so the refresh
        // interceptor picks up the right token automatically.
        saveSession(res.data || {});
        Cookies.set("account", JSON.stringify(res.data?.data || {}));
        router.push("/dashboard");
      } else {
        setShowBoxMessage(res?.response?.data?.message || "Invalid credentials");
      }
    } catch (err) {
      setShowBoxMessage("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="box-wrapper">
      <ShowBox showBoxMessage={showBoxMessage} />
      <LoginBoxWrapper>
        <div className="log-in-title text-center">
          <Image
            className="for-white"
            src={state?.setDarkLogo?.original_url ? state?.setDarkLogo?.original_url : "/assets/images/logo.png"}
            alt="Light Logo"
            width={140}
            height={28}
            priority
          />
          <h4>{t("LogInYourAccount")}</h4>
        </div>
        <div className="input-box">
          <Formik
            initialValues={{
              email: "admin@xdope.com",
              password: "Admin@123",
            }}
            validationSchema={YupObject({
              email: emailSchema,
              password: nameSchema,
            })}
            onSubmit={handleLogin}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="row g-4">
                <Col sm="12">
                  <Field
                    inputprops={{ noExtraSpace: true }}
                    autoComplete={true}
                    name="email"
                    type="email"
                    component={ReactstrapInput}
                    className="form-control"
                    id="email"
                    placeholder="Email Address"
                    label="EmailAddress"
                  />
                </Col>
                <Col sm="12">
                  <Field
                    inputprops={{ noExtraSpace: true }}
                    name="password"
                    component={ReactstrapInput}
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    label="Password"
                  />
                </Col>
                <Col sm="12">
                  <div className="forgot-box">
                    <Link href={`/auth/forgot-password`} className="forgot-password">
                      {t("ForgotPassword")}?
                    </Link>
                  </div>
                </Col>
                <Col sm="12">
                  <Btn
                    title={isSubmitting ? "Logging in..." : "Login"}
                    className="btn btn-animation w-100 justify-content-center"
                    type="submit"
                    color="false"
                    disabled={isSubmitting}
                  />
                </Col>
              </Form>
            )}
          </Formik>
        </div>
      </LoginBoxWrapper>
    </div>
  );
};

export default Login;
