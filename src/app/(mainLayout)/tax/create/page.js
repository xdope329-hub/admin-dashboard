"use client";
import FormWrapper from "@/utils/hoc/FormWrapper";
import TaxForm from "@/components/tax/TaxForm";
import useCreate from "@/utils/hooks/useCreate";
import { tax } from "@/utils/axiosUtils/API";

const TaxCreate = () => {
  const { mutate, isLoading } = useCreate(tax, false, "/tax");
  return (
    <FormWrapper title="AddTax">
      <TaxForm buttonName="Save" mutate={mutate} />
    </FormWrapper>
  );
};

export default TaxCreate;
