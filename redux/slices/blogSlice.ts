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
  search: string;
  filter: string;
}

const initialState: blogState = {
  blogs : [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  search: "",
  filter: "",
};

export const fetchAllBlogs = createAsyncThunk<
  {
    blogs: Blog[];
    page: number;
    limit: number;
    totalPages: number;
    search: string;
    filter: string;
  },
  { page: number; limit: number; search: string; filter: string;},
  { state: RootState; rejectValue: string }
>(
  "blog/fetchAllBlogs",
  async ({ page, limit, search, filter }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("No authentication token");

      const res = await axios.get(
        `${BACKEND_URL}/api/blogs/?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
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
        search, 
        filter,
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
            const res = await axios.post(`${BACKEND_URL}/api/blogs`, payload,
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
 {
    message: string;
    data: Blog;
    success: boolean;
  },
  {blogId: string, action: string},
  { state: RootState; rejectValue: string }
>("blog/delete", async ({blogId, action}, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    const res= await axios.patch(`${BACKEND_URL}/api/blogs/update/${blogId}/${action}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
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

    const res = await axios.get(`${BACKEND_URL}/api/blogs/${id}`, {
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

    const res = await axios.patch(
      `${BACKEND_URL}/api/blogs/${payload.blogId}`,
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

export const bulkActionBlogs = createAsyncThunk<
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
          await axios.patch(`${BACKEND_URL}/api/admin/update/blogs/${action}`,{ids},
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
        return(error.response?.data?.message || "failed to delete blogs"); 
    }
})


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
          state.search = action.payload.search;
          state.filter = action.payload.filter;
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
                (u) => u._id !== action.payload.data._id
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
        .addCase(bulkActionBlogs.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(bulkActionBlogs.fulfilled, (state, action)=>{
          state.loading=false;
          state.blogs= state.blogs.filter((blog)=> !action.payload.includes(blog._id));
        })
        .addCase(bulkActionBlogs.rejected, (state, action)=>{
          state.loading= false;
          state.error = action.payload as string;
        })
    }
})

export default blogSlice.reducer;