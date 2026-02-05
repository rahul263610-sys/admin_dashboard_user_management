"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import { loginUser } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AddUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      if (res.success) {
        toast.success("Logged in successfully ✅");
        router.replace("/dashboard");
      }
    } catch (err: any) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Login failed"
      );
    }
  };


  return (
  <div className="login-page">
    <div className="login-container">

      {/* Left Panel */}
      <div className="login-left">
        <img
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          className="login-logo"
        />
        <p className="login-subtitle">
          Welcome back! Login to manage your dashboard and users.
        </p>
        <img
          src="/images/logo/login_template_front.png"
          alt="Illustration"
          className="login-illustration"
        />
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <h2 className="login-title">Sign in to your account</h2>
        <p className="login-desc">Enter your credentials below</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>

    </div>
  </div>
);

}
