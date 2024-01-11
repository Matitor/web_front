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
  completed_at: string;
  suite:string;
  email:string;
}


interface DataState {
  currentAnswId?: number | null;
  currentAnswDate: string;
  vacancyFromAnsw: VacData[];
  answ: AnswData[];
  userName?: string,
  status?: string,
  end?: string,
  start?: string
  
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentAnswId: null,
    currentAnswDate: '',
    vacancyFromAnsw: [],
    answ: [],
    userName: undefined,
    start: undefined,
    end: undefined,
    status:undefined,
  } as DataState,
  reducers: {
    setCurrentAnswId(state, action: PayloadAction<number| null |undefined>) {
      state.currentAnswId = action.payload;
      console.log("Current_Answ_id:", action.payload)
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
    },
    setCurrentUserFilter(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setStartFilter(state, action: PayloadAction<string>) {
      state.start = action.payload;
    },
    setEndFilter(state, action: PayloadAction<string>) {
      state.end = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    
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
  export const useStartFilter = () =>
  useSelector((state: { answData: DataState }) => state.answData.start);

export const useEndFilter = () =>
  useSelector((state: { answData: DataState }) => state.answData.end);
export const useStatusFilter = () =>
  useSelector((state: { answData: DataState }) => state.answData.status);
  export const useCurrentUserFilter = () =>
  useSelector((state: { answData: DataState }) => state.answData.userName);
export const {
    setCurrentAnswId: setCurrentAnswIdAction,
    setCurrentAnswDate: setCurrentAnswDateAction,
    setVacancyFromAnsw: setVacancyFromAnswAction,
    setAnsw: setAnswAction,
    setCurrentUserFilter: setCurrentUserFilterAction,
    setStartFilter: setStartFilterAction,
    setEndFilter: setEndilterAction,
    setStatusFilter: setStatusFilterAction,

} = dataSlice.actions;

export default dataSlice.reducer;