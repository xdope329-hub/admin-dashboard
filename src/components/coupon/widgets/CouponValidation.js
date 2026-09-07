import * as Yup from "yup";
import { ifIsApplyAll, ifIsExpirable, ifTypeIsfree_shipping, nameSchema } from "../../../utils/validation/ValidationSchemas";

export const CouponValidation = {
    title: nameSchema,
    description: nameSchema,
    code: nameSchema,
    type: nameSchema,
    min_spend: nameSchema,
    start_date: ifIsExpirable,
    end_date: ifIsExpirable,
    // Porcentaje: entre 1 y 100; monto fijo: positivo; envío gratis: sin monto.
    amount: Yup.number().when("type", {
        is: "percentage",
        then: Yup.number().positive().max(100, "El porcentaje no puede superar 100").required(),
        otherwise: ifTypeIsfree_shipping,
    }),
    products: ifIsApplyAll,
}
