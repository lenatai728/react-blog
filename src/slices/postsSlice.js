import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    submittingStatus: false,
}

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSubmittingStatus: (state, action) => {
            state.submittingStatus = action.payload;
        }
    }
})

export const { setPosts, setSubmittingStatus } = postsSlice.actions;
export default postsSlice.reducer;