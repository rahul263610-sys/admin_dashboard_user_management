"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { fetchBlogById, updateBlog } from "@/redux/slices/blogSlice";
import type { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [blogId, setBlogId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");

  
  useEffect(() => {
    if (!id) return;

    dispatch(fetchBlogById(id as string))
      .unwrap()
      .then((blog) => {
        setBlogId(blog._id)
        setTitle(blog.title || "");
        setContent(blog.content || "");
        setCategory(blog.category);
        setLoading(false);
      })
      .catch((err) => {
        setFormError(err);
        setLoading(false);
      });
  }, [id, dispatch]);

 const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     try {
       const res = await dispatch(
         updateBlog({
           blogId,
           title,
           content,
           category,
         })
       ).unwrap();
       if(res.success){
               toast.success("Blog Updated successfully");
               router.replace("/blogs");
        }
     } catch (err: any) {
        setFormError(typeof err === "string" ? err : err?.message || "Failed to load blog");
        toast.error(err || "Failed to update blog");
        setLoading(false);
     }
   };

  return (
    <div className="add-form-container">
      <h1>Edit Blog</h1>
      {loading ? <Loader/> : (
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          value={title}
          placeholder="Enter Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormTextarea
          label="content"
          value={content}
          placeholder="Enter content"
          required
          onChange={(e) => setContent(e.target.value)}
        />
        <div>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="tech">Tech</option>
            <option value="lifestyle">Life Style</option>
            <option value="education">Education</option>
            <option value="business">Business</option>
            <option value="philosophy">Philosophy</option>
          </select>
        </div>
        {formError && <p className="formError">{formError}</p>}
        <div className="add-form-buttons">
          <Button
            text="Cancel"
            variant="delete"
            type="button"
            onClick={() => router.replace("/blogs")}
          />
          <Button text="Update Blog" type="submit" />
        </div>
      </form>
      )}
    </div>
  );
}
