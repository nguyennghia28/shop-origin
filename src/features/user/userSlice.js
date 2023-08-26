import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

const initialState = {
    user: {},
    isLogin: false,
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: {
            reducer(state, action) {
                const { id, role } = action.payload;
                state.user.id = id;
                state.user.role = role;
                state.isLogin = true;
            },
            prepare(token) {
                const jwtPayload = jwt_decode(token);
                return {
                    payload: {
                        id: jwtPayload.id,
                        role: jwtPayload.role,
                    },
                };
            },
        },
        logOut: {
            reducer(state, action) {
                state.user = {};
                state.isLogin = false;
                state.error = '';
            },
            prepare(temp) {
                sessionStorage.removeItem('mynhbake_token');

                return {
                    payload: { id: temp.id, role: temp.role },
                };
            },
        },
    },
});

export const { setCurrentUser, logOut } = userSlice.actions;

export default userSlice.reducer;
