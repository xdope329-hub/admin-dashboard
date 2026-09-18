import { useEffect, useState } from "react";
import InputWrapper from "../../utils/hoc/InputWrapper";
import useOutsideDropdown from "../../utils/hooks/customHooks/useOutsideDropdown";
import MultiDropdownBox from "./MultiDropdownBox";
import MultiSelectInput from "./MultiSelectInput";

const MultiSelectField = ({ setFieldValue, values, name, getValuesKey = "id", data, errors, helpertext,initialTittle  }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { ref, isComponentVisible, setIsComponentVisible } = useOutsideDropdown();

  // Ids ya añadidos como etiqueta. El listado de categorías llega PLANO
  // (incluye las subcategorías) y además cada categoría trae `subcategories`
  // anidadas, así que sin esta guarda cada subcategoría elegida aparecía dos
  // veces y al quitar una etiqueta seguía viéndose la repetida.
  const seenIds = new Set();
  const SelectedItemFunction = (data) => {
    for (let i = 0; i < data?.length; i++) {
      const key = data[i][getValuesKey];
      if (!seenIds.has(key) && (key == values[name] || (Array.isArray(values[name]) && values[name].includes(key)) || (Array.isArray(values[name]) && key != null && values[name].some(value => value?.id != null && value?.id == key)))) {
        seenIds.add(key);
        setSelectedItems((p) => (p ? [...p, data[i]] : [data[i]]));
      }
      if (data[i].subcategories?.length > 0) {
        SelectedItemFunction(data[i].subcategories);
      } 
      // childs
      if (data[i].child?.length > 0) {
        SelectedItemFunction(data[i].child);
      }
    }
  };
  useEffect(() => {
    setSelectedItems();
    seenIds.clear();
    SelectedItemFunction(data && data);
    // `data` is in the deps so already-saved selections render once the
    // options finish loading (on edit pages the query resolves after mount).
  }, [values?.[name], data]);
  return (
    <div className="category-select-box" ref={ref}>
      <MultiSelectInput initialTittle={initialTittle} values={values} name={name} data={data} selectedItems={selectedItems} setIsComponentVisible={setIsComponentVisible} setFieldValue={setFieldValue} setSelectedItems={setSelectedItems} errors={errors} getValuesKey={getValuesKey} />
      {helpertext && <p className="help-text">{helpertext}</p>}
      <MultiDropdownBox  data={data} values={values} setIsComponentVisible={setIsComponentVisible} setFieldValue={setFieldValue} name={name} getValuesKey={getValuesKey} isComponentVisible={isComponentVisible} />
    </div>
  );
};


export default InputWrapper(MultiSelectField);
