import { FaHome, FaUser, FaBlog,FaChevronDown   } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
    cName: "nav-text",
    roles: ["admin"],
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUser />,
    cName: "nav-text",
    roles: ["admin"],
     children: [
      { title: "All Users", path: "/users" },
      { title: "Add User", path: "/users/add" },
    ],
  },
  {
    title: "Blogs",
    path: "/blogs",
    icon: <FaBlog />,
    cName: "nav-text",
    roles: ["admin", "user"],
    children: [
      { title: "All Blogs", path: "/blogs" },
      { title: "Add Blog", path: "/blogs/add" },
    ],
  },
];
