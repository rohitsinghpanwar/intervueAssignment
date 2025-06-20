import { configureStore } from "@reduxjs/toolkit";
import userTypeReducer  from './userTypeSlice'
export const store=configureStore({
    reducer:{
        userType:userTypeReducer
    }
})