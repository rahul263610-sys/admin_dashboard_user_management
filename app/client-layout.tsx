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

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
  
  // ✅ Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Navbar isSidebarExpanded={isSidebarExpanded} />

      <Header
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded((p) => !p)}
      />

      <main
        style={{
          marginTop: "72px",
          marginLeft: sidebarWidth,
          padding: "20px",
        }}
      >
        {children}
      </main>
    </>
  );
}
