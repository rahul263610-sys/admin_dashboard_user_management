import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LoginHistoryState {
  loading: boolean;
  error: string | null;
  data: any[];
  page: number;
  totalPages: number;
  limit: number;
  search: string;
}

const initialState: LoginHistoryState = {
  loading: false,
  error: null,
  data: [],
  page: 1,
  totalPages: 1,
  limit: 10,
  search: "",
};

export const fetchLoginHistory = createAsyncThunk(
  "loginHistory/fetch",
  async (
    { page, limit,search  }: { page: number; limit: number; search: string; },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BACKEND_URL}/api/loginHistory/getAllLocations?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch login history"
      );
    }
  }
);

export const saveLoginHistory = createAsyncThunk(
  "loginHistory/save",
  async (
    payload: {
      latitude?: number | null;
      longitude?: number | null;
      device?: string | null;
      ipAddress?: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BACKEND_URL}/api/loginHistory/saveLoginDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save login history"
      );
    }
  }
);

const loginHistorySlice = createSlice({
  name: "loginHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.page = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.limit = action.payload.pagination.limit;
      })
      .addCase(fetchLoginHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveLoginHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLoginHistory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveLoginHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export default loginHistorySlice.reducer;
