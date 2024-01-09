import { HashRouter, Routes, Route, Navigate,Link } from 'react-router-dom'
import React from 'react';
import MainPage from './pages/MainPage/MainPage';
import VacPage from './pages/VacPage/VacPage';
//import DetaliedPage from 'pages/DetaliedPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ModPage from './pages/ModPage/ModPage';
import AnswerListPage from './pages/AnswListPage/AnswListPage';
import AnswPage from './pages/AnswPage/AnswPage';
import axios, {AxiosResponse} from 'axios';
import Cookies from "universal-cookie";
import {useDispatch} from "react-redux";
import {setUserAction, setIsAuthAction, useIsAuth, useIsMod, setIsModAction} from './slices/AuthSlice';
import {setVacAction} from "./slices/MainSlice";
import { setAnswAction, setCurrentAnswDateAction, setVacancyFromAnswAction, setCurrentAnswIdAction } from './slices/AnswSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mockVacancies } from '../consts';

const cookies = new Cookies();

export type ReceivedVacData = {
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

function App() {
  const dispatch = useDispatch();
  const isAuth = useIsAuth();
  const isMod = useIsMod();

  const getInitialUserInfo = async () => {
    console.log(cookies.get("session_id"))
    try {
      const response: AxiosResponse = await axios('http://localhost:8000/user_info',
      { 
        method: 'GET',
        withCredentials: true, 
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })

      console.log(response.data)
      dispatch(setIsAuthAction(true))
      dispatch(setIsModAction(response.data.is_superuser))
      dispatch(setUserAction({
        email: response.data.email,
        isSuperuser: response.data.is_superuser
      }))
      
    } 
    catch {
      console.log('Пользоатель не авторизован!!!')
    }
  }

  const getVac = async () => {
    try {
        const response = await axios('http://localhost:8000/vacancies', {
            method: 'GET',
            withCredentials: true 
        });
        const vacancies = response.data.vacancy;
        //if (response.data.application_id) {
        //  getCurrentAnsw(response.data.answer.id);
        //  dispatch(setCurrentAnswIdAction(response.data.answer.id))
        //}
        console.log("here")
        const newArr = vacancies.map((raw: ReceivedVacData) => ({
            id: raw.id,
            name: raw.name,
            desc: raw.desc,
            price_min: raw.price_min,
            price_max: raw.price_max,
            company: raw.company,
            pic: raw.pic,
            status:raw.status,
            adress:raw.adress,
            total_desk:raw.total_desk

        }));
        dispatch(setVacAction(newArr));
    }
    catch {
      dispatch(setVacAction(mockVacancies));
    }
};

const getCurrentAnsw = async (id: number) => {
  try {
    const response = await axios(`http://localhost:8000/answer/${id}`, {
      method: 'GET',
      withCredentials: true,
    })
    dispatch(setCurrentAnswDateAction(response.data.application.creation_date))
    const newArr = response.data.subscriptions.map((raw: ReceivedVacData) => ({
      id: raw.id,
            name: raw.name,
            desc: raw.desc,
            price_min: raw.price_min,
            price_max: raw.price_max,
            company: raw.company,
            pic: raw.pic,
            status:raw.status
  }));

  dispatch(setVacancyFromAnswAction(newArr))
  } catch(error) {
    throw error;
  }
}

  React.useEffect(() => {
    if (cookies.get("session_id")) {
      getInitialUserInfo();
    }
    getVac();
  }, [])

  return (
    <div className='app'>
      <HashRouter>
          <Routes>
             <Route path='/' element={<div><h1>Это наша стартовая страница</h1> <Link to='/vacancies'>another page</Link></div>} />
              <Route path="/vacancies" element={<MainPage />} />
              <Route path="/vacancies">
                <Route path=":id" element={<VacPage />} />
              </Route>
              {!isAuth && <Route path='/registration' element={<RegistrationPage/>}></Route>}
              {!isAuth && <Route path='/login' element={<LoginPage/>}></Route>}
              {/*{isAuth && <Route path='/answ' element={<CurAnswPage/>}/>}*/}
              {isAuth && <Route path='/answs' element={<AnswerListPage/>}></Route>}
              {isAuth && <Route path="/answs">
                <Route path=":id" element={<AnswPage />} />
              </Route>}
              {isMod && <Route path='/employee' element={<ModPage />} />}
              <Route path="*" element={<Navigate to="/vacancies" replace />} />
          </Routes>
      </HashRouter>
      <ToastContainer autoClose={1500} pauseOnHover={false} />
    </div>
    );
  }
  
export default App;