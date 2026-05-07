import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Btn from "../../../elements/buttons/Btn";

const PlaceOrder = ({ values, mutate }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const handleClick = () => {
    mutate && mutate(values);
  };
  return (
    <Btn className="btn btn-theme payment-btn mt-4" onClick={handleClick} disabled={values["consumer_id"] && values["billing_address_id"] && values["shipping_address_id"] && values["payment_method"] && values["delivery_description"] ? false : true}>
      {t("PlaceOrder")}
    </Btn>
  );
};

export default PlaceOrder;
