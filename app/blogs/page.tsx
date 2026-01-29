"use client";

import { useEffect } from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchAllBlogs,deleteBlog } from "@/redux/slices/blogSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";

function BlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error, blogs}= useSelector(
    (state : RootState) => state.blogs
  );

    const getAllBlogs = ()=>{
      dispatch(fetchAllBlogs());
    }
    useEffect(()=>{
      getAllBlogs();
    }, [])
  
    const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this blog ?")) {
      try{
        dispatch(deleteBlog(id));
        toast.success("Blog Deleted successfully");
      }
      catch(err :any){
          toast.error(err)
      }
      }
    };
  return (
    <div className="space-y-4">
        <div className="page-header">
            <h1 className="text-2xl font-bold">Blogs</h1>
            <Link href="/blogs/add" className="add-btn">
            + Add Blog
            </Link>
        </div>
        {loading && <Loader />}
        {!loading && error && (
          <div className="error text-red-500">{error}</div>
        )}
       {!loading && !error && (
        <Table columns={["id", "title", "content","category", "Action"]} actions={["edit", "delete"]} basePath="blogs" data={blogs} onDelete={handleDelete} />
       )}
    </div>
  );
}

export default BlogsPage
