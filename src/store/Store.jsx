import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import dataReducer from './dataSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    MoviesAndShows: dataReducer,
  },
})
