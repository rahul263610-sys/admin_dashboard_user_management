"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserRole } from "./getUserRole";

const ADMIN_ROUTES = ["/dashboard", "/users"];
const PUBLIC_ROUTES = ["/login", "/unauthorized"];

export default function GlobalAuthorized() {
  const pathname = usePathname();
  const router = useRouter();
  const role = getUserRole();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;
     
    if(role === null){
        router.replace("/login");
    }
    try {

      const isAdminRoute = ADMIN_ROUTES.some(route =>
        pathname.startsWith(route)
      );

      if (isAdminRoute && role !== "admin") {
        router.replace("/unauthorized");
      }
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [pathname, router]);

  return null;
}
