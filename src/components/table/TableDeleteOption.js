import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiDeleteBinLine } from "react-icons/ri";
import ShowModal from "../../elements/alerts&Modals/Modal";
import Btn from "../../elements/buttons/Btn";
import request from "../../utils/axiosUtils";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";

const TableDeleteOption = ({ url, isCheck, setIsCheck }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Bulk delete: DELETE {url}/{id} per selected row. Failures (e.g. an
  // item that is in use, or already gone) don't abort the rest.
  const handleDelete = async (deleteIds) => {
    setIsLoading(true);
    const results = await Promise.allSettled(
      deleteIds.map((id) => request({ url: `${url}/${id}`, method: "delete" }, router))
    );
    setIsLoading(false);
    setModal(false);
    setIsCheck([]);
    queryClient.invalidateQueries({ queryKey: [url] });

    const failed = results.filter((r) => r.status === "rejected").length;
    const deleted = results.length - failed;
    if (failed === 0) {
      ToastNotification("success", t("DeletedSuccessfully"));
    } else if (deleted > 0) {
      ToastNotification("warning", `${deleted} ${t("DeletedSuccessfully")} — ${failed} ${t("Failed")}`);
    } else {
      ToastNotification("error", t("SomethingWentWrong"));
    }
  };

  return (
    <>
      <a className="align-items-center btn btn-outline btn-sm d-flex" onClick={() => setModal(true)}>
        <RiDeleteBinLine /> {t("Delete")}
      </a>
      <ShowModal
        open={modal}
        close={false}
        setModal={setModal}
        buttons={
          <>
            <Btn
              title="No"
              onClick={() => {
                setModal(false);
              }}
              className="btn-md btn-outline fw-bold"
            />
            <Btn
              title="Yes"
              className="btn-theme btn-md fw-bold"
              loading={Number(isLoading)}
              disabled={isLoading}
              onClick={() => {
                handleDelete(isCheck);
              }}
            />
          </>
        }
      >
        <div className="remove-box">
          <div className="remove-icon">
            <RiDeleteBinLine className="icon-box" />
          </div>
          <h2 className="mt-2">{t("DeleteItem")}?</h2>
          <p>{t("ThisItemWillBeDeletedPermanently") + " " + t("YouCan'tUndoThisAction!!")} </p>
        </div>
      </ShowModal>
    </>
  );
};

export default TableDeleteOption;
