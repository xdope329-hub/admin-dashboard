import { useReducer } from "react";
import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import { settingReducer } from "../../utils/allReducers";
import request from "../../utils/axiosUtils";
import { BadgeApi } from "../../utils/axiosUtils/API";
import BadgeContext from ".";
import { useRouter } from "next/navigation";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const BadgeProvider = (props) => {
    const [cookies] = useCookies(["uat"]);
    const [state, dispatch] = useReducer(settingReducer, { badges: [], notification: "" })
    const [notification, setNotification] = useState("")
    const router = useRouter();
    // GET /badge responde { data: { product, review, ... } }: hay que
    // desenvolver ese `data` (antes se leía un nivel arriba y todos los
    // contadores quedaban undefined, así que ninguna insignia se mostraba).
    const { data, isLoading, refetch } = useCustomQuery([BadgeApi], () => request({ url: BadgeApi },router), {
        enabled: false, select: (res) => res?.data?.data ?? res?.data
    });
    useEffect(() => {
        cookies.uat && refetch()
    }, [cookies.uat])

    useEffect(() => {
        if (data) {
            dispatch({
                type: "ALLBADGE",
                allBadges: [
                    { path: "/product", value: data?.product?.total_in_approved_products, subKey: ["product", "total_in_approved_products"] },
                    { path: "/store", value: data?.store?.total_in_approved_stores, subKey: ["store", "total_in_approved_stores"] },
                    { path: "/refund", value: data?.refund?.total_pending_refunds, subKey: ["refund", "total_pending_refunds"] },
                    { path: "/withdraw_request", value: data?.withdraw_request?.total_pending_withdraw_requests, subKey: ["withdraw_request", "total_pending_withdraw_requests"] },
                    // Reseñas esperando moderación.
                    { path: "/review", value: data?.review?.total_pending_reviews, subKey: ["review", "total_pending_reviews"] },
                ],
            })
        }
    }, [isLoading])
    return (
        <BadgeContext.Provider value={{ state, dispatch, notification, setNotification, ...props }}>
            {props.children}
        </BadgeContext.Provider>
    )
}
export default BadgeProvider