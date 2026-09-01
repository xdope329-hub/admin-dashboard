import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "reactstrap";
import Loader from "../../components/commonComponent/Loader";
import TableBottom from "../../components/table/TableBottom";
import TableTitle from "../../components/table/TableTitle";
import TableTop from "../../components/table/TableTop";
import request from "../axiosUtils";
import useCustomQuery from "../hooks/useCustomQuery";
import useDelete from "../hooks/useDelete";

const TableWrapper = (WrappedComponent) => {
  const HocComponent = forwardRef(({ url, loading, moduleName, setFieldValue, userIdParams, type, paramsProps, onlyTitle, isCheck, setIsCheck, isReplicate, dateRange, filterHeader, importExport, keyInPermission, ...props }, ref) => {
    const router = useRouter();
    const [paginate, setPaginate] = useState(15);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [sortBy, setSortBy] = useState({ field: "", sort: "asc" });
    // Antes solo se observaba la PRIMERA clave de paramsProps, así que una
    // pestaña que cambiaba otro filtro (p. ej. payment_method) no refrescaba
    // la tabla. Comparar por valor cubre todas las claves y es estable entre
    // renders (string, no identidad de objeto).
    const paramsKey = JSON.stringify(paramsProps ?? {});
    // Row-level delete for every table: DELETE {url}/{id}, then refetch the
    // list. Passed down as `mutate` (ShowTable → Options → DeleteButton).
    const { mutate: deleteRow } = useDelete(url, url, () => refetch());

    const { data, isLoading, refetch, fetchStatus } = useCustomQuery(
      [url],
      () =>
        request(
          {
            url,
            method: "get",
            params: { paginate, page, search, sort: sortBy?.sort, field: sortBy?.field, type: type, start_date: date[0]?.startDate ?? null, end_date: date[0]?.endDate ?? null, ...paramsProps },
          },
          router
        ),
      { refetchOnWindowFocus: false, gcTime: 0 }
    );

    // Row delete for every table using this wrapper: DELETE {url}/{id}, then
    // refresh the list. Without this, the delete confirmation's "Yes" button
    // had no mutation to call and silently did nothing.
    const { mutate: deleteRowMutate } = useDelete(url, false, () => refetch());

    // To use this function in parent
    useImperativeHandle(ref, () => ({
      call() {
        refetch();
      },
    }));

    useEffect(() => {
      (!loading || url) && refetch();
    }, [paginate, page, date, search, loading, sortBy, type, paramsKey]);

    useEffect(() => {
      if (!data?.data?.length || !data?.data?.data?.length) {
        setIsCheck && setIsCheck([]);
      }
      if (setFieldValue) {
        setFieldValue ? setFieldValue("showBalance", data?.data?.balance) : "";
      }
    }, [data]);
    if (isLoading) return <Loader />;
    return (
      <>
        <Card>
          <CardBody className="custom-role">
            <TableTitle moduleName={moduleName} type={type} onlyTitle={onlyTitle} filterHeader={filterHeader} importExport={importExport} refetch={refetch} />
            {(filterHeader?.noPageDrop !== true || filterHeader?.noSearch !== true) && <TableTop setPaginate={setPaginate} setSearch={setSearch} paginate={paginate} isCheck={isCheck} setIsCheck={setIsCheck} url={url} isReplicate={isReplicate} refetch={refetch} dateRange={dateRange} date={date} setDate={setDate} filterHeader={filterHeader} keyInPermission={keyInPermission} differentFilter={props.differentFilter} advanceFilter={props.advanceFilter} showFilterDifferentPlace={props.showFilterDifferentPlace} />}
            <div className="table-responsive border-table">
              <WrappedComponent mutate={deleteRow} data={userIdParams ? data?.data : data?.data?.data} sortBy={sortBy} setSortBy={setSortBy} moduleName={moduleName} type={type} current_page={userIdParams ? data?.data?.transactions?.current_page : data?.data?.current_page} per_page={userIdParams ? data?.data?.transactions?.per_page : data?.data?.per_page} url={url} userIdParams={userIdParams} fetchStatus={fetchStatus} refetch={refetch} isCheck={isCheck} setIsCheck={setIsCheck} {...props} keyInPermission={keyInPermission} />
            </div>
          </CardBody>
          {filterHeader?.noPagination !== true && <TableBottom current_page={userIdParams ? data?.data?.transactions?.current_page : data?.data?.current_page} total={userIdParams ? data?.data?.transactions?.total : data?.data?.total} per_page={userIdParams ? data?.data?.transactions?.per_page : data?.data?.per_page} setPage={setPage} />}
        </Card>
      </>
    );
  });
  return HocComponent;
};

export default TableWrapper;
