// Pestañas de ESTADO DEL PEDIDO (logística). `label` es una clave de
// traducción; `value` viaja al API como ?status=<slug> (filtra status_id).
export const filterPills = [
  {
    label: "Pending",
    value: "pending",
    countKey: "total_pending_orders",
    color: 'pending',
  },
  {
    value: "processing",
    label: "Processing",
    countKey: "total_processing_orders",
    color: 'processing',
  },
  {
    value: "shipped",
    label: "Shipped",
    countKey: "total_shipped_orders",
    color: 'shipped',
  },
  {
    value: "out_for_delivery",
    label: "Outfordelivery",
    countKey: "total_out_of_delivery_orders",
    color: 'out-delivery',
  },
  {
    value: "delivered",
    label: "Delivered",
    countKey: "total_delivered_orders",
    color: 'completed',
  },
  {
    value: "cancelled",
    label: "Cancelled",
    countKey: "total_cancelled_orders",
    color: 'cancel',
  },
];

// Pestañas de ESTADO DEL PAGO. Independientes de las anteriores: se
// combinan con ?status=… en la misma consulta. `params` son los filtros
// que viajan al API (campos del pago, nunca status_id).
export const paymentPills = [
  {
    value: "mercadopago_paid",
    label: "MercadoPagoPaid",
    countKey: "total_mercadopago_paid_orders",
    color: 'completed',
    // Un pago aprobado por la pasarela deja payment_status='completed'.
    params: { payment_method: "mercadopago", payment_status: "completed" },
  },
];
