"use client";
import { useState, useEffect,  useRef } from "react"; 
import { AiOutlineMenu, AiOutlineUser, AiOutlineClose  } from "react-icons/ai";
import "../styles/header.css";
import Link from "next/link";
import Image from "next/image";
import { HeaderData } from "./HeaderData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { myProfile, logout } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setSearch,  setFilter, resetSearch } from "@/redux/slices/searchSlice";
import { usePathname } from "next/navigation";
import { searchConfig } from "@/lib/config/searchConfig";
import { filterConfig } from "@/lib/config/filterConfig";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { getUserRole } from "@/lib/getUserRole";

interface HeaderProps {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void; // toggleSidebar is a function that returns void
   isMobile: boolean;
}
 function Header({ isSidebarExpanded, toggleSidebar, isMobile }: HeaderProps) {
  const pathname = usePathname();
  const router= useRouter();
  const role= getUserRole();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { search, filter} = useSelector ((state: RootState)=> state.search);

  useEffect(() => {
    dispatch(resetSearch());
  }, [pathname]);

  useEffect(() => {
    dispatch(myProfile());
  }, [dispatch]);

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
  const handleLogout = () => {
    dispatch(logout());    
    toast.success("Logout successfully")
    router.replace("/login");
  };

  const activeSearch = Object.keys(searchConfig).find((key) => pathname === `/${key}`);
  const filterType = activeSearch ? searchConfig[activeSearch]?.filterType : undefined;

  const handleFilterChange = (key: "filter", value: any)=>{
    if(key==="filter") dispatch(setFilter(value));
  }

  return (
    <header className={`topbar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
      <div className="topbar-content">
        <div className="topbar-left">
          {!isMobile || !isSidebarExpanded ? (
            <button onClick={toggleSidebar} className="toggle-button">
              <AiOutlineMenu size={24} />
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}

          {/* SEARCH BAR */}
          <div className="header-search">
           {activeSearch && filterType && ( 
              <div className="header-search">
                <input
                  type="text"
                  placeholder={searchConfig[activeSearch].placeholder}
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="search-input"
                />
                
                {filterConfig[filterType]?.map((item) => {
                    if (item.role && item.role !== role) return null;
                    return (
                      <select
                        key={item.key}
                        value={filter}
                        onChange={(e) =>
                            handleFilterChange(
                              item.key,
                              e.target.value
                            )
                          }
                        className="filter-select"
                      >
                        {item.options.map((opt)=>(
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )
                  })
                }
              </div>
            )}
          </div>
        </div>
        <div className="topbar-right" ref={dropdownRef}>
           <DarkModeSwitcher />
          <div
            className="admin-info"
            onClick={() => setOpen((prev) => !prev)}
          > {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={35}
                height={35}
                className="admin-avatar"
              />
            ) : (
              <AiOutlineUser size={35} className="admin-avatar placeholder-avatar" />
            )}          
            <span className="admin-name">Welcome {user?.name ? user.name : 'user'}</span>
          </div>
          {open && (
            <ul className="admin-dropdown">
              {HeaderData.map((item, index) => (
                <li key={index}>
                  {item.isLogout ? (
                  <button
                    onClick={handleLogout}
                    className="dropdown-link logout-btn"
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className="dropdown-link"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}
              </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
