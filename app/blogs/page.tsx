"use client";

import { useEffect,useState } from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchAllBlogs,deleteBlog, bulkDeleteBlogs } from "@/redux/slices/blogSlice";
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

     dispatch(fetchAllBlogs({ page, limit, search, filter, isDeleted }));
   }, [dispatch, page, limit, search, filter, isDeleted]);

    const handleDelete = async  (id: string) => {
      if (confirm("Are you sure you want to delete this blog ?")) {
      try{
        const res= await dispatch(deleteBlog(id));
        if (deleteBlog.fulfilled.match(res)) {
          toast.success("Blog deleted successfully");
        } else {
          toast.error(res.payload || "Failed to delete blog");
        }
      }
      catch(err :any){
          toast.error(err)
      }
      }
    };
    
      const handleBulkDelete = async()=>{
        if (selectedIds.length===0) return;
        if(!confirm(`Are you sure you want to delete ${selectedIds.length} blogs`)){
          return;
        }
        try{
            const res = await dispatch(bulkDeleteBlogs(selectedIds));
            if(bulkDeleteBlogs.fulfilled.match(res)){
              toast.success(`${selectedIds.length} Blogs Deleted Successfully`);
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
      pageName="Users"
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
