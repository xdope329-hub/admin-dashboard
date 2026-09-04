"use client";
import AllReviewsTable from "@/components/reviews";
import request from "@/utils/axiosUtils";
import { ReviewAPI, StatisticsCountAPI } from "@/utils/axiosUtils/API";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";

// Pestañas de moderación. `value` viaja al API como ?status=<slug>.
const REVIEW_TABS = [
  { value: "pending", label: "Pending", countKey: "total_pending_reviews", color: "pending" },
  { value: "approved", label: "Approved", countKey: "total_approved_reviews", color: "delivered" },
  { value: "rejected", label: "Rejected", countKey: "total_rejected_reviews", color: "cancelled" },
];

const Reviews = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusValue = searchParams.get("status");
  const [isCheck, setIsCheck] = useState([]);
  const paramsProps = useMemo(() => ({ status: statusValue ?? null }), [statusValue]);

  const { data: counts } = useCustomQuery([StatisticsCountAPI], () => request({ url: StatisticsCountAPI }, router), {
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  return (
    <Col sm="12">
      <AllReviewsTable
        url={ReviewAPI}
        moduleName="Reviews"
        onlyTitle={true}
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        paramsProps={paramsProps}
        differentFilter={
          <div className="show-box mb-4 order-filter-groups">
            <div className="order-filter-group d-flex align-items-center overflow-custom">
              <span className="order-filter-label">{t("Status")}:</span>
              <ul className="order-tab-content">
                <li className={`${!statusValue ? "active" : ""}`}>
                  <Link href={{ pathname: "/review" }}>
                    {t("All")} <span>{counts?.total_reviews ?? 0}</span>
                  </Link>
                </li>
                {REVIEW_TABS.map((tab) => (
                  <li key={tab.value} className={`${statusValue === tab.value ? "active" : ""} ${tab.color}`}>
                    <Link href={{ pathname: "/review", query: { status: tab.value } }}>
                      {t(tab.label)} <span>{counts?.[tab.countKey] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-muted mb-0 mt-2" style={{ fontSize: 13 }}>
              {t("ReviewModerationHint")}
            </p>
          </div>
        }
      />
    </Col>
  );
};

export default Reviews;
