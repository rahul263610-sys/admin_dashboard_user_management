"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { myProfile } from "@/redux/slices/authSlice";
import Loader from "@/components/Loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function MyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(myProfile());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
  <>
  <Breadcrumb pageName="My Profile" />
  <div className="profile-wrapper">

    <div className="profile-card">
      <div className="profile-cover">
        <img src="/images/user_cover_img/cover-01.png" alt="cover" />
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user?.avatar || "/images/user/user_avatar.jpg"} alt="avatar" />
        </div>
        <div className="profile-name">{user?.name}</div>
      </div>
      <div className="profile-about">
        <h4>About Me</h4>
        <p>
          {user?.bio
            ? user.bio
            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies. Sed vel aliquet libero. Nunc a augue fermentum, pharetra ligula sed, aliquam lacus."}
        </p>
      </div>


      <div className="profile-info">
        <div className="info-card">
          <h4>Personal Information</h4>

          <div className="info-row">
            <span className="info-label">Full Name</span>
            <span className="info-value">{user?.name}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Contact Number</span>
            <span className="info-value">{user?.contactNumber}</span>
          </div>
        </div>

        <div className="info-card">
          <h4>Account Details</h4>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className="info-value">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span
              className={`status-badge ${
                user?.status === "1" ? "status-active" : "status-inactive"
              }`}
              >
              {user?.status === "1" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>

  );

}
