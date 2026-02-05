import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminCreatePlatform, AdminDeletePlatform, AdminGetAllPlatforms, AdminUpdatePlatform } from "../../../services/NetworkServices";




export const createPlatform = createAsyncThunk(
    "platform/createPlatform",
    async (data, { rejectWithValue }) => {
        try {
            const response = await AdminCreatePlatform(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllPlatforms = createAsyncThunk(
    "platform/getAllPlatforms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllPlatforms();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updatePlatform = createAsyncThunk(
    "platform/updatePlatform",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await AdminUpdatePlatform(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deletePlatform = createAsyncThunk(
    "platform/deletePlatform",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminDeletePlatform(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const PlatformSlice = createSlice({
    name: "Platform",
    initialState: {
        platform: [],
        error: null,
        loading: false,
    },
    reducers: {
        setPlatform: (state, action) => {
            state.platform = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            // createPlatform
            .addCase(createPlatform.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlatform.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPlatform.fulfilled, (state, action) => {
                state.platform.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })

            // getAllPlatforms
            .addCase(getAllPlatforms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPlatforms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllPlatforms.fulfilled, (state, action) => {
                state.platform = action.payload.data;
                state.loading = false;
                state.error = null;
            })

            // updatePlatform

            .addCase(updatePlatform.fulfilled, (state, action) => {
                const updatedPlatform = action.payload.data;
                const index = state.platform.findIndex(
                    (platform) => platform._id === updatedPlatform._id
                );
                if (index !== -1) {
                    state.platform[index] = updatedPlatform;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePlatform.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlatform.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // deletePlatform
            .addCase(deletePlatform.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlatform.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePlatform.fulfilled, (state, action) => {
                const deletedPlatformId = action.payload.data._id;
                state.platform = state.platform.filter(
                    (platform) => platform._id !== deletedPlatformId
                );
                state.loading = false;
                state.error = null;
            });


    },
});

export const { setPlatform } = PlatformSlice.actions;
export default PlatformSlice.reducer;