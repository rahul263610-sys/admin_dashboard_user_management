"use client";

import { useEffect,useState } from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchAllBlogs,deleteBlog } from "@/redux/slices/blogSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function BlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {loading, error, blogs, page: currentPage = 1, limit: limitRedux = 10, totalPages = 1,}= useSelector(
    (state : RootState) => state.blogs
  );
  const{search, filter}= useSelector((state: RootState) => state.search)
   useEffect(() => {
     dispatch(fetchAllBlogs({ page, limit, search, filter }));
   }, [dispatch, page, limit, search, filter]);

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
  return (
    <>
    <Breadcrumb pageName="Blogs"/>
    <div className="space-y-4">
      <div className="page-header">
        {/* <div className="header-left">
          <h1 className="page-title">Blogs</h1>
          </div> */}
        {/* <Link href="/blogs/add" className="add-btn">
          + Add Blog
        </Link> */}
      </div>
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
          actions={["edit", "delete", "view"]} 
          basePath="blogs" 
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
