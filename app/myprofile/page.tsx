"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { myProfile } from "@/redux/slices/authSlice";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { updateMyProfile } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

export default function MyProfile() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    dispatch(myProfile());
  }, [dispatch]);

  // When user loads, fill form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleUpdate = async () => {
  try {
    await dispatch(updateMyProfile(formData)).unwrap();
    toast.success("Profile updated successfully");
     dispatch(myProfile());
    setIsEditing(false);
  } catch (err: any) {
    toast.error(err);
  }
};
  if (loading) return <Loader />;

  return (
    <div className="profile-card">
      <h2 className="profile-title">My Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
      {!isEditing ? (
        <Button
          text="Edit Profile"
          type="button"
          onClick={() => setIsEditing(true)}
        />
      ) : (
        <Button
          text="Cancel"
          variant="delete"
          type="button"
          onClick={handleCancel}
        />
      )}
      <div className="profile-row">
        <span className="profile-label">Name:</span>
        {isEditing ? (
          <FormInput
              name="name"
              value={formData.name}
              placeholder="Enter full name"
              required
              onChange={handleChange}
              className="profile-input"
          />
        ) : (
          <span className="profile-value">{user?.name}</span>
        )}
      </div>

      <div className="profile-row">
        <span className="profile-label">Email:</span>
        {isEditing ? (
          <FormInput
              name="email"
              value={formData.email}
              placeholder="Enter email"
              required
              onChange={handleChange}
              className="profile-input"
          />
        ) : (
          <span className="profile-value">{user?.email}</span>
        )}
      </div>

      <div className="profile-row">
        <span className="profile-label">Role:</span>
        <span className="profile-value">{user?.role}</span>
      </div>

      <div className="profile-row">
        <span className="profile-label">Status:</span>
        <span
          className={`profile-status ${
            user?.status === "1" ? "active" : "inactive"
          }`}
        >
          {user?.status === "1" ? "Active" : "Inactive"}
        </span>
      </div>

      {isEditing && (
        <div style={{ marginTop: "20px" }}>
          <Button
            text="Update Profile"
            type="button"
            onClick={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}
