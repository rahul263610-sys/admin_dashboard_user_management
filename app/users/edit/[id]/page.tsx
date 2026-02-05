"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { fetchUserById, updateUser } from "@/redux/slices/userSlice";
import type { AppDispatch } from "@/redux/store";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { Breadcrumb } from "react-bootstrap";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  // Separate state for each field
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  // Fetch user from backend by id
  useEffect(() => {
    if (!id) return;

    dispatch(fetchUserById(id as string))
      .unwrap()
      .then((user) => {
        setUserId(user._id)
        setName(user.name || "");
        setEmail(user.email || "");
        setContactNumber(user.contactNumber || "");
        setRole(user.role || "user");
        setStatus(user.status);
        setLoading(false);
      })
      .catch((err) => {
        setFormError(err);
        setLoading(false);
      });
  }, [id, dispatch]);

  // Validation
  const validateForm = () => {
    if (!name.trim() || !email.trim()) {
      setFormError("Name and email are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  // Submit updated user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res= await dispatch(
        updateUser({
          userId,
          name,
          email,
          role,
          password,
          status,
          contactNumber
        })
      ).unwrap();
      if(res.success){
        toast.success("User Updated successfully");
        router.replace("/users");
      }
    } catch (err: any) {
      setFormError(typeof err === "string" ? err : err?.message || "Failed to load user");
      toast.error(err || "Failed to update user");
      setLoading(false);
    }
  };

  return (
    <>
    {/* <Breadcrumb pageName="EditUser"/> */}
    <div className="add-form-container">
      <h1>Edit User</h1>
      {loading ? <Loader /> : (
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
          value={email}
          placeholder="Enter email"
          required
          onChange={(e) => setEmail(e.target.value)}
          />
         <FormInput
          label="Contact Number"
          value={contactNumber}
          placeholder="Enter Contact Number"
          required
          onChange={(e) => setContactNumber(e.target.value)}
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          placeholder="Enter new password"
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
        {formError && <p className="formError">{formError}</p>}

        <div className="add-form-buttons">
          <Button
            text="Cancel"
            variant="delete"
            type="button"
            onClick={() => router.replace("/users")}
            />
          <Button text="Update User" type="submit" />
        </div>
      </form>
      )}
    </div>
  </>
  );
}
