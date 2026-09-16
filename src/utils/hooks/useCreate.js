import { usePathname, useRouter } from "next/navigation";
import request from "../axiosUtils";
import SuccessHandle from "../customFunctions/SuccessHandle";
import { ToastNotification } from "../customFunctions/ToastNotification";
import useCustomMutation from "./useCustomMutation";

const useCreate = (url, updateId, path = false, message, extraFunction, notHandler, responseType, errFunction) => {
  const router = useRouter();
  const pathname = usePathname();
  return useCustomMutation((data) => request({ url: updateId ? `${url}/${Array.isArray(updateId) ? updateId.join("/") : updateId}` : url, data, method: "post", responseType: responseType ? responseType : "" }, router), {
    onSuccess: (resDta) => {
      if (resDta?.response?.data?.success === !true) {
        ToastNotification("error", resDta?.response?.data?.message);
      } else {
        !notHandler && SuccessHandle(resDta, router, path, message, pathname);
        extraFunction && extraFunction(resDta);
      }
    },
    onError: (err) => {
      // Surface API failures — otherwise a rejected save is completely
      // silent and looks like "the API did not respond".
      const apiMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      const fallback = err?.request && !err?.response ? "API not reachable — is the server running?" : err?.message;
      ToastNotification("error", apiMessage ? `${apiMessage}${status ? ` (${status})` : ""}` : fallback);
      errFunction && errFunction(err);
      return err;
    },
  });
};

export default useCreate;
