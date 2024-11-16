import {createSlice } from "@reduxjs/toolkit";

 const initialState ={
    bannerData : [],
    imageURL : '',
    userDetails: null,
    
 }

 export const FeelmSlice = createSlice({
    name: 'Feelm',
    initialState,
    reducers : {
        setBannerData : (state,action)=>{
            state.bannerData = action.payload
        },
        setImageURL : (state,action) =>{
            state.imageURL = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload; // Set user details
        },
    }
 })
 

 export const {setBannerData, setImageURL, setUserDetails } = FeelmSlice.actions

 export default FeelmSlice.reducer