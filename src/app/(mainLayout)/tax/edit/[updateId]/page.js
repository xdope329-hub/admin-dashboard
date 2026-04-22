"use client";
import TaxForm from "@/components/tax/TaxForm";
import useUpdate from "@/utils/hooks/useUpdate";
import { tax } from "@/utils/axiosUtils/API";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Row } from "reactstrap";

const TaxUpdate = () => {
  const params = useParams();
  const { t } = useTranslation("common");
  const { mutate, isLoading } = useUpdate(tax, params?.updateId, "/tax");
  return (
    params?.updateId && (
      <Row>
        <Col sm="8" className="m-auto">
          <Card>
            <CardBody>
              <div className="card-header-2">
                <h5>{t("EditTax")}</h5>
              </div>
              <TaxForm updateId={params?.updateId} buttonName="Update" mutate={mutate} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  );
};

export default TaxUpdate;
