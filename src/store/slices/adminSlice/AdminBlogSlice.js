import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AdminGetAllBlogs,
    AdminCreateBlog,
    AdminUpdateBlog,
    AdminDeleteBlog,
} from "../../../services/NetworkServices";

// ================= GET ALL BLOGS =================
export const adminGetAllBlogs = createAsyncThunk(
    "adminBlog/getAllBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllBlogs();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch blogs"
            );
        }
    }
);

// ================= CREATE BLOG =================
export const adminCreateBlog = createAsyncThunk(
    "adminBlog/createBlog",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminCreateBlog(data);
            dispatch(adminGetAllBlogs()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to create blog"
            );
        }
    }
);

// ================= UPDATE BLOG =================
export const adminUpdateBlog = createAsyncThunk(
    "adminBlog/updateBlog",
    async ({ id, body }, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminUpdateBlog(id, body);
            dispatch(adminGetAllBlogs()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update blog"
            );
        }
    }
);

// ================= DELETE BLOG =================
export const adminDeleteBlog = createAsyncThunk(
    "adminBlog/deleteBlog",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminDeleteBlog(id);
            dispatch(adminGetAllBlogs()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete blog"
            );
        }
    }
);

// ================= SLICE =================
const AdminBlogSlice = createSlice({
    name: "adminBlog",
    initialState: {
        blogs: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET ALL BLOGS
            .addCase(adminGetAllBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(adminGetAllBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE BLOG
            .addCase(adminCreateBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminCreateBlog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminCreateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE BLOG
            .addCase(adminUpdateBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminUpdateBlog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminUpdateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE BLOG
            .addCase(adminDeleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminDeleteBlog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminDeleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = AdminBlogSlice.actions;
export default AdminBlogSlice.reducer;
