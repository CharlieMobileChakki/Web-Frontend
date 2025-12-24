import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendOtpSignIn, sendOtpSignUp, SignInUser, SignUpUser } from "../../services/NetworkServices";
import { clearLocalData, setGetLocalData } from "../../services/LocalStorageHelper";



// login user
export const SendOtpLogin = createAsyncThunk(
    "auth/SendOtpLogin",
    async (phone, { rejectWithValue }) => {
        try {
            const res = await sendOtpSignIn({ mobile: phone });
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Login Failed")

        }
    }
)


export const verifyOtpAndSignin = createAsyncThunk(
    "auth/verifyOtpAndSignin",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await SignInUser(formData);
            return res.data

        } catch (error) {
            return rejectWithValue(error?.response?.data || "Sign in Failed")

        }
    }
)


// signup user
export const sendOtpSignup = createAsyncThunk(
    "auth/sendOtpSignup",
    async (data, { rejectWithValue }) => {
        try {
            const res = await sendOtpSignUp(data) // data should be { mobile, name }
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed Send Otp")

        }
    }
)


export const verifyOtpAndSignup = createAsyncThunk(
    "auth/verifyOtpAndSignup",
    async (formData, { rejectWithValue }) => {
        try {
            // Strict API payload: only mobile and otp
            const apiPayload = { mobile: formData.mobile, otp: formData.otp };
            const res = await SignUpUser(apiPayload);

            // Debug logs
            // console.log("Signup Response:", res.data);

            // Patch logic: Inject name if missing from API response but present in local form data
            const responseData = res.data;
            if (responseData && responseData.data && responseData.data.user) {
                if (!responseData.data.user.name && formData.name) {
                    // console.log("Patching missing name with:", formData.name);
                    responseData.data.user.name = formData.name;
                }
            }

            return responseData;

        } catch (error) {
            return rejectWithValue(error?.response?.data || "sign up failed")

        }
    }
)


// ---------------- Slice ----------------
const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        token: setGetLocalData("token") || null,
        user: setGetLocalData("user") || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            clearLocalData();
        },

        // ✅ Manual update (used when profile updates)
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload)); // 🔥 Sync immediately
        },
    },
    extraReducers: (builder) => {
        builder
            //login
            .addCase(SendOtpLogin.pending, (state) => {
                state.loading = true;
            })

            .addCase(SendOtpLogin.fulfilled, (state, action) => {
                state.loading = false;
                // state.token = action.payload.token;
                // state.user = action.payload.user;
                localStorage.setItem("token", action.payload.token);

            })
            .addCase(SendOtpLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(verifyOtpAndSignin.fulfilled, (state, action) => {
                state.loading = false;
                const { token, user } = action.payload.data;
                state.user = user;
                state.token = token;

                // ✅ Set token and user in localStorage
                setGetLocalData("token", token);
                setGetLocalData("user", user);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

            })

            .addCase(verifyOtpAndSignin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // signUp

            .addCase(sendOtpSignup.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(sendOtpSignup.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(sendOtpSignup.rejected, (state, action) => {
                state.loading = false; state.error = action.payload;
            })

            .addCase(verifyOtpAndSignup.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(verifyOtpAndSignup.fulfilled, (state, action) => {
                state.loading = false;
                const { token, user } = action.payload.data;
                state.user = user;
                state.token = token;

                // ✅ Set token and user in localStorage
                setGetLocalData("token", token);
                setGetLocalData("user", user);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(verifyOtpAndSignup.rejected, (state, action) => {
                state.loading = false; state.error = action.payload;
            });
    }
})


export const { logout, updateUser } = AuthSlice.actions;
export default AuthSlice.reducer;