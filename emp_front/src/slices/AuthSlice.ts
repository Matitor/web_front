import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface UserData {
  email: string;
  isSuperuser: boolean
}

interface DataState {
    user: UserData,
    isAuth: boolean,
    isMod:boolean,
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    user: {},
    isAuth: false,
    isMod: false,
  } as DataState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload
      console.log(`user is ${action.payload.email}`)
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload
      console.log(`is auth: ${action.payload}`)
    },
    setIsMod(state, action: PayloadAction<boolean>) {
      state.isMod = action.payload
      console.log(`is mod: ${action.payload}`)
    }
  },
});

export const useUser = () =>
  useSelector((state: { authData: DataState }) => state.authData.user);

export const useIsAuth = () =>
  useSelector((state: { authData: DataState }) => state.authData.isAuth);
export const useIsMod = () =>
  useSelector((state: { authData: DataState }) => state.authData.isMod);
export const {
  setUser: setUserAction,
  setIsAuth: setIsAuthAction,
  setIsMod: setIsModAction,
} = dataSlice.actions;

export default dataSlice.reducer;