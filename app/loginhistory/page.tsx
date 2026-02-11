"use client";

import { useEffect, useState } from "react";
import Table from "../../components/Table";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchLoginHistory } from "../../redux/slices/loginHistory";

function LoginHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { loading, error, data, totalPages } = useSelector(
    (state: RootState) => state.loginHistory
  );
  const{search, filter}= useSelector((state: RootState) => state.search)

  useEffect(() => {
    dispatch(fetchLoginHistory({ page, limit,search }));
  }, [dispatch, page, limit, search]);

  // Format date & time
  const formattedData = data.map((item: any, index: number) => ({
    srno: index + 1,
    username: item.user?.name,
    device: item.device
      ? JSON.parse(item.device)?.platform
      : "Unknown",
    country: item.country || "-",
    region: item.region || "-",
    city: item.city || "-",
    loginDate: new Date(item.lastLogin).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
    loginTime: new Date(item.lastLogin).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
  }));

  return (
    <>
      <Breadcrumb pageName="Login History" />

      <div className="space-y-4">
        {loading && <Loader />}

        {!loading && error && (
          <div className="text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            <Table
              columns={[ "srno","username", "device","country","region","city","last Login Date", "last Login Time","Action"]}
              rows={["srno","username", "device", "country", "region", "city","loginDate","loginTime","Action"]}
              modal_title="Login Details"
              modal_header={[  "username","device","country", "region","city","loginDate","loginTime",]}
              data={formattedData}
              actions={["view"]}
              isCheckBox={false}
              basePath="/loginhistory"
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
            />
          </>
        )}
      </div>
    </>
  );
}

export default LoginHistoryPage;
