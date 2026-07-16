import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import FileUploadField from "../inputFields/FileUploadField";
import SelectField from "../inputFields/SelectField";
import SimpleInputField from "../inputFields/SimpleInputField";

// Modal form used to create a new preset (from the /preset page) or edit an
// existing one. On create, submitting the form triggers a POST /presets that
// snapshots the current Settings/ThemeOption values on the server. On edit,
// only name/description/thumbnail are patched — snapshots are not re-taken.
const PresetForm = ({ initialValues, isEdit, lockType, onSubmit, buttonName }) => {
  const { t } = useTranslation("common");

  const typeOptions = [
    { id: "both", name: t("PresetTypeBoth") },
    { id: "themeOption", name: t("PresetTypeThemeOption") },
    { id: "settings", name: t("PresetTypeSettings") },
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        type: initialValues?.type || "both",
        thumbnail_id: initialValues?.thumbnail_id || "",
        thumbnail: initialValues?.thumbnail || "",
      }}
      validationSchema={YupObject({ name: nameSchema })}
      onSubmit={(values) => {
        const payload = {
          name: values.name,
          description: values.description,
          thumbnail_id: values.thumbnail_id || null,
        };
        if (!isEdit) payload.type = values.type;
        onSubmit(payload);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            <SimpleInputField
              nameList={[
                { name: "name", title: "Name", placeholder: t("EnterPresetName"), require: "true" },
                { name: "description", type: "textarea", title: "Description", placeholder: t("EnterDescription") },
              ]}
            />
            {!isEdit && (
              <SelectField
                name="type"
                title="PresetType"
                disabled={!!lockType}
                inputprops={{ options: typeOptions, id: "type", name: "type" }}
              />
            )}
            <FileUploadField
              name="thumbnail_id"
              title="Thumbnail"
              id="preset_thumbnail_id"
              type="file"
              values={values}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
            />
            <FormBtn buttonName={buttonName || (isEdit ? "Update" : "Save")} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default PresetForm;
