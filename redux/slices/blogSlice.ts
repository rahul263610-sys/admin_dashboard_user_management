import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
}
interface blogState{
    blogs: Blog[];
    loading: boolean;
    error : string | null;
    page: number;
  limit: number;
  totalPages: number;
}

const initialState: blogState = {
  blogs : [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const fetchAllBlogs = createAsyncThunk<
  {
    blogs: Blog[];
    page: number;
    limit: number;
    totalPages: number;
  },
  { page: number; limit: number },
  { state: RootState; rejectValue: string }
>(
  "blog/fetchAllBlogs",
  async ({ page, limit }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("No authentication token");

      const res = await axios.get(
        `${BACKEND_URL}/blogs/getAllBlogs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

       return {
        blogs: res.data.data, 
        page: res.data.pagination.currentPage,
        limit: res.data.pagination.limit,
        totalPages: res.data.pagination.totalPages,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);


export const addBlog= createAsyncThunk(
    "blog/add",
    async(
        payload : {title : string, content: string, category: string,} , 
        {getState, rejectWithValue}
    ) =>{
        try{
            const state = getState() as RootState;
            const token = state.auth.token;
            const res = await axios.post(`${BACKEND_URL}/blogs/add`, payload,
                 {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add blog"
            );
        }
    }
)

export const deleteBlog = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("blog/delete", async (blogId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    await axios.delete(`${BACKEND_URL}/blogs/delete/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return blogId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

export const fetchBlogById = createAsyncThunk<
  Blog,
  string,
  { state: RootState; rejectValue: string }
>("blog/fetchblogbyid", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No token");

    const res = await axios.get(`${BACKEND_URL}/blogs/getBlog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.blog;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch blog"
    );
  }
});

export const updateBlog = createAsyncThunk<
  any,
  { blogId:string, title: string, content: string, category: string, },
  { state: RootState; rejectValue: string }
>("blog/update", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res = await axios.put(
      `${BACKEND_URL}/blogs/update/${payload.blogId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update blog"
    );
  }
});

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllBlogs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllBlogs.fulfilled, (state, action) => {
         state.loading = false;
          state.blogs = action.payload.blogs;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalPages = action.payload.totalPages;
        })
        .addCase(fetchAllBlogs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(addBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.blogs.push(action.payload);
        })
        .addCase(addBlog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(deleteBlog.fulfilled, (state, action) => {
            state.blogs = state.blogs.filter(
                (u) => u._id !== action.payload
            );
        })
        .addCase(deleteBlog.rejected, (state, action) => {
        state   .error = action.payload ?? "Failed to delete blog";
        })
        .addCase(updateBlog.fulfilled, (state, action) => {
            const updated = action.payload;
    
            const index = state.blogs.findIndex(
                (u) => u._id === updated.blogId
            );
    
            if (index !== -1) {
                state.blogs[index] = {
                ...state.blogs[index],
                ...updated,
                _id: updated.blogId,
                };
            }
        })
    }
})

export default blogSlice.reducer;