import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/slices/authslice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
