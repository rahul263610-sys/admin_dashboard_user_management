"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { updateMyProfile, changePassword, myProfile, updateMyProfileImage, deleteMyProfileImage } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import Button from "@/components/Button";


const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    bio: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(myProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
         contactNumber: user.contactNumber || "", 
      bio: user.bio || "",   
      });
    }
  }, [user]);

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };


  const handleUpdate = async () => {
    try {
      await dispatch(updateMyProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      dispatch(myProfile());
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
    } catch (err: any) {
      toast.error(err);
      setPasswordData({oldPassword: "", newPassword:"", confirmPassword:""});
    }
  };

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSaveProfileImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res= await dispatch(updateMyProfileImage(formData)).unwrap();

      if (res.success) {
        toast.success(res.message || "Profile photo updated successfully");
        setSelectedFile(null);
        setPreviewImage(null);
      }
      } catch (err: any) {
        toast.error(err);
      }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleDeleteProfileImage = async()=>{
    if (confirm("Are you sure you want to delete profile image ?")) {
      try {
      const res = await dispatch(deleteMyProfileImage()).unwrap();

      if (res.success) {
        toast.success(res.message || "Profile photo deleted");

        // Remove preview instantly
        dispatch(myProfile());
        setPreviewImage(null);
        setSelectedFile(null);
      }
      } catch (err: any) {
        toast.error(err);
      }
    }
  }

  if (loading || !user) return <Loader />;

  return (
    <>
    <Breadcrumb pageName="Settings" />      
    <div className="settings-container">
        <div className="settings-grid">
        <div className="settings-main">
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>Personal Information</h3>
            </div>
            <div className="settings-card-body">
              <form onSubmit={handleUpdate}>
                <div className="row">
                  <div className="form-group half">
                    <label>Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter Your Name"/>
                  </div>

                  <div className="form-group half">
                    <label>Contact Number</label>
                    <input name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} placeholder="Enter Contact Number"/>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email ID"
                    />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    rows={5}
                    value={formData.bio || ""}
                    placeholder="Enter Bio"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <Button text="Save Changes" type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="settings-side">
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>Your Photo</h3>
            </div>
            <div className="settings-card-body">
              <div className="photo-row">
                 <Image
                    src={
                      previewImage
                        ? previewImage
                        : user?.avatar
                        ? user.avatar
                        : "/images/user/user_avatar.jpg"
                    }
                    width={60}
                    height={60}
                    alt="User"
                    className="avatar"
                  />
                <div>
                  <p>Edit your photo</p>
                  <div className="photo-actions">
                    {previewImage ? <button className="delete-btn" type="button" onClick={handleRemoveImage}>Remove</button> : <button className="delete-btn" type="button" onClick={handleDeleteProfileImage}>Delete</button>}            
                      <button type="button" onClick={handleSaveProfileImage}>Update</button>
                  </div>
                </div>
              </div>

              <div className="upload-box">
                <input type="file" accept="image/*"  onChange={handleImageChange}/>
                <p>
                  <span>Click to upload</span> or drag and drop
                </p>
                <small>SVG, PNG, JPG or GIF (max 800×800px)</small>
              </div>

              <div className="form-actions">
                <Button text="Save Photo" type="button" onClick={handleSaveProfileImage} />
              </div>
            </div>
          </div>

          <div className="settings-card" style={{ marginTop: "30px" }}>
            <div className="settings-card-header">
              <h3>Change Password</h3>
            </div>
            <div className="settings-card-body">
              <form onSubmit={handleSubmitChangePassword}>
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter Your Old Password"
                    />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter Your New Password"
                    />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter Confirm Password"
                    />
                </div>

                <div className="form-actions">
                  <Button text="Update Password" type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Settings;
