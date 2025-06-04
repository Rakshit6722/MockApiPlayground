import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    username: string;
    email: string;
    token: string;
}

interface initialStateType {
    userInfo: UserState;
    isLoggedIn: boolean;
    isLoading: boolean;
}
const initialState: initialStateType = {
    userInfo: {
        username: '',
        email: '',
        token: '',
    },
    isLoggedIn: false,
    isLoading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetUser: (state) => {
            state.userInfo = initialState.userInfo;
            state.isLoggedIn = initialState.isLoggedIn;
            state.isLoading = initialState.isLoading;
        },
        logoutUser: (state) => {
            state.userInfo = {
                username: '',
                email: '',
                token: '',
            };
            state.isLoggedIn = false;
            state.isLoading = false;
        }
    },
});

export const { setUserInfo, setIsLoggedIn, setIsLoading, resetUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
