"use client"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleTheme } from "@/redux/slices/themeSlice";
import "../styles/darkmode.css";

const DarkModeSwitcher = ()=>{
    const dispatch = useDispatch();
    const {mode}= useSelector((state : RootState)=>state.theme);
    return(
        <button
            className={`theme-switcher ${mode === "dark" ? "dark" : ""}`}
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
            >
            <div className="switch-circle">
                {mode === "dark" ? "🌙" : "☀️"}
            </div>
        </button>
    )
}

export default DarkModeSwitcher;
