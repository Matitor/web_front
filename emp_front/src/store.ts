import { combineReducers, configureStore } from "@reduxjs/toolkit"
import mainDataReducer from './slices/MainSlice'
import detailedDataReducer from './slices/DetaildSlice'
import authDataReducer from "./slices/AuthSlice"
import answDataReducer from './slices/AnswSlice'



export default configureStore({
    reducer: combineReducers({
        mainData: mainDataReducer,
        detailedData: detailedDataReducer,
        authData: authDataReducer,
        answData: answDataReducer
    })
})