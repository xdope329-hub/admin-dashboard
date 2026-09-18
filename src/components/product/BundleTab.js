import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button, Table } from "reactstrap";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import request from "../../utils/axiosUtils";
import { product as productAPI } from "../../utils/axiosUtils/API";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

// Tab "Bundle": el admin arma un grupo de productos. Cada línea referencia un
// producto existente y, si tiene variantes, un subset opcional de variantes
// permitidas (vacío = el cliente puede elegir cualquiera).
const BundleTab = ({ values, setFieldValue, updateId }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Ids ya seleccionados (para bootstrap del picker). Se permiten duplicados:
  // el mismo producto puede aparecer varias veces en el bundle con distintas
  // variantes permitidas.
  const items = useMemo(() => (Array.isArray(values?.bundle_items) ? values.bundle_items : []), [values?.bundle_items]);
  const selectedIds = useMemo(() => items.map((it) => String(it.product_id)).filter(Boolean), [items]);
  const bootstrapIds = useMemo(() => Array.from(new Set(selectedIds)).join(",") || null, [selectedIds]);

  // Trae productos activos por búsqueda O por ids ya guardados (para poder
  // mostrar los seleccionados aunque el término de búsqueda no los incluya).
  const { data: options = [], refetch } = useCustomQuery(
    [productAPI, "bundle", search, bootstrapIds || ""],
    () => request({ url: productAPI, params: { status: 1, search, paginate: 30, ids: search ? null : bootstrapIds, with_union_products: 1 } }, router),
    { refetchOnWindowFocus: false, select: (res) => res?.data?.data || [] }
  );
  useEffect(() => { refetch(); }, [search, bootstrapIds]);

  const productsById = useMemo(() => {
    const map = new Map();
    (options || []).forEach((p) => map.set(String(p.id), p));
    return map;
  }, [options]);

  const addItem = (productId) => {
    if (!productId) return;
    if (updateId && String(productId) === String(updateId)) return;
    setFieldValue("bundle_items", [...items, { product_id: productId, allowed_variation_ids: [] }]);
  };
  const removeItem = (idx) => {
    const next = [...items];
    next.splice(idx, 1);
    setFieldValue("bundle_items", next);
  };
  const toggleAllowedVariation = (idx, variationId) => {
    const next = [...items];
    const allowed = Array.isArray(next[idx].allowed_variation_ids) ? [...next[idx].allowed_variation_ids] : [];
    const key = String(variationId);
    const at = allowed.map(String).indexOf(key);
    if (at >= 0) allowed.splice(at, 1); else allowed.push(key);
    next[idx] = { ...next[idx], allowed_variation_ids: allowed };
    setFieldValue("bundle_items", next);
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">{t("Buscar producto")}</label>
        <input
          type="text"
          className="form-control"
          placeholder={t("Buscar por nombre para agregar al bundle")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-2" style={{ maxHeight: 200, overflow: "auto", border: "1px solid #eee" }}>
          {(options || [])
            .filter((p) => (updateId ? String(p.id) !== String(updateId) : true))
            .filter((p) => p.type !== "bundle")
            .map((p) => (
              <div key={p.id} className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom">
                <span>{p.name}</span>
                <Button size="sm" color="primary" onClick={() => addItem(p.id)}>
                  <RiAddLine /> {t("Agregar")}
                </Button>
              </div>
            ))}
        </div>
      </div>

      <Table bordered responsive size="sm">
        <thead>
          <tr>
            <th>{t("Producto")}</th>
            <th>{t("Variantes permitidas")}</th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={3} className="text-center text-muted">{t("Aún no hay productos en el bundle")}</td></tr>
          )}
          {items.map((it, idx) => {
            const child = productsById.get(String(it.product_id));
            const variations = child?.variations || [];
            const allowed = (it.allowed_variation_ids || []).map(String);
            return (
              <tr key={idx}>
                <td>{child?.name || <em className="text-muted">{String(it.product_id).slice(-6)}</em>}</td>
                <td>
                  {variations.length === 0 ? (
                    <span className="text-muted">{t("Producto simple (sin variantes)")}</span>
                  ) : (
                    <>
                      <p className="mb-1 small text-muted">{t("Sin marcar ninguna = el cliente puede elegir cualquiera")}</p>
                      <div className="d-flex flex-wrap gap-2">
                        {variations.map((v) => {
                          const vid = String(v.id || v._id);
                          const checked = allowed.includes(vid);
                          const label = v.name || (v.attribute_values || []).map((av) => av.value).join(" / ") || vid;
                          return (
                            <label key={vid} className={`badge ${checked ? "bg-primary" : "bg-light text-dark border"}`} style={{ cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                className="me-1"
                                checked={checked}
                                onChange={() => toggleAllowedVariation(idx, vid)}
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </td>
                <td>
                  <Button size="sm" color="danger" outline onClick={() => removeItem(idx)}>
                    <RiDeleteBinLine />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <p className="small text-muted">{t("El precio del bundle es el precio fijo que se cobra al cliente por comprar el grupo completo.")}</p>
    </div>
  );
};

export default BundleTab;
