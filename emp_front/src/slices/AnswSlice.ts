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

interface AnswData {
  id: number;
  status: string;
  created_at: string;
  processed_at: string;
  completed_at: string
}


interface DataState {
  currentAnswId: number | null;
  currentAnswDate: string;
  vacancyFromAnsw: VacData[];
  answ: AnswData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentAnswId: null,
    currentAnswDate: '',
    vacancyFromAnsw: [],
    answ: []
  } as DataState,
  reducers: {
    setCurrentAnswId(state, action: PayloadAction<number>) {
      state.currentAnswId = action.payload;
    },
    setCurrentAnswDate(state, action: PayloadAction<string>) {
      state.currentAnswDate = action.payload;
    },
    setVacancyFromAnsw(state, action: PayloadAction<VacData[]>) {
      state.vacancyFromAnsw = action.payload;
      console.log('INFO', action.payload)
    },
    setAnsw(state, action: PayloadAction<AnswData[]>) {
      state.answ = action.payload;
      console.log('answ is', action.payload)
    }
  },
});

export const useCurrentAnswId = () =>
  useSelector((state: { answData: DataState }) => state.answData.currentAnswId);

export const useCurrentAnswDate = () =>
  useSelector((state: { answData: DataState }) => state.answData.currentAnswDate);

export const useVacancyFromAnsw = () =>
  useSelector((state: { answData: DataState }) => state.answData.vacancyFromAnsw);

export const useAnsw = () =>
  useSelector((state: { answData: DataState }) => state.answData.answ);

export const {
    setCurrentAnswId: setCurrentAnswIdAction,
    setCurrentAnswDate: setCurrentAnswDateAction,
    setVacancyFromAnsw: setVacancyFromAnswAction,
    setAnsw: setAnswAction

} = dataSlice.actions;

export default dataSlice.reducer;