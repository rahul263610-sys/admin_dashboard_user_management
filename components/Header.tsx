import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import "../styles/header.css";

interface HeaderProps {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void; // toggleSidebar is a function that returns void
}
 function Header({ isSidebarExpanded, toggleSidebar }: HeaderProps) {
  return (
    <header className={`topbar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
      <div className="topbar-content">
        {/* Left: Toggle */}
        <button onClick={toggleSidebar} className="toggle-button">
          <AiOutlineMenu />
        </button>

        {/* Right: Welcome text */}
        <div className="topbar-right">
          <span className="admin-name">Welcome</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
