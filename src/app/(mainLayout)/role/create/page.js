"use client";
import Loader from "@/components/commonComponent/Loader";
import { role } from "@/utils/axiosUtils/API";
import FormWrapper from "@/utils/hoc/FormWrapper";
import useCreate from "@/utils/hooks/useCreate";
import dynamic from "next/dynamic";

const Role = () => {
  const { mutate, isLoading } = useCreate(role, false, `/role`);
  const PermissionForm = dynamic(() => import("@/components/role/PermissionForm").then((mod) => mod.default), {
    loading: () => <Loader />,
    ssr: false,
  });
  return (
    <FormWrapper title="AddRole">
      <PermissionForm mutate={mutate} loading={isLoading} buttonName="Save" />
    </FormWrapper>
  );
};

export default Role;
