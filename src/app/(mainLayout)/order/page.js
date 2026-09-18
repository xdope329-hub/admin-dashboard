"use client";
import AllOrdersTable from "@/components/orders/AllOrdersTable";
import { filterPills, paymentPills } from "@/data/OrderTable";
import request from "@/utils/axiosUtils";
import { OrderAPI, StatisticsCountAPI } from "@/utils/axiosUtils/API";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";

/**
 * Listado de pedidos con DOS filtros independientes que se combinan:
 *  - `status`  → estado del PEDIDO (logística: processing, shipped, …),
 *    filtra por status_id en el API.
 *  - `payment` → estado del PAGO (p. ej. "Mercado Pago — Pagados"),
 *    filtra por payment_method + payment_status en el API.
 * Un pedido pagado por Mercado Pago y ya enviado aparece tanto en
 * "Pagados" como en "Enviado"; elegir una pestaña no desactiva la otra.
 */
const Order = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { data: StatisticsCountData, refetch, isLoading } = useCustomQuery([StatisticsCountAPI], () => request({ url: StatisticsCountAPI }, router), { refetchOnWindowFocus: false, select: (data) => data?.data });
  const [isCheck, setIsCheck] = useState([]);
  const [storeFilterData, setStoreFilterData] = useState([]);
  const searchParams = useSearchParams();
  const statusValue = searchParams.get("status");
  const paymentValue = searchParams.get("payment");
  const activePayment = paymentPills.find((pill) => pill.value === paymentValue) || null;

  // Filtros que se envían al API: ambos a la vez, cada uno por su campo.
  const paramsProps = useMemo(
    () => ({ status: statusValue ?? null, ...(activePayment ? activePayment.params : {}) }),
    [statusValue, paymentValue] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Enlaces que conservan el otro filtro activo.
  const withStatus = (status) => ({ ...(status ? { status } : {}), ...(paymentValue ? { payment: paymentValue } : {}) });
  const withPayment = (payment) => ({ ...(statusValue ? { status: statusValue } : {}), ...(payment ? { payment } : {}) });

  useEffect(() => {
    refetch();
  }, [isLoading]);
  // Las pestañas se arman aunque /statistics/count aún no haya respondido
  // (antes se leía StatisticsCountData sin proteger → TypeError y la página
  // quedaba en blanco si la petición fallaba o iba lenta).
  useEffect(() => {
    setStoreFilterData(
      filterPills.map((pill) => ({
        ...pill,
        count: StatisticsCountData?.[pill?.countKey] ?? 0,
      }))
    );
  }, [isLoading, StatisticsCountData]);

  return (
    <Col sm="12">
      <AllOrdersTable
        differentFilter={
          <div className="show-box mb-4 order-filter-groups">
            <div className="order-filter-group d-flex align-items-center overflow-custom">
              <span className="order-filter-label">{t("OrderStatus")}:</span>
              <ul className="order-tab-content">
                <li className={`${!statusValue ? "active" : ""}`}>
                  <Link href={{ pathname: `/order`, query: withStatus(null) }}>
                    {t("All")} <span>{StatisticsCountData?.total_orders ?? 0}</span>
                  </Link>
                </li>
                {storeFilterData.length > 0 &&
                  storeFilterData?.map((status, index) => (
                    <li key={index} className={`${statusValue === status.value ? "active" : ""} ${status.color}`}>
                      <Link href={{ pathname: `/order`, query: withStatus(status.value) }}>
                        {t(status.label)} <span>{status.count}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="order-filter-group d-flex align-items-center overflow-custom mt-2">
              <span className="order-filter-label">{t("PaymentStatus")}:</span>
              <ul className="order-tab-content">
                <li className={`${!paymentValue ? "active" : ""}`}>
                  <Link href={{ pathname: `/order`, query: withPayment(null) }}>{t("AllPayments")}</Link>
                </li>
                {paymentPills.map((pill) => (
                  <li key={pill.value} className={`${paymentValue === pill.value ? "active" : ""} ${pill.color}`}>
                    <Link href={{ pathname: `/order`, query: withPayment(pill.value) }}>
                      {t(pill.label)} <span>{StatisticsCountData?.[pill.countKey] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
        paramsProps={paramsProps}
        url={OrderAPI}
        dateRange={true}
        moduleName="Order"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
      />
    </Col>
  );
};

export default Order;
