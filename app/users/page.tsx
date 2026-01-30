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


 function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {loading, error, users,  page: currentPage = 1, limit: limitRedux = 10, totalPages = 1,}= useSelector(
    (state : RootState) => state.users
  );

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
    <div className="space-y-4">
        <div className="page-header">
          <div className="header-left">
            <h1 className="text-2xl font-bold">Users</h1>
              <div className="toolbar">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
          </div>
            <Link href="/users/add" className="add-btn">
            + Add User
            </Link>
        </div>
      {loading && <Loader />}
      {!loading && error && (
        <div className="text-red-500">
          {typeof error === "string" ? error : "Something went wrong"}
        </div>
      )}

      {!loading && !error && (
        <>
        <Table
          columns={["id", "name", "email", "role", "status", "Action"]}
          actions={["edit", "delete"]}
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
  );
}

export default UsersPage;
