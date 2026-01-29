import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AuthState {
  userId: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authLoaded: boolean;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  authLoaded: false,
};

/**
 * ✅ LOGIN API (AXIOS)
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/users/Login`,
        payload
      );

      return res.data; // <-- full response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authLoaded = true;

      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    },

    loadUserFromStorage: (state) => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && token) {
        state.userId = userId;
        state.token = token;
        state.isAuthenticated = true;
      }

      state.authLoaded = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        state.userId = action.payload.id;
        state.token = action.payload.token;

        // ✅ Persist login
        localStorage.setItem("userId", action.payload.id);
        localStorage.setItem("token", action.payload.token);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
