import { FaHome, FaUser, FaBlog,FaChevronDown   } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
    cName: "nav-text",
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUser />,
    cName: "nav-text",
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
    children: [
      { title: "All Blogs", path: "/blogs" },
      { title: "Add Blog", path: "/blogs/add" },
    ],
  },
];
