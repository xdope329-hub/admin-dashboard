import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowGoBackLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import request from "../../utils/axiosUtils";
import { ReviewAPI, StatisticsCountAPI } from "../../utils/axiosUtils/API";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";

// Aprobar / rechazar una reseña (PUT /review/:id/status). Una reseña solo se
// muestra en la tienda cuando está aprobada; rechazada o pendiente no cuenta
// para el promedio del producto.
const ACTIONS = {
  approved: { title: "Approve", icon: <RiCheckLine />, className: "btn-primary", done: "ReviewApproved" },
  rejected: { title: "Reject", icon: <RiCloseLine />, className: "btn-outline-danger", done: "ReviewRejected" },
  pending: { title: "MarkAsPending", icon: <RiArrowGoBackLine />, className: "btn-outline-secondary", done: "ReviewPendingAgain" },
};

const ReviewModerationActions = ({ review, refetch, canEdit }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  if (!canEdit) return null;

  const current = review?.status_slug || "pending";
  const available = Object.keys(ACTIONS).filter((slug) => slug !== current);

  const moderate = async (status) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await request({ url: `${ReviewAPI}/${review.id}/status`, method: "put", data: { status } }, router);
      if (res?.status === 200) {
        ToastNotification("success", t(ACTIONS[status].done));
        refetch && refetch();
        // Contadores de las pestañas (pendiente / aprobada / rechazada).
        queryClient.invalidateQueries({ queryKey: [StatisticsCountAPI] });
      } else {
        ToastNotification("error", res?.response?.data?.message || res?.data?.message);
      }
    } catch (err) {
      ToastNotification("error", err?.response?.data?.message || err?.message);
    }
    setBusy(false);
  };

  return (
    <div className="d-flex gap-2 flex-wrap review-moderation-actions">
      {available.map((slug) => (
        <button key={slug} type="button" disabled={busy} className={`btn btn-sm d-inline-flex align-items-center gap-1 ${ACTIONS[slug].className}`} onClick={() => moderate(slug)} title={t(ACTIONS[slug].title)}>
          {ACTIONS[slug].icon}
          <span>{t(ACTIONS[slug].title)}</span>
        </button>
      ))}
    </div>
  );
};

export default ReviewModerationActions;
