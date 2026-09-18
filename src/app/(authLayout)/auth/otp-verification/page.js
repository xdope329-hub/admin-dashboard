"use client";
import ShowBox from "@/elements/alerts&Modals/ShowBox";
import { obscureEmail } from "@/utils/customFunctions/EmailFormats";
import LoginBoxWrapper from "@/utils/hoc/LoginBoxWrapper";
import NoSsr from "@/utils/hoc/NoSsr";
import useHandleForgotPassword from "@/utils/hooks/auth/useForgotPassword";
import useOtpVerification from "@/utils/hooks/auth/useOtpVerification";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";

const OtpVerification = () => {
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
  const cookies = Cookies.get("ue");
  const [seconds, setSeconds] = useState();
  const [otp, setOtp] = useState("");
  const { mutate: otpVerification } = useOtpVerification(setShowBoxMessage);
  const { mutate: forgotPassword } = useHandleForgotPassword(setShowBoxMessage);
  const handleChange = (e) => {
    if (e.target.value.length <= 6 && !isNaN(Number(e.target.value))) {
      setOtp(e.target.value);
    }
  };

  useEffect(() => {
    // El API emite códigos de 6 dígitos (antes se enviaba con 5 y nunca validaba).
    otp && otp.length === 6 && otpVerification({ email: cookies, token: otp });
  }, [otp]);

  useEffect(() => {
    const otpTimer =
      Boolean(seconds) && setInterval(() => setSeconds(seconds - 1), 1000);
    return () => {
      clearInterval(otpTimer);
    };
  }, [seconds]);
  return (
    <>
      <div className="box-wrapper">
        <ShowBox showBoxMessage={showBoxMessage} />
        <LoginBoxWrapper>
          <div className="log-in-title">
            <h3 className="text-content">
              {t("PleasEnterTheOneTimePasswordToVerifyYourAccount")}
            </h3>
            <h5 className="text-content">
              {t("ACodeHasBeenSentTo") + " "}
              <span>
                <NoSsr>{obscureEmail(cookies)}</NoSsr>
              </span>
            </h5>
          </div>
          <div className="outer-otp">
            <div className="inner-otp">
              <Input
                type="text"
                maxLength="6"
                onChange={handleChange}
                value={otp}
              />
            </div>
          </div>
          <div className="send-box pt-4">
            {seconds ? (
              <h5>
                {t("PleaseWait")}
                <a className="theme-color fw-bold">
                  {seconds} <NoSsr>{t("second(s)")}</NoSsr>3
                </a>
                {t("BeforeRequestingANewOneTimePassword(OTP)")}.
              </h5>
            ) : (
              <h5>
                {t("Didn'tGetTheOTP")}?
                <a
                  className="theme-color fw-bold"
                  onClick={() => {
                    forgotPassword({ email: cookies });
                    setSeconds(60);
                  }}
                >
                  {t("ResendIt")}
                </a>
              </h5>
            )}
          </div>
        </LoginBoxWrapper>
      </div>
    </>
  );
};
export default OtpVerification;
