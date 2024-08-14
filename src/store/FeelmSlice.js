 import { createSlice } from "@reduxjs/toolkit";

 const initialState ={
    bannerData : [],
    imageURL : ''
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
        }
    }
 })
 

 export const {setBannerData, setImageURL} = FeelmSlice.actions

 export default FeelmSlice.reducer