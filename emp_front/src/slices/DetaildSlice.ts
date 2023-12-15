import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface VacData {
  id:number;
    name:string;
    desc:string;
    price_min?:number;
    price_max?:number;
    company:string;
    pic:string;
    status:string;
    total_desk?:string;
    adress?:string;
}

interface DataState {
  vacancy: VacData,
  LinksMapData: Map<string, string>
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    vacancy: {},
    LinksMapData: new Map<string, string>([['Вакансии', '/vacancies']])
  } as DataState,
  reducers: {
    setVacancy(state, action: PayloadAction<VacData>) {
        state.vacancy = action.payload
    },
    setLinksMapData(state, action: PayloadAction<Map<string, string>>) {
      console.log(action.payload)
      state.LinksMapData = action.payload
  },
  },
});

export const useVacancy = () =>
  useSelector((state: { detailedData: DataState }) => state.detailedData.vacancy);

export const useLinksMapData = () =>
  useSelector((state: { detailedData: DataState }) => state.detailedData.LinksMapData);

export const {
    setVacancy: setVacancyAction,
    setLinksMapData: setLinksMapDataAction
} = dataSlice.actions;

export default dataSlice.reducer;