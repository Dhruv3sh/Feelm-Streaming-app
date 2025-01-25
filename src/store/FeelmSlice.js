import {createSlice } from "@reduxjs/toolkit";

 const initialState ={
    bannerData : [],
    
 }

 export const FeelmSlice = createSlice({
    name: 'Feelm',
    initialState,
    reducers : {
        setBannerData : (state,action)=>{
            state.bannerData = action.payload
        },
    }
 })
 

 export const {setBannerData } = FeelmSlice.actions

 export default FeelmSlice.reducer