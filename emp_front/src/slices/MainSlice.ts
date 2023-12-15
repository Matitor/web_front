import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";



interface VacData {
  id: number;
  name:string;
  desc:string;
  price_min?:number;
  price_max?:number;
  company:string;
  pic:string;
  status:string;
}

interface DataState {
  titleValue: string;
  vacancies: VacData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    titleValue: '',
    vacancies: [],
  } as DataState,
  reducers: {
    setTitleValue(state, action: PayloadAction<string>) {
      state.titleValue = action.payload
    },
    setVac(state, action: PayloadAction<VacData[]>) {
      console.log('pay is', action.payload)
      state.vacancies = action.payload
    },
  },
});

// Состояние, которое будем отображать в компонентах

export const useTitleValue = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.titleValue);

export const useVac = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.vacancies);


// Action, который будем применять в различных обработках
export const {
   
    setTitleValue: setTitleValueAction,
    setVac: setVacAction,
} = dataSlice.actions;

export default dataSlice.reducer;