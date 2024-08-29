import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    currentUser: null,
}

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
    }
})

export const { setUsers, setCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;