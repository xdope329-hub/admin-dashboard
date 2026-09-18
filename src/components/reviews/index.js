import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TableWrapper from "../../utils/hoc/TableWrapper";
import ShowTable from "../table/ShowTable";
import Loader from "../commonComponent/Loader";
import usePermissionCheck from "@/utils/hooks/usePermissionCheck";
import ReviewModerationActions from "./ReviewModerationActions";

const STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
const PREVIEW_LENGTH = 90;

// Listado de reseñas con moderación: cada fila muestra la opinión, su estado
// (pendiente / aprobada / rechazada) y los botones para aprobar o rechazar.
// Solo las aprobadas se publican en la tienda.
const AllReviewsTable = ({ data, refetch, ...props }) => {
  const { t } = useTranslation("common");
  const [edit, destroy] = usePermissionCheck(["edit", "destroy"]);

  const headerObj = {
    checkBox: true,
    isOption: destroy == false ? false : true,
    noEdit: true,
    optionHead: { title: "Action" },
    isSerialNo: false,
    column: [
      { title: "Image", apiKey: "product_thumbnail", type: "image", class: "sm-width" },
      { title: "CustomerName", apiKey: "consumer", sortBy: "desc", subKey: ["name"] },
      { title: "ProductName", apiKey: "product", subKey: ["name"] },
      { title: "Rating", apiKey: "rating", type: "rating", sorting: true },
      { title: "Opinion", apiKey: "description_preview" },
      { title: "Status", apiKey: "status_badge", sorting: true },
      { title: "CreateAt", apiKey: "created_at", sorting: true, sortBy: "desc", type: "date" },
      { title: "Moderation", apiKey: "moderation" },
    ],
    data: data || [],
  };

  const rows = useMemo(
    () =>
      (data || []).map((element) => {
        const slug = element?.status_slug || "pending";
        const text = element?.description || "";
        return {
          ...element,
          product_thumbnail: element?.product?.product_thumbnail,
          description_preview: text ? (
            <span title={text} className="d-inline-block text-truncate" style={{ maxWidth: 260 }}>
              {text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH)}…` : text}
            </span>
          ) : (
            <span className="text-muted">—</span>
          ),
          status_badge: (
            <div className={`status-${slug}`}>
              <span>{t(STATUS_LABEL[slug] || slug)}</span>
            </div>
          ),
          moderation: <ReviewModerationActions review={element} refetch={refetch} canEdit={edit} />,
        };
      }),
    [data, edit, refetch, t]
  );
  headerObj.data = rows;

  if (!data) return <Loader />;
  return (
    <>
      <ShowTable {...props} refetch={refetch} headerData={headerObj} />
    </>
  );
};

export default TableWrapper(AllReviewsTable);
