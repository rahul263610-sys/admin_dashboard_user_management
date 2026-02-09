"use client";

import { useEffect,useState } from "react";
import { useDebounce } from 'use-debounce';
import Table from "../../components/Table";
import Link from "next/link";
import { fetchAllUsers, deleteUser, bulkActionUsers } from "@/redux/slices/userSlice";
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
  
  const {loading, error, users,  page: currentPage = 1, limit: limitRedux = 10, totalPages = 1,}= useSelector(
    (state : RootState) => state.users
  );
  const {token , authLoaded} = useSelector((state : RootState)=> state.auth);
  const {search, filter, isDeleted} = useSelector((state : RootState)=> state.search);
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const showBulkActions = selectedIds.length > 0;

  if (!authLoaded) {
    return <Loader />;
  }

  useEffect(() => {
    if(!token || !authLoaded){
      return 
    }
    console.log("checked for data ", authLoaded, " token",token);
    dispatch(fetchAllUsers({ page, limit, search: debouncedSearch, filter, isDeleted }));
  }, [dispatch, page, limit, search,debouncedSearch, filter, isDeleted]);
 

  const handleDelete = async(userId: string, action: string) => {
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      try{
        const res = await dispatch(deleteUser({ userId, action }));
        if (deleteUser.fulfilled.match(res)) {
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload || "Failed to delete user");
        }
      }catch (error: any) {
        toast.error(error);
      }
    }
  };

  const handleBulkDelete = async(action: any)=>{
    if (selectedIds.length===0) return;
    if(!confirm(`Are you sure you want to ${action} ${selectedIds.length} users ?`)){
      return;
    }
    try{
        const res = await dispatch(bulkActionUsers({selectedIds, action}));
        if(bulkActionUsers.fulfilled.match(res)){
          toast.success(`${selectedIds.length} Users ${action}d Successfully`);
          setSelectedIds([]);
        }
        else{
          toast.error("Failed to delete User");
        }
    }catch (error: any) {
      toast.error(error);
    }
  }
  return (
    <>
    <Breadcrumb
        pageName="Users"
        showActions={showBulkActions}
        onBulkDelete={handleBulkDelete}
    />
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
          columns={["srno", "name", "email","contact Number", "role", "status", "Action"]}
          rows={["srno", "name", "email","contactNumber", "role", "status", "Action"]}
          modal_title="User"
          modal_header={[ "name", "email","contactNumber", "bio", "role", "status"]}
          actions={["edit", "delete", "view", "restore"]}
          basePath="users"
          isCheckBox={true}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
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
