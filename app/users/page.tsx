"use client";

import { useEffect,useState } from "react";
import { useDebounce } from 'use-debounce';
import Table from "../../components/Table";
import Link from "next/link";
import { fetchAllUsers, deleteUser } from "@/redux/slices/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


 function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const [search, setSearch] = useState("");
  // const [filter, setFilter] = useState("");
  
  const {loading, error, users,  page: currentPage = 1, limit: limitRedux = 10, totalPages = 1,}= useSelector(
    (state : RootState) => state.users
  );
  const {search, filter} = useSelector((state : RootState)=> state.search);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchAllUsers({ page, limit, search: debouncedSearch, filter }));
  }, [dispatch, page, limit, search,debouncedSearch, filter]);
 

  const handleDelete = async(id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
    try{
      const res = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(res)) {
        toast.success("User deleted successfully");
      } else {
        toast.error(res.payload || "Failed to delete user");
      }
    }catch (error: any) {
      toast.error(error);
    }
  }
  };
  return (
    <>
    <Breadcrumb pageName="Users" /> 
    <div className="space-y-4">
      {loading && <Loader />}
      {!loading && error && (
        <div className="error-box">
          {typeof error === "string" ? error : "Something went wrong"}
        </div>
      )}

      {!loading && !error && (
        <>
        <Table
          columns={["srno", "name", "email","contactNumber", "role", "status", "Action"]}
          modal_title="User"
          modal_header={[ "name", "email","contactNumber", "bio", "role", "status"]}
          actions={["edit", "delete", "view"]}
          basePath="users"
          data={users}
          onDelete={handleDelete}
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

export default UsersPage;
