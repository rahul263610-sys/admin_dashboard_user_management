"use client";

import { useEffect,useState } from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchAllBlogs,deleteBlog, bulkActionBlogs } from "@/redux/slices/blogSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function BlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const showBulkActions = selectedIds.length > 0;

  const {loading, error, blogs, page: currentPage = 1, limit: limitRedux = 10, totalPages = 1,}= useSelector(
    (state : RootState) => state.blogs
  );
  const {token , authLoaded} = useSelector((state : RootState)=> state.auth);
  const{search, filter, isDeleted}= useSelector((state: RootState) => state.search)

  if (!authLoaded) {
    return <Loader />;
  }

   useEffect(() => {
   if (!authLoaded || !token) return;
    console.log("checked for data ", authLoaded, " token",token);
     dispatch(fetchAllBlogs({ page, limit, search, filter, isDeleted }));
   }, [dispatch, page, limit, search, filter, isDeleted]);

    const handleDelete = async  (blogId: string, action: string) => {
      if (confirm(`Are you sure you want to ${action} this blog ?`)) {
      try{
        const res= await dispatch(deleteBlog({blogId, action}));
        if (deleteBlog.fulfilled.match(res)) {
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload || "Failed to delete blog");
        }
      }
      catch(err :any){
          toast.error(err)
      }
      }
    };
    
      const handleBulkDelete = async(action: any)=>{
        if (selectedIds.length===0) return;
        if(!confirm(`Are you sure you want to ${action} ${selectedIds.length} blogs`)){
          return;
        }
        try{
            const res = await dispatch(bulkActionBlogs({selectedIds,action}));
            if(bulkActionBlogs.fulfilled.match(res)){
              toast.success(`${selectedIds.length} Blogs ${action}d Successfully`);
              setSelectedIds([]);
            }
            else{
              toast.error("Failed to delete blogs");
            }
        }catch (error: any) {
          toast.error(error);
        }
      }
  return (
    <>
    <Breadcrumb
      pageName="Blogs"
      showActions={showBulkActions}
      onBulkDelete={handleBulkDelete}
    />
    <div className="space-y-4">
       {loading && <Loader />}
        {!loading && error && (
          <div className="error text-red-500">{error}</div>
        )}
       {!loading && !error && (
         <>
        <Table 
          columns={["srno", "title", "content","category", "created By", "Action"]} 
          rows={["srno", "title", "content","category", "created By", "Action"]} 
          modal_title="Blog"
          modal_header={["title", "content","category", "created By"]} 
          actions={["edit", "delete", "view", "restore"]} 
          basePath="blogs" 
          isCheckBox={true}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          data={blogs} 
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

export default BlogsPage
