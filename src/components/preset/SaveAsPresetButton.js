import { PresetAPI } from "@/utils/axiosUtils/API";
import useCreate from "@/utils/hooks/useCreate";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiBookmarkLine } from "react-icons/ri";
import { Button } from "reactstrap";
import CustomModal from "../common/CustomModal";
import PresetForm from "./PresetForm";

// Reusable "Save as preset" trigger dropped into SettingForm / ThemeOptionForm.
// The button captures the CURRENTLY SAVED backend state — unsaved form edits
// are not part of the snapshot. Copy on the modal makes that clear.
const SaveAsPresetButton = ({ presetType }) => {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useCreate(
    PresetAPI,
    false,
    false,
    t("PresetCreated"),
    () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [PresetAPI] });
    }
  );

  return (
    <>
      <Button color="light" className="btn-lg me-2" type="button" onClick={() => setOpen(true)}>
        <RiBookmarkLine className="me-1" />
        {t("SaveAsPreset")}
      </Button>
      <CustomModal
        modal={open}
        setModal={setOpen}
        extraFunction={() => setOpen(false)}
        classes={{ title: "SaveAsPreset" }}
      >
        <p className="text-muted small mb-3">{t("PresetsHelpText")}</p>
        <PresetForm
          initialValues={{ type: presetType }}
          lockType
          onSubmit={(payload) => mutate({ ...payload, type: presetType })}
          buttonName={isLoading ? "Saving" : "Save"}
        />
      </CustomModal>
    </>
  );
};

export default SaveAsPresetButton;
