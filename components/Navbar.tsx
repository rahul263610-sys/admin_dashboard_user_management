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
import {AiOutlineClose,  } from "react-icons/ai";
import {FaChevronDown } from "react-icons/fa";
import { getUserRole } from "@/lib/getUserRole";


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
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({});
  const role = getUserRole();

  const toggleSubmenu = (title: string) => {
  setOpenMenus((prev) => ({
    ...prev,
    [title]: !prev[title],
  }));
};


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
        {SidebarData.filter(item =>!item.roles || item.roles.includes(role!) ).map((item, index) => {
          const isParentExactActive = pathname === item.path;
          const isChildActive = item.children?.some((child) => pathname === child.path);

          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus[item.title] ?? isChildActive;

          return (
              <li
                key={index}
                className={`nav-text 
                  ${isParentExactActive ? "active-parent" : ""} 
                  ${isChildActive ? "active-child-parent" : ""}
                `}
              >
                <div className="menu-parent"> 
                  <Link
                    href={item.path}
                    className="menu-link"
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault(); // stop navigation
                        toggleSubmenu(item.title); // ONLY toggle
                      } else {
                        handleLinkClick();
                      }
                    }}
                  >
                    <span className="icon">{item.icon}</span>
                    {isSidebarExpanded && <span className="label">{item.title}</span>}
                    {hasChildren && isSidebarExpanded && (
                      <FaChevronDown
                        className={`submenu-arrow ${isOpen ? "rotate" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleSubmenu(item.title);
                        }}
                      />
                    )}
                  </Link>

                </div>

                {hasChildren && isOpen && isSidebarExpanded && (
                  <ul className="submenu">
                    {item.children.map((sub, i) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <li key={i} className={`submenu-item ${isSubActive ? "active" : ""}`}>
                          <Link href={sub.path} onClick={handleLinkClick}>
                            {sub.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
