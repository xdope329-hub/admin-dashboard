import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchableSelectInput from '../../inputFields/SearchableSelectInput';
import ShippingNote from './ShippingNote';

/**
 * Selector de estado del pedido. Solo ofrece los estados que el backend
 * permite desde el estado actual (`allowed_next_statuses` de GET /order/:id):
 * el siguiente paso de la secuencia processing → shipped → out_for_delivery
 * → delivered, y cancelar mientras el pedido no haya salido. El API rechaza
 * igualmente cualquier salto (422), y ese mensaje se muestra como toast.
 */
const UpdateStatus = ({ orderStatusData, values, setFieldValue, data, setOrderStatus, orderStatus, mutate, orderStatusUpdate, refetch }) => {
    const { t } = useTranslation('common');
    const [openReceiptModal, setOpenReceiptModal] = useState(false);

    const onStatusChange = (name, value) => {
        const modifiedObject = { ...value, name: ReplaceString(value?.name) }
        setOpenReceiptModal(true)
        setFieldValue('order_status_id', modifiedObject)
    }
    const capitalizeAndReplace = (str) => {
        return String(str || '').charAt(0).toUpperCase() + String(str || '').slice(1).replace(/_/g, ' ');
    };
    const ReplaceString = (str) => {
        return String(str || '').charAt(0).toLowerCase() + String(str || '').slice(1).replace(/ /g, '_');
    };

    useEffect(() => {
        if (orderStatusUpdate?.status == 200 || orderStatusUpdate?.status == 201) {
            setOrderStatus(values['order_status_id'])
        }
    }, [orderStatusUpdate])

    // Fuente de verdad: lo que el backend permite. Si (por una versión vieja
    // del API) no viene la lista, se cae al catálogo completo como antes.
    const allowed = Array.isArray(data?.allowed_next_statuses) ? data.allowed_next_statuses : null;
    const options = (allowed ?? orderStatusData ?? []).map((obj) => ({ ...obj, name: capitalizeAndReplace(obj?.name) }));

    if (allowed && allowed.length === 0) {
        return <span className="text-muted small">{t("NoFurtherStatus")}</span>;
    }

    return (
        <>
            <SearchableSelectInput
                nameList={[
                    {
                        name: "order_status_id",
                        notitle: "true",
                        inputprops: {
                            name: "order_status_id",
                            id: "order_status_id",
                            options,
                            value: capitalizeAndReplace(orderStatus ? orderStatus?.name : ''),
                        },
                        store: "obj",
                        setvalue: onStatusChange,
                    },
                ]}
            />
            {openReceiptModal && <ShippingNote refetch={refetch} setFieldValue={setFieldValue} mutate={mutate} values={values} openReceiptModal={openReceiptModal} setOpenReceiptModal={setOpenReceiptModal} />}
        </>
    )
}

export default UpdateStatus
