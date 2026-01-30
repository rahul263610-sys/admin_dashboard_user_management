import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthState {
  userId: string | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authLoaded: boolean;
}

const initialState: AuthState = {
  userId: null,
  user: null,
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
        `${BACKEND_URL}/api/auth/login`,
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
export const myProfile = createAsyncThunk(
  "auth/myprofile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BACKEND_URL}/api/users/myprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateMyProfile = createAsyncThunk<
  { user: User },              
  { name: string; email: string },    
  { rejectValue: string }
>(
  "auth/updateMyProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BACKEND_URL}/api/users/myprofile/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
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
      localStorage.removeItem("username");
    },

    loadUserFromStorage: (state) => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

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
        localStorage.setItem("username", action.payload.name);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(myProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
      })
      .addCase(myProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
