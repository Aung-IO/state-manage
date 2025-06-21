import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    user  : string  | null;
}

const initialState : AuthState = {
    user :  null
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        login(state, action : PayloadAction<string>){
            state.user = action.payload
            localStorage.setItem("user", action.payload)
        },
        logout(state){
            state.user = null
            localStorage.removeItem("user")
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer