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
    <div className="add-form-container">
      <h1>Login</h1>     
      <form onSubmit={handleSubmit}>
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
          placeholder="Enter Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="add-form-buttons">
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: loading ? "#94a3b8" : "#4f46e5",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
