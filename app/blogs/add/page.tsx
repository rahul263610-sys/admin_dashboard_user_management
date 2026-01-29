"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { addBlog } from "@/redux/slices/blogSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function AddBlogPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("tech");
  const [error, setError]= useState();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res= await  dispatch(addBlog({title, content, category}));
      if(res.payload.success){
        toast.success("Blog added successfully ")
        router.push("/blogs");
      }
    }catch(err : any){
      setError(err)
      toast.error(err || "Something wrong!")
    }
  };

  return (
    <div className="add-form-container">
      <h1>Add Blog</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          value={title}
          placeholder="Enter title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormTextarea
          label="Content"
          value={content}
          placeholder="Enter Content"
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
         <div className="add-form-buttons">
          <Button
            text="Cancel"
            variant="delete"
            onClick={() => router.push("/blogs")}
            className="cancel-btn"
          />
          <Button text="Add Blog" type="submit" className="submit-btn" />
        </div>
      </form>
    </div>
  );
}
