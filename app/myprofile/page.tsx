"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { myProfile } from "@/redux/slices/authSlice";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { updateMyProfile, changePassword } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

export default function MyProfile() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmitChangePassword = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
    try {
      await dispatch(
        changePassword({
          oldpassword: passwordData.oldPassword,
          newpassword: passwordData.newPassword,
        })
      ).unwrap();

      toast.success("Password updated successfully");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(myProfile());
      setIsChangingPassword(false);
    } catch (err: any) {
      toast.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="profile-card">
      
      <h2 className="profile-title">My Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
       {!isChangingPassword && (
        <div className="flex gap-2 mb-4">
          {!isEditing ? (
            <Button text="Edit Profile" type="button" onClick={() => setIsEditing(true)} />
          ) : (
            <Button text="Cancel" variant="delete" type="button" onClick={handleCancel} />
          )}
          <Button
            text="Change Password"
            type="button"
            onClick={() => {
              setIsChangingPassword(true);
              setIsEditing(false);
            }}
          />
        </div>
      )}
    {!isChangingPassword && (
    <>
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
    </>
    )}

    {isChangingPassword && (
        <div className="mt-4">
          <div className="profile-row">
            <span className="profile-label">Old Password:</span>
            <FormInput
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter old password"
              required
              className="profile-input"
            />
          </div>
          <div className="profile-row">
            <span className="profile-label">New Password:</span>
            <FormInput
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
              className="profile-input"
            />
          </div>
          <div className="profile-row">
            <span className="profile-label">Confirm Password:</span>
            <FormInput
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
              className="profile-input"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              text="Cancel"
              variant="delete"
              type="button"
              onClick={() => setIsChangingPassword(false)}
            />
            <Button
              text="Update Password"
              type="button"
              onClick={handleSubmitChangePassword}
            />
          </div>
        </div>
      )}
    </div>
  );
}
