import { configureStore } from '@reduxjs/toolkit'
import FeelmReducer from './FeelmSlice'
import authReducer from './authSlice'
import profileReducer from './profileSlice'

export const store = configureStore({
  reducer: {
    FeelmData : FeelmReducer,
    auth: authReducer,
    profile: profileReducer
  },
})
