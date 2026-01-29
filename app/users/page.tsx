"use client";

import { useEffect } from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { fetchAllUsers, deleteUser } from "@/redux/slices/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";


 function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error, users}= useSelector(
    (state : RootState) => state.users
  );
  const getAllUsers = ()=>{
    dispatch(fetchAllUsers());
  }
  useEffect(()=>{
    getAllUsers();
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
    try{
      dispatch(deleteUser(id));
      toast.success("User Deleted successfully ✅");
     }catch (error: any) {
        toast.error(error);
      }
  }
  };
  return (
    <div className="space-y-4">
        <div className="page-header">
            <h1 className="text-2xl font-bold">Users</h1>
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
        <Table
          columns={["id", "name", "email", "role", "Action"]}
          actions={["edit", "delete"]}
          basePath="users"
          data={users}
          onDelete={handleDelete}
        />
      )}
      </div>
  );
}

export default UsersPage;
