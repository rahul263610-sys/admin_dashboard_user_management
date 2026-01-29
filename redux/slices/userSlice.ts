import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  success:false,
  error: null,
};

/* ================= FETCH ALL USERS ================= */
export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { state: RootState; rejectValue: string }
>("user/fetchAllUsers", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No authentication token");

    const res = await axios.get(`${BACKEND_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.usser; 
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

/* ================= ADD USER ================= */
export const addUser = createAsyncThunk<
  any,
  { name: string; email: string; role: string; password: string; status: string },
  { state: RootState; rejectValue: string }
>("user/add", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res = await axios.post(
      `${BACKEND_URL}/users/register`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add user"
    );
  }
});

/* ================= FETCH USER ================= */
export const fetchUserById = createAsyncThunk<
  User,
  string,
  { state: RootState; rejectValue: string }
>("user/fetchByEmail", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No token");

    const res = await axios.get(`${BACKEND_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch user"
    );
  }
});

/* ================= UPDATE USER ================= */
export const updateUser = createAsyncThunk<
  any,
  { userId: string; name: string; email: string; role: string; password: string; status: string },
  { state: RootState; rejectValue: string }
>("user/update", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res = await axios.put(
      `${BACKEND_URL}/users/updateprofile/${payload.userId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

/* ================= DELETE USER ================= */
export const deleteUser = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("user/delete", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    await axios.delete(`${BACKEND_URL}/users/deleteuser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return userId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users";
      })

      /* ADD */
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add user";
      })

      /* UPDATE */
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.users.findIndex(
            (u) => u._id === updated.userId || u.email === updated.email
        );

        if (index !== -1) {
            state.users[index] = {
            ...state.users[index],
            ...updated,
            _id: updated.userId,
            };
        }
       })

      /* FETCH SINGLE */
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
        else state.users.push(action.payload);
      })

      /* DELETE */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
