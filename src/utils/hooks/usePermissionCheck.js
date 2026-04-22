import { useMemo } from "react";
import { usePathname } from "next/navigation";
import request from "../axiosUtils";
import { selfData } from "../axiosUtils/API";
import ConvertPermissionArr from "../customFunctions/ConvertPermissionArr";
import useCustomQuery from "./useCustomQuery";

const usePermissionCheck = (permissionTypeArr, keyToSearch) => {
  const path = usePathname();
  const moduleToSearch = keyToSearch ? keyToSearch : path.split("/")[1];

  const { data } = useCustomQuery([selfData], () => request({ url: selfData }), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    const user = data?.data;
    if (!user) return permissionTypeArr.map(() => false);
    // Admin role (system_reserve='1') has all permissions
    if (user?.role?.system_reserve === "1") return permissionTypeArr.map(() => true);
    const securePaths = ConvertPermissionArr(user?.permission);
    return permissionTypeArr.map((permissionType) =>
      Boolean(
        securePaths
          ?.find((p) => moduleToSearch === p.name)
          ?.permissionsArr.find((p) => p.type === permissionType)
      )
    );
  }, [data, moduleToSearch, permissionTypeArr.join(",")]);
};

export default usePermissionCheck;
