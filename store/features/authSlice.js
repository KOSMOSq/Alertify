import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "@firebase/auth";
import { createSlice } from "@reduxjs/toolkit";
import { FIREBASE_AUTH } from "../../lib/firebase";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: { uid: null, email: null },
        loading: false,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: state => {
            state.user = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: state => {
            state.error = null;
        }
    }
});

export const { setUser, clearUser, setLoading, setError, clearError } =
    authSlice.actions;
export default authSlice.reducer;

export const signInUser = (email, password) => async dispatch => {
    dispatch(setLoading(true));

    try {
        const response = await signInWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password
        );
        const serializedUser = response.user
            ? { uid: response.user.uid, email: response.user.email }
            : null;
        dispatch(setUser(serializedUser));
    } catch (error) {
        console.error("Sign in failed:", error);
        dispatch(setError(error.message || "Sign in failed"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const signUpUser = (email, password) => async dispatch => {
    dispatch(setLoading(true));

    try {
        const response = await createUserWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password
        );
        const serializedUser = response.user
            ? { uid: response.user.uid, email: response.user.email }
            : null;
        dispatch(setUser(serializedUser));
    } catch (error) {
        console.error("Sign up failed:", error);
        dispatch(setError(error.message || "Sign up failed"));
    } finally {
        dispatch(setLoading(false));
    }
};
