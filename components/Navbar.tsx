"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarData } from "./SidebarData";
import "../styles/navbar.css";
import Image from "next/image";
import logo from "@/public/globe.svg";
import logo2 from "@/public/globe.svg";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";

interface NavbarProps {
  isSidebarExpanded: boolean;
}

export default function Navbar({ isSidebarExpanded }: NavbarProps) {
  const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());    
    toast.success("Logout successfully")
    router.replace("/login");
  };

  return (
    <div className={`nav-menu ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
      <ul className="nav-menu-items">
        {/* Logo */}
        <div className="navbar-toggle">
          <Image
            src={isSidebarExpanded ? logo : logo2}
            alt="Logo"
            className={`logo ${isSidebarExpanded ? "expanded" : "collapsed"}`}
            priority
          />
        </div>

        {/* Menu Items */}
        {SidebarData.map((item, index) => (
          <li key={index} className={item.cName}>
            <Link href={item.path}>
              {item.icon}
              {isSidebarExpanded && <span>{item.title}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button className="lgoutbtn" onClick={handleLogout}>
        {<FiLogOut />}
      </button>
    </div>
  );
}
