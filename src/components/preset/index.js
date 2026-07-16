"use client";
import request from "@/utils/axiosUtils";
import { PresetAPI, PresetApplyAPI } from "@/utils/axiosUtils/API";
import { ToastNotification } from "@/utils/customFunctions/ToastNotification";
import useCreate from "@/utils/hooks/useCreate";
import useCustomMutation from "@/utils/hooks/useCustomMutation";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import useDelete from "@/utils/hooks/useDelete";
import useUpdate from "@/utils/hooks/useUpdate";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiAddLine } from "react-icons/ri";
import { Button, Col, Row } from "reactstrap";
import CustomModal from "../common/CustomModal";
import Loader from "../commonComponent/Loader";
import NoDataFound from "../commonComponent/NoDataFound";
import PresetCard from "./PresetCard";
import PresetForm from "./PresetForm";

const PresetsPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmApply, setConfirmApply] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, refetch } = useCustomQuery(
    [PresetAPI],
    () => request({ url: PresetAPI }, router),
    { refetchOnWindowFocus: false, select: (res) => res?.data }
  );

  const invalidatePresets = () => queryClient.invalidateQueries({ queryKey: [PresetAPI] });

  const { mutate: createPreset, isLoading: creating } = useCreate(
    PresetAPI,
    false,
    false,
    t("PresetCreated"),
    () => { setCreateOpen(false); invalidatePresets(); }
  );

  const { mutate: updatePreset, isLoading: updating } = useUpdate(
    PresetAPI,
    editTarget?.id,
    false,
    t("PresetUpdated"),
    () => { setEditTarget(null); invalidatePresets(); }
  );

  const { mutate: deletePreset } = useDelete(PresetAPI, PresetAPI, () => {
    setConfirmDelete(null);
    invalidatePresets();
  });

  const { mutate: applyPreset, isLoading: applying } = useCustomMutation(
    (id) => request({ url: PresetApplyAPI(id), method: "post" }, router),
    {
      onSuccess: () => {
        ToastNotification("success", t("PresetApplied"));
        setConfirmApply(null);
        // Refresh Settings & ThemeOptions everywhere they're cached in admin.
        queryClient.invalidateQueries({ queryKey: ["/settings"] });
        queryClient.invalidateQueries({ queryKey: ["/themeOptions"] });
      },
      onError: (err) => ToastNotification("error", err?.response?.data?.message),
    }
  );

  const presets = data?.data || [];

  return (
    <Col sm="12">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">{t("Presets")}</h4>
        <Button color="primary" onClick={() => setCreateOpen(true)}>
          <RiAddLine className="me-1" />
          {t("NewPreset")}
        </Button>
      </div>

      <p className="text-muted small mb-3">{t("PresetsHelpText")}</p>

      {isLoading ? (
        <Loader />
      ) : presets.length === 0 ? (
        <NoDataFound customClass="no-data-added" />
      ) : (
        <Row>
          {presets.map((preset) => (
            <Col xxl="3" xl="4" md="6" sm="12" key={preset.id || preset._id} className="mb-4">
              <PresetCard
                preset={preset}
                applying={applying && confirmApply?.id === preset.id}
                onApply={(p) => setConfirmApply(p)}
                onEdit={(p) => setEditTarget(p)}
                onDelete={(p) => setConfirmDelete(p)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Create modal */}
      <CustomModal
        modal={createOpen}
        setModal={setCreateOpen}
        extraFunction={() => setCreateOpen(false)}
        classes={{ title: "NewPreset" }}
      >
        <PresetForm
          onSubmit={(payload) => createPreset(payload)}
          buttonName={creating ? "Saving" : "Save"}
        />
      </CustomModal>

      {/* Edit modal */}
      <CustomModal
        modal={!!editTarget}
        setModal={() => setEditTarget(null)}
        extraFunction={() => setEditTarget(null)}
        classes={{ title: "EditPreset" }}
      >
        {editTarget && (
          <PresetForm
            isEdit
            initialValues={editTarget}
            onSubmit={(payload) => updatePreset(payload)}
            buttonName={updating ? "Saving" : "Update"}
          />
        )}
      </CustomModal>

      {/* Apply confirm */}
      <CustomModal
        modal={!!confirmApply}
        setModal={() => setConfirmApply(null)}
        extraFunction={() => setConfirmApply(null)}
        classes={{ title: "ApplyPreset" }}
      >
        <p>{t("ApplyPresetConfirm", { name: confirmApply?.name })}</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button color="light" onClick={() => setConfirmApply(null)}>{t("Cancel")}</Button>
          <Button color="primary" onClick={() => applyPreset(confirmApply.id)} disabled={applying}>
            {applying ? t("Applying") : t("Apply")}
          </Button>
        </div>
      </CustomModal>

      {/* Delete confirm */}
      <CustomModal
        modal={!!confirmDelete}
        setModal={() => setConfirmDelete(null)}
        extraFunction={() => setConfirmDelete(null)}
        classes={{ title: "DeletePreset" }}
      >
        <p>{t("DeletePresetConfirm", { name: confirmDelete?.name })}</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button color="light" onClick={() => setConfirmDelete(null)}>{t("Cancel")}</Button>
          <Button color="danger" onClick={() => deletePreset(confirmDelete.id)}>{t("Delete")}</Button>
        </div>
      </CustomModal>
    </Col>
  );
};

export default PresetsPage;
