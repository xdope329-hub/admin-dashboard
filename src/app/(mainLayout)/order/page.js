"use client";
import AllOrdersTable from "@/components/orders/AllOrdersTable";
import { filterPills } from "@/data/OrderTable";
import request from "@/utils/axiosUtils";
import { OrderAPI, StatisticsCountAPI } from "@/utils/axiosUtils/API";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";

const Order = () => {
  const { t } = useTranslation("common");
  const  router = useRouter()
  const { data: StatisticsCountData, refetch, isLoading, } = useCustomQuery([StatisticsCountAPI], () => request({ url: StatisticsCountAPI },router), { refetchOnWindowFocus: false, select: (data) => data?.data });
  const [isCheck, setIsCheck] = useState([]);
  const [storeFilterData, setStoreFilterData] = useState([]);
  const searchParams = useSearchParams();
  const statusValue = searchParams.get("status");
  // Pestaña de pagos (por ahora: "mercadopago_paid" = pagados por Mercado Pago)
  const paymentValue = searchParams.get("payment");

  // Filtros que se envían al API según la pestaña activa.
  const paramsProps = useMemo(() => {
    if (paymentValue === "mercadopago_paid") {
      // Un pago aprobado por la pasarela deja payment_status='completed'.
      return { payment_method: "mercadopago", payment_status: "completed" };
    }
    return { status: statusValue ?? null };
  }, [statusValue, paymentValue]);
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
          <div className="show-box mb-4 d-flex overflow-custom">
            <ul className="order-tab-content">
              <li className={`${!statusValue && !paymentValue ? "active" : ""}`}><Link href={`/order`}> All <span> {StatisticsCountData?.total_orders}</span>  </Link></li>
              {storeFilterData.length > 0 &&
                storeFilterData?.map((status, index) => (
                  <li key={index} className={`${!paymentValue && statusValue === status.value ? "active" : ""} ${status.color}`}>
                    <Link
                      href={{
                        pathname: `/order`,
                        query: { status: status.value },
                      }}
                    >
                      {status.label} <span>{status.count}</span>
                    </Link>
                  </li>
                ))}
              {/* Pagados por Mercado Pago: órdenes con el pago confirmado
                  por la pasarela (payment_status = completed). */}
              <li className={`${paymentValue === "mercadopago_paid" ? "active" : ""} completed`}>
                <Link href={{ pathname: `/order`, query: { payment: "mercadopago_paid" } }}>
                  {t("MercadoPagoPaid")} <span>{StatisticsCountData?.total_mercadopago_paid_orders ?? 0}</span>
                </Link>
              </li>
            </ul>
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
