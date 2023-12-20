import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import folderSlice from "./features/folderSlice";

const store = configureStore({
    reducer: {
        folders: folderSlice,
        auth: authSlice
    }
});

export default store;
