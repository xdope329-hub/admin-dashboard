import { mimeImageMapping } from "@/data/MimeImageType";
import { ErrorMessage } from "formik";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
import { Input } from "reactstrap";
import InputWrapper from "../../utils/hoc/InputWrapper";
import { handleModifier } from "../../utils/validation/ModifiedErrorMessage";
import AttachmentModal from "../attachment/widgets/attachmentModal";

const FileUploadField = ({ values, updateId, setFieldValue, errors, multiple, loading, showImage, paramsProps, ...props }) => {
  // For flat names like "product_thumbnail_id" → "product_thumbnail"
  // For nested names like "variations[0][variation_images_id]" → "variations[0][variation_images]"
  const storeImageObject = props.name.includes('[')
    ? props.name.replace(/_id\]$/, ']')
    : props.name.split("_id")[0];
  const { t } = useTranslation("common");
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const dragIndex = useRef(null);

  useEffect(() => {
    if (values) {
      multiple ? setSelectedImage(values[storeImageObject]) : values[storeImageObject] ? setSelectedImage(loading ? null : [values[storeImageObject]]) : values[props.name] ? setSelectedImage([values[props.name]]) : setSelectedImage([]);
    }
  }, [values[storeImageObject], loading]);

  useEffect(() => {
    if (props?.uniquename) {
      if (Array.isArray(props?.uniquename)) {
        const onlyIds = props?.uniquename?.map((data) => data.id);
        setSelectedImage(loading ? null : props?.uniquename);
        setFieldValue(props?.name, onlyIds);
      } else {
        setSelectedImage(loading ? null : [props?.uniquename]);
        setFieldValue(props?.name, props?.uniquename?.id);
      }
    }
  }, [props?.uniquename, loading, showImage]);

  const removeImage = (result) => {
    if (props.name) {
      if (multiple) {
        let updatedImage = selectedImage.filter((elem) => elem.id !== result.id);
        setSelectedImage(updatedImage);
        setFieldValue(storeImageObject, updatedImage);
      } else {
        setFieldValue(props?.name, Array.isArray(values[props.name]) ? values[props.name].filter((el) => el !== result.id) : null);
        setSelectedImage(selectedImage.filter((elem) => elem.id !== result.id));
        setFieldValue(storeImageObject, "");
      }
    }
  };

  const applyReorder = (newOrder) => {
    setSelectedImage(newOrder);
    setFieldValue(storeImageObject, newOrder);
    setFieldValue(props.name, newOrder.map((img) => img.id));
  };

  const handleDragStart = (i) => { dragIndex.current = i; };

  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const reordered = [...selectedImage];
    const dragged = reordered.splice(dragIndex.current, 1)[0];
    reordered.splice(i, 0, dragged);
    dragIndex.current = i;
    applyReorder(reordered);
  };

  const handleDragEnd = () => { dragIndex.current = null; };

  const getMimeTypeImage = (result) => {
    return mimeImageMapping[result?.mime_type] ?? result?.original_url?.split("/")[1] == "storage" ? result?.original_url : result?.original_url;
  };

  const ImageShow = () => {
    return (
      <>
        {selectedImage?.length > 0 &&
          selectedImage?.map((result, i) => (
            <li
              key={result?.id || i}
              draggable={!!multiple}
              onDragStart={multiple ? () => handleDragStart(i) : undefined}
              onDragOver={multiple ? (e) => handleDragOver(e, i) : undefined}
              onDragEnd={multiple ? handleDragEnd : undefined}
              style={multiple ? { cursor: 'grab' } : undefined}
            >
              <div className="media-img-box">
                <Image src={getMimeTypeImage(result)} className="img-fluid" alt="ratio image" height={130} width={130} />
                <p className="remove-icon">
                  <RiCloseLine onClick={() => removeImage(result)} />
                </p>
              </div>
              <h6>{result?.file_name}</h6>
            </li>
          ))}
      </>
    );
  };

  return (
    <>
      <ul className={`image-select-list`}>
        <li className="choosefile-input">
          <Input
            {...props}
            onClick={(event) => {
              event.preventDefault();
              setModal(props.id);
            }}
          />
          <label htmlFor={props.id}>
            <Image height={40} width={40} src={"/assets/images/add-image.png"} className="img-fluid" alt="" />
          </label>
        </li>

        <ImageShow />

        <AttachmentModal paramsProps={paramsProps} modal={modal == props.id} name={props.name} multiple={multiple} values={values} setModal={setModal} setFieldValue={setFieldValue} setSelectedImage={setSelectedImage} selectedImage={selectedImage} showImage={showImage} redirectToTabs={true} />
      </ul>
      <p className="help-text">{props?.helpertext}</p>
      {errors?.[props?.name] ? (
        <ErrorMessage
          name={props.name}
          render={(msg) => (
            <div className="invalid-feedback d-block">
              {t(handleModifier(storeImageObject).split(" ").join(""))} {t("IsRequired")}
            </div>
          )}
        />
      ) : null}
    </>
  );
};

export default InputWrapper(FileUploadField);
