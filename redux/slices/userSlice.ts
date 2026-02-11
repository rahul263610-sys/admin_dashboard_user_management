import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import { User } from "@/components/types/user";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   about : string;
//   role: string;
//   status: string;
// }

interface UserState {
  users: User[];
  loading: boolean;
  success: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  filter: string;
}

const initialState: UserState = {
  users: [],
  loading: false,
  success:false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  search: "",
  filter: "",
};


export const fetchAllUsers = createAsyncThunk<
{
  users: User[];
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  filter: string;
},
 { page: number; limit: number;search: string; filter: string;},
  { state: RootState; rejectValue: string }
>("user/fetchAllUsers", async ( { page, limit, search, filter }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No authentication token");

    const res = await axios.get(`${BACKEND_URL}/api/users/profiles?page=${page}&limit=${limit}&search=${search}&filter=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      users: res.data.data, 
      page: res.data.pagination.currentPage,
      limit: res.data.pagination.limit,
      totalPages: res.data.pagination.totalPages,
      search, 
      filter,
    };

  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});


export const addUser = createAsyncThunk<
  any,
  { name: string; email: string; role: string; password: string; status: string, contactNumber:string, },
  { state: RootState; rejectValue: string }
>("user/add", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res = await axios.post(
      `${BACKEND_URL}/api/auth/register`,
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


export const fetchUserById = createAsyncThunk<
  User,
  string,
  { state: RootState; rejectValue: string }
>("user/fetchById", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No token");

    const res = await axios.get(`${BACKEND_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch user"
    );
  }
});


export const updateUser = createAsyncThunk<
  any,
  { userId: string; name: string; email: string; role: string; password: string; status: string, contactNumber: string },
  { state: RootState; rejectValue: string }
>("user/update", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res = await axios.patch(
      `${BACKEND_URL}/api/users/${payload.userId}`,
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

export const deleteUser = createAsyncThunk<
   {
    message: string;
    data: User;
    success: boolean;
  },
  {userId: string, action: string},
  { state: RootState; rejectValue: string }
>("user/delete", async ({userId, action}, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res= await axios.patch(`${BACKEND_URL}/api/admin/user/status/${userId}/${action}`, {},{
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

export const bulkActionUsers = createAsyncThunk<
string[], 
{selectedIds: string[], action: string},
{state : RootState , rejectvalue : string}
>("user/deleteMany", async({selectedIds, action}, {getState, rejectWithValue })=>{
    try{
        const token = getState().auth.token;
        if(!token){
          return rejectWithValue("No authorization token ");
        }
        const ids= selectedIds;
          await axios.patch(`${BACKEND_URL}/api/admin/update/users/status/${action}`,{ids},
            {
              headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type" : "application/json",
              }
            }
          )
          return ids;
    }
    catch(error : any){
        return(error.response?.data?.message || "failed to delete users"); 
    }
})

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
          state.users = action.payload.users;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalPages = action.payload.totalPages;
          state.search = action.payload.search;
          state.filter= action.payload.filter;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users";
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add user";
      })

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
          (u) => u._id !== action.payload.data._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete user";
      })
      .addCase(bulkActionUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkActionUsers.fulfilled, (state, action)=>{
        state.loading=false;
        state.users= state.users.filter((user)=> !action.payload.includes(user._id));
      })
      .addCase(bulkActionUsers.rejected, (state, action)=>{
        state.loading= false;
        state.error = action.payload as string;
      })
  },
});

export default userSlice.reducer;
