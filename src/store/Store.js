import { configureStore } from '@reduxjs/toolkit'
import FeelmReducer from './FeelmSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    FeelmData : FeelmReducer,
    auth: authReducer,
  },
})
