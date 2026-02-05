import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

export const HeaderData = [
  {
    title: "My Profile",
    path: "/myprofile",
    icon: <FaUser />,
  },
  {
    title: "Account Settings",
    path: "/settings",
    icon: <FaCog />,
  },
  {
    title: "Log Out ",
    path: "/login",
    icon: <FaSignOutAlt />,
    isLogout: true,
  },
];
