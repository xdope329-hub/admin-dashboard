import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import TableWrapper from '@/utils/hoc/TableWrapper';
import { useTranslation } from "react-i18next";
import ShowTable from '../table/ShowTable';

// Valores antiguos del estado de pago que quedaron en pedidos viejos.
const PAYMENT_ALIASES = { paid: 'completed', approved: 'completed', failed: 'rejected' };
const normalizePayment = (value) => {
    const raw = String(value || '').toLowerCase();
    return PAYMENT_ALIASES[raw] || raw;
};

const AllOrdersTable = ({ data, ...props }) => {

    const { t } = useTranslation('common');
    const router = useRouter()
    const getSpanTag = (number) => {
        return <span className="fw-bolder">#{number}</span>;
    };
    const headerObj = {
        checkBox: false,
        isOption: true,
        isSerialNo: false,
        optionHead: { title: "Action", type: 'View', redirectUrl: "/order/details", modalTitle: t("Orders") },
        // Estado del PEDIDO (logística) y estado del PAGO son columnas
        // distintas: antes la lista solo mostraba el pago y parecía el
        // estado del pedido.
        column: [
            { title: "OrderNumber", apiKey: "order_number" },
            { title: "OrderDate", apiKey: "created_at", sorting: true, sortBy: "desc", type: "date" },
            { title: "CustomerName", apiKey: "consumer", subKey: ["name"] },
            { title: "TotalAmount", apiKey: "total", type: 'price' },
            { title: "OrderStatus", apiKey: "order_status_badge" },
            { title: "PaymentStatus", apiKey: "payment_status" },
            { title: "PaymentMode", apiKey: "payment_method" }
        ],
        data: data || []
    };
    let orders = useMemo(() => {
        return headerObj?.data?.filter((element) => {
            element.order_number = getSpanTag(element.order_number);
            const orderStatus = element?.order_status;
            element.order_status_badge = orderStatus?.slug ? <div className={`status-${orderStatus.slug}`}><span>{orderStatus?.name || orderStatus.slug}</span></div> : '-';
            const payment = normalizePayment(element?.payment_status);
            element.payment_status = payment ? <div className={`payment-${payment}`}><span>{t(`Payment_${payment}`, { defaultValue: payment })}</span></div> : '-';
            element.payment_mode = element.payment_method ? <div className="payment-mode"><span>{element?.payment_method}</span></div> : '-';
            element.consumer_name = <span className="text-capitalize">{element?.consumer?.name}</span>;
            return element;
        });
    }, [headerObj?.data]);
    headerObj.data = headerObj ? orders : [];

    const redirectLink = (data) => {
        const order_number = data?.order_number?.props?.children?.[1]
        router.push(`/order/details/${order_number}`)
    }
    if (!data) return null;
    return (
        <>
            <ShowTable {...props} headerData={headerObj} redirectLink={redirectLink} />
        </>
    )
}

export default TableWrapper(AllOrdersTable)
