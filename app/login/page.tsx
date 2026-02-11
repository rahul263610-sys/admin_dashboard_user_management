"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import { loginUser } from "@/redux/slices/authSlice";
import { saveLoginHistory } from "@/redux/slices/loginHistory";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { googleLoginSuccess } from "@/redux/slices/authSlice";

interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
}

export default function AddUserPage() {
  const searchParams= useSearchParams();
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

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (!token && !error) return;

    if (error === "notallowed") {
      toast.error("Your are not allowed to login.");
      return;
    }

    if (token) {
      dispatch(googleLoginSuccess(token));

      const geo = localStorage.getItem("geoLocation");
      const deviceInfo = localStorage.getItem("deviceInfo");

      if (geo) {
        const parsedGeo = JSON.parse(geo);

         dispatch(
            saveLoginHistory({
              latitude: parsedGeo.latitude,
              longitude: parsedGeo.longitude,
              device: deviceInfo,
            })
          );

        localStorage.removeItem("geoLocation");
        localStorage.removeItem("deviceInfo");
      }

      toast.success("Logged in successfully ✅");
      router.replace("/dashboard");
    }
  }, [searchParams, dispatch, router]);


  const getGeoLocation = (): Promise<{
    latitude: number | null;
    longitude: number | null;
  }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({ latitude: null, longitude: null });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

const [device, setDevice] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDevice({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      });
    }
  }, []);


 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     const geo = await getGeoLocation();
    try {
      const res = await dispatch(loginUser({ 
        email, password,
        latitude : geo.latitude,
        longitude : geo.longitude,
        device: device ? JSON.stringify(device) : undefined,
 
      })).unwrap();
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
 const handleGoogleLogin = async () => {
    const geo = await getGeoLocation();

    localStorage.setItem("geoLocation", JSON.stringify(geo));
    if (device) {
      localStorage.setItem("deviceInfo", JSON.stringify(device));
    }

    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
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
          
         <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>

        </form>
      </div>

    </div>
  </div>
);

}
