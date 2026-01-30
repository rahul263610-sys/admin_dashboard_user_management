import { useState, useEffect,  useRef } from "react"; 
import { AiOutlineMenu, AiOutlineUser   } from "react-icons/ai";
import "../styles/header.css";
import Link from "next/link";

interface HeaderProps {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void; // toggleSidebar is a function that returns void
}
 function Header({ isSidebarExpanded, toggleSidebar }: HeaderProps) {
  const username = localStorage.getItem('username');
   const [open, setOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className={`topbar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
      <div className="topbar-content">
        <button onClick={toggleSidebar} className="toggle-button">
          <AiOutlineMenu />
        </button>
        <div className="topbar-right" ref={dropdownRef}>
          <div
            className="admin-info"
            onClick={() => setOpen((prev) => !prev)}
          > 
            <AiOutlineUser size={35} className="admin-avatar placeholder-avatar" />
            <span className="admin-name">Welcome {username ? username : 'user'}</span>
          </div>

          {open && (
            <ul className="admin-dropdown">
              <li>
                <Link href="/myprofile" onClick={() => setOpen(false)}>
                  My profile
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
