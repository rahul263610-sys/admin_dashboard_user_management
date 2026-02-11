import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../components/types/user";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   bio: string;
//   phone: string;
//   status: string;
// }

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
    payload: { email: string; password: string;  latitude?: number | null; longitude?: number | null; device?: string; },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        payload
      );

      return res.data;
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

      const res = await axios.patch(
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
export const updateMyProfileImage = createAsyncThunk<
  { success: boolean; message: string; data: User },
  FormData,
  { rejectValue: string }
>(
  "auth/updateMyProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${BACKEND_URL}/api/users/myprofile/update/myprofile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile image"
      );
    }
  }
);


export const changePassword = createAsyncThunk<
  { message: string },          // return type
  { oldpassword: string; newpassword: string },
  { rejectValue: string }
>(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BACKEND_URL}/api/users/update/password/myprofile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const deleteMyProfileImage = createAsyncThunk<
  { success: boolean; message: string; data: User },
  void,
  { rejectValue: string }
>(
  "auth/deleteMyProfileImage",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${BACKEND_URL}/api/users/myprofile/delete/myprofile/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete profile image"
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

      if (token) {
        state.userId = userId;
        state.token = token;
        state.isAuthenticated = true;
      }

      state.authLoaded = true;
    },
    
      googleLoginSuccess: (state, action) => {
        const token = action.payload;

        state.token = token;
        state.isAuthenticated = true;
        state.authLoaded = true;
        localStorage.setItem("userId", action.payload.id);
        localStorage.setItem("token", token);
      }
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

        localStorage.setItem("userId", action.payload.id);
        localStorage.setItem("token", action.payload.token);
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
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMyProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfileImage.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.user = action.payload.data;
        }
      })
      .addCase(updateMyProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMyProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMyProfileImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteMyProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    },
  });

export const { logout, loadUserFromStorage, googleLoginSuccess  } = authSlice.actions;
export default authSlice.reducer;
