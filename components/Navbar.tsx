"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarData } from "./SidebarData";
import "../styles/navbar.css";
import Image from "next/image";
import logo from "@/public/images/logo/logo-icon.svg";
import logo2 from "@/public/images/logo/logo-icon.svg";
import { FiLogOut,  } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import {AiOutlineClose  } from "react-icons/ai";

interface NavbarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (value: boolean) => void;
    isMobile: boolean; 
}

export default function Navbar({ isSidebarExpanded, setIsSidebarExpanded, isMobile  }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());    
    toast.success("Logout successfully")
    router.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth <= 962 &&
        isSidebarExpanded
      ) {
        setIsSidebarExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarExpanded, setIsSidebarExpanded]);

   const handleLinkClick = () => {
    if (window.innerWidth <= 962) {
      setIsSidebarExpanded(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`nav-menu ${isSidebarExpanded ? "expanded" : "collapsed"}`}
    >
      <div className="sidebar-header">
        <Image
          src={isSidebarExpanded ? logo : logo2}
          alt="Logo"
          className="logo"
          priority
        />

        {isMobile && isSidebarExpanded && (
        <button
          className="mobile-close-button-sidebar"
          onClick={() => setIsSidebarExpanded(false)}
          aria-label="Close sidebar"
        >
          <AiOutlineClose size={20} />
        </button>
        )}
      </div>

      <div className="sidebar-scroll">
        <p className="sidebar-section-title">MENU</p>

        <ul className="nav-menu-items">
          {SidebarData.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={index}
                className={`nav-text ${isActive ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                <Link href={item.path}>
                  <span className="icon">{item.icon}</span>
                  {isSidebarExpanded && <span className="label">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="lgoutbtn" onClick={handleLogout}>
        <FiLogOut />
        {isSidebarExpanded && <span>Logout</span>}
      </button>
    </div>

  );
}
