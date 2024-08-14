import { configureStore } from '@reduxjs/toolkit'
import FeelmReducer from './FeelmSlice'

export const store = configureStore({
  reducer: {
    FeelmData : FeelmReducer
  },
})
