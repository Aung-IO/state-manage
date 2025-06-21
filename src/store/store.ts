import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import teamReducer from "@/store/slices/teamSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        teams: teamReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;