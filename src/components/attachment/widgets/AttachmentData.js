import Image from "next/image";
import { useTranslation } from "react-i18next";
import { RiLockLine } from "react-icons/ri";
import { Input, Label } from "reactstrap";
import NoDataFound from "../../commonComponent/NoDataFound";

const AttachmentData = ({ state, dispatch, attachmentsData, refetch }) => {
  const { t } = useTranslation("common");
  let mimeImageMapping = [
    { mimeType: "application/pdf", imagePath: "/assets/images/pdf.png" },
    { mimeType: "application/msword", imagePath: "/assets/images/word.png" },
    { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", imagePath: "/assets/images/word.png" },
    { mimeType: "application/vnd.ms-excel", imagePath: "/assets/images/xls.png" },
    { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", imagePath: "/assets/images/xls.png" },
    { mimeType: "application/vnd.ms-powerpoint", imagePath: "/assets/images/folder.png" },
    { mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", imagePath: "/assets/images/folder.png" },
    { mimeType: "text/plain", imagePath: "/assets/images/txt.png" },
    { mimeType: "audio/mpeg", imagePath: "/assets/images/sound.png" },
    { mimeType: "audio/wav", imagePath: "/assets/images/sound.png" },
    { mimeType: "audio/ogg", imagePath: "/assets/images/sound.png" },
    { mimeType: "video/mp4", imagePath: "/assets/images/video.png" },
    { mimeType: "video/webm", imagePath: "/assets/images/video.png" },
    { mimeType: "video/ogg", imagePath: "/assets/images/video.png" },
    { mimeType: "application/zip", imagePath: "/assets/images/zip.png" },
    { mimeType: "application/x-tar", imagePath: "/assets/images/zip.png" },
    { mimeType: "application/gzip", imagePath: "/assets/images/zip.png" },
  ];

  // Deleting the selected images from media module. In-use attachments
  // are locked to prevent accidental removal — the checkbox is disabled
  // and any attempt to toggle is ignored.
  const ChoseImages = (e, item) => {
    if (item.is_used) return;
    let temp = [...state.deleteImage];
    if (temp?.includes(item.id) && !e.target.checked) {
      temp.splice(temp.indexOf(item.id), 1);
      dispatch({ type: "DeleteSelectedImage", payload: temp });
    }
    if (e.target.checked) {
      dispatch({ type: "DeleteSelectedImage", payload: [...state.deleteImage, item.id] });
    }
  };

  const getMimeTypeImage = (mimeType) => {
    return mimeImageMapping?.find((value) => value.mimeType === mimeType)?.imagePath;
  };
  return (
    <>
    {attachmentsData?.length > 0 ? (
      attachmentsData.map((elem, i) => {
        const isImage = elem.mime_type && elem.mime_type.startsWith("image");
        const imageUrl = isImage ? elem.original_url : getMimeTypeImage(elem.mime_type);

        return imageUrl ? (
          <div key={i}>
            <div className={`library-box${elem.is_used ? " library-box-used" : ""}`} style={{ position: "relative" }}>
              <Input type="checkbox" id={elem.id} checked={state.deleteImage?.includes(elem.id)} onChange={(e) => ChoseImages(e, elem)} disabled={elem.is_used} />
              <Label htmlFor={elem.id}>
                <div className="ratio ratio-1x1">
                  <Image src={imageUrl} className="img-fluid" alt="attachment" height={130} width={130} style={elem.is_used ? { filter: "brightness(0.85)" } : undefined} />
                </div>
              </Label>
              {elem.is_used && (
                <span
                  title={t("InUseCannotDelete")}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 11,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    pointerEvents: "auto",
                    zIndex: 2,
                  }}
                >
                  <RiLockLine size={12} />
                  {t("InUse")}
                </span>
              )}
            </div>
          </div>
        ) : null; // If imageUrl is empty, do not render the Image component
      })
    ) : (
      <NoDataFound noImage={false} title="NoMediaFound" />
    )}
  </>   
  );
};

export default AttachmentData;
