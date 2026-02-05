"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, authLoaded } = useSelector(
    (state: RootState) => state.auth
  );
  const {mode}= useSelector((state : RootState) => state.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Detect mobile screen on mount
  useEffect(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth <= 962;
    setIsMobile(mobile);
    setIsSidebarExpanded(!mobile); 
  }, []);

  useEffect(()=>{
    document.documentElement.classList.toggle("dark", mode==="dark");
  }, [mode])

  // Optional: update on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 962;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarExpanded(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Load auth once
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // ✅ Redirect logic (SIDE EFFECT ONLY)
  useEffect(() => {
    if (!authLoaded) return;

    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [authLoaded, isAuthenticated, pathname, router]);

  // ⛔ Block rendering until auth is checked
  if (!authLoaded) return null;

  // ✅ Login page has no layout
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // ⛔ Prevent protected UI render if not logged in
  if (!isAuthenticated) return null;

  const sidebarWidth = !isMobile ? (isSidebarExpanded ? 230 : 78) : 0;

  return (
    <>
      <Header
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded((p) => !p)}
        isMobile={isMobile}
      />
      <Navbar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} isMobile={isMobile} />
      <main
           className="app-main"
        style={{
          marginTop: "55px",
          marginLeft: sidebarWidth,
          padding: "20px",
        }}
      >
        {children}
      </main>
    </>
  );
}
