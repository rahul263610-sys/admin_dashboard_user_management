import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import blogReducer from "./slices/blogSlice";
import searchReducer from "./slices/searchSlice";
import themeReducer from "./slices/themeSlice";
import loginHistoryReducer from "./slices/loginHistory";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    blogs: blogReducer,
    search: searchReducer,
    theme: themeReducer,
    loginHistory : loginHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
