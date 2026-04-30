import CheckBoxField from '../inputFields/CheckBoxField';
import FileUploadField from '../inputFields/FileUploadField';
import { useTranslation } from 'react-i18next';

const LoaderTab = ({ values, setFieldValue, errors }) => {
  const { t } = useTranslation('common');
  const useCustom = values?.values?.general?.use_custom_loader;

  return (
    <>
      <CheckBoxField name="[values][general][use_custom_loader]" title="UseCustomLoader" />
      {useCustom && (
        <FileUploadField
          name="loader_gif_image_id"
          uniquename={values?.values?.general?.loader_gif_image}
          title="LoaderGIF"
          errors={errors}
          id="loader_gif_image_id"
          type="file"
          values={values}
          setFieldValue={setFieldValue}
        />
      )}
    </>
  );
};

export default LoaderTab;
