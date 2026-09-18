import React, { useContext } from 'react'
import { Table } from 'reactstrap'
import Avatar from '@/components/commonComponent/Avatar';
import SettingContext from '@/helper/settingContext';
import { useTranslation } from "react-i18next";
import { placeHolderImage } from '@/data/CommonPath';

const NumberTable = ({ data }) => {

    const { t } = useTranslation( 'common');
    const { convertCurrency } = useContext(SettingContext)
    return (
        <div className="tracking-wrapper table-responsive">
            <Table className="product-table">
                <thead>
                    <tr>
                        <th scope="col">{t("Image")}</th>
                        <th scope="col">{t("Name")}</th>
                        <th scope="col">{t("Price")}</th>
                        <th scope="col">{t("Quantity")}</th>
                        <th scope="col">{t("Subtotal")}</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.products?.map((elem, index) => (
                        <tr key={index}>
                            <td className="product-image">
                                <Avatar customClass={'img-fluid'} data={elem?.product_thumbnail} placeHolder={placeHolderImage} name={elem?.name} />
                            </td>
                            <td>
                                <h6>{elem?.pivot?.variation ? elem?.pivot?.variation?.name : elem?.name}</h6>
                                {/* Variante comprada: cada atributo (Color, Talla…) y el SKU,
                                    tal como quedaron guardados en el pedido. */}
                                {elem?.variation_attributes?.length > 0 && (
                                    <div className="order-line-attributes text-muted small">
                                        {elem.variation_attributes.map((attr, i) => (
                                            <span key={i} className="me-2"><strong>{attr?.name}:</strong> {attr?.value}</span>
                                        ))}
                                    </div>
                                )}
                                {elem?.sku && (
                                    <div className="order-line-sku text-muted small"><strong>{t("Sku")}:</strong> {elem.sku}</div>
                                )}
                                {/* Bundle: composición congelada al comprar (producto hijo + variante). */}
                                {Array.isArray(elem?.bundle_selections) && elem.bundle_selections.length > 0 && (
                                    <ul className="bundle-selections small text-muted mb-0 mt-1 ps-3">
                                        {elem.bundle_selections.map((sel, i) => {
                                            const attrs = (sel?.variation_attributes || []).map((a) => `${a.name}: ${a.value}`).join(", ");
                                            const details = sel?.variation_name || attrs || null;
                                            return (
                                                <li key={i}>
                                                    <strong>{sel?.product_name || "—"}</strong>
                                                    {details ? ` — ${details}` : ""}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </td>
                            <td>
                                <h6>{convertCurrency(elem?.pivot?.single_price)}</h6>
                            </td>
                            <td>
                                <h6>{elem?.pivot.quantity}</h6>
                            </td>
                            <td>
                                <h6>{convertCurrency(elem?.pivot.subtotal)}</h6>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default NumberTable
