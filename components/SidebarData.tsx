import { FaHome, FaUser, FaBlog  } from "react-icons/fa";

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
  },
  {
    title: "Blogs",
    path: "/blogs",
    icon: <FaBlog />,
    cName: "nav-text",
  },
];
