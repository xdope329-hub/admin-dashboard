import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import ShowModal from "../../elements/alerts&Modals/Modal";
import Btn from "../../elements/buttons/Btn";
import request from "../../utils/axiosUtils";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";
import usePermissionCheck from "../../utils/hooks/usePermissionCheck";
import ViewDetailBody from "./ViewDetailBody";

// Modal "ver detalle" de las tablas con aprobación (reembolsos). Los botones
// Aprobado / Rechazado hacen PUT {url}/{id} con { status } y refrescan la
// tabla; antes solo cerraban el modal sin llamar al API.
const ViewDetails = ({ fullObj, tableData, refetch }) => {
  const [loadingState, setLoadingState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [action] = usePermissionCheck(["action"], tableData?.permissionKey);
  const router = useRouter();
  const [modal, setModal] = useState(false);

  const OnStatusClick = async (value) => {
    if (!tableData?.url || !fullObj?.id) return setModal(false);
    setLoadingState(value);
    setIsLoading(true);
    try {
      const res = await request({ url: `${tableData.url}/${fullObj.id}`, method: "put", data: { status: value } }, router);
      if (res?.status === 200) {
        ToastNotification("success", tableData?.message || "Status updated");
        refetch && refetch();
        setModal(false);
      } else {
        ToastNotification("error", res?.response?.data?.message || res?.data?.message);
      }
    } catch (err) {
      ToastNotification("error", err?.response?.data?.message || err?.message);
    }
    setIsLoading(false);
    setLoadingState("");
  };
  const redirectLink = () => {
    const order_number = fullObj?.order_number?.props?.children?.[1];
    router.push(`${tableData?.redirectUrl}/${order_number}`);
  };
  return (
    <>
      <div>
        <a
          onClick={() => {
            tableData?.redirectUrl ? redirectLink() : setModal(true);
          }}
        >
          <RiEyeLine className="ri-pencil-line" />
        </a>
      </div>
      <ShowModal
        open={modal}
        title={tableData.modalTitle}
        close={true}
        setModal={setModal}
        buttons={
          <>
            {action && fullObj?.status == "pending" && (
              <>
                <Btn title="Rejected" onClick={() => OnStatusClick("rejected")} loading={Number(loadingState == "rejected" && isLoading)} disabled={isLoading} className="btn-md btn-outline fw-bold" />
                <Btn title="Approved" loading={Number(loadingState == "approved" && isLoading)} disabled={isLoading} onClick={() => OnStatusClick("approved")} className="btn-theme btn-md fw-bold" />
              </>
            )}
          </>
        }
      >
        <ViewDetailBody fullObj={fullObj} />
      </ShowModal>
    </>
  );
};

export default ViewDetails;
