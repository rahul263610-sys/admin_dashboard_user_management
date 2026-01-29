"use client";

import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { addUser } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


export default function AddUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("1");
  const [error, setError] = useState();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{ 
      const res= await dispatch(addUser({name, email, role, password, status}));
      console.log(res)
      if(res.payload.success){
        toast.success("User Added successfully ✅");
        router.replace("/users");
      }  
      else{
        toast.error(res.payload)
      }
  }catch (error: any) {
    toast.error(error || "Failed to add user");
    setError(error);
  }
}

  return (
    <div className="add-form-container">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Name"
          value={name}
          placeholder="Enter full name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          placeholder="Enter email address"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          placeholder="Enter password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className="add-form-buttons">
          <Button
            text="Cancel"
            variant="delete"
            onClick={() => router.push("/users")}
            className="cancel-btn"
          />
          <Button text="Add User" type="submit" className="submit-btn" />
        </div>
      </form>
    </div>
  );
}
