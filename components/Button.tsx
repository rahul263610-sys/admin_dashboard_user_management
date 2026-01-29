"use client";
import { ReactNode } from 'react';

import "../styles/button.css";
interface ButtonProps {
  text?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "edit" | "delete";
  className?: string;
}

export default function Button({ text, icon, onClick,  type = "button",  variant = "edit", className=""  }: ButtonProps) {
  const base =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition shadow focus:outline-none focus:ring-2";

  const variants = {
    edit: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    delete: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  return (
    <button onClick={onClick} type={type} className={className? className : `btn ${variant === "edit" ? "btn-edit" : "btn-delete"}`}>
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
}
