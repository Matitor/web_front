import React from 'react';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import { useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import {useDispatch} from "react-redux";
import {useUser, useIsAuth, setIsAuthAction, setUserAction,useIsMod,setIsModAction} from "../../slices/AuthSlice";
import {setCurrentAnswDateAction, setCurrentAnswIdAction, setVacancyFromAnswAction, useCurrentAnswId} from "../../slices/AnswSlice.ts";
import { useVacancyFromAnsw} from "../../slices/AnswSlice";
const cookies = new Cookies();
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export type headerProps = {
  flag?: boolean;
};
const Header: React.FC<headerProps> = ({flag}) => {
  const dispatch = useDispatch();
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false);
    const [IsAnsw, setIsAnsw] = useState(false);
    const isUserAuth = useIsAuth();
    const answ = useCurrentAnswId();
    const IsMod = useIsMod();
    const vacanciesFromApplications = useVacancyFromAnsw();
    let user = useUser();

    useEffect(() => {
      if(answ==-1){
        setIsAnsw(false);  
      }
      else{
        setIsAnsw(true);
      }
    }, [answ]);
    const handleProfileButtonClick = () => {
        setIsProfileButtonClicked(!isProfileButtonClicked);
    };

    const logout = async () => {
      try {
          console.log(cookies.get('session_id'))
         await axios('http://localhost:8000/logout/',
          {
              method: "POST",
              withCredentials: true,
              headers: { 
                  "Content-type": "application/json; charset=UTF-8"
              }, 
          })

          cookies.remove("session_id", { path: "/" }); 
          dispatch(setIsModAction(false))
          dispatch(setIsAuthAction(false))
          dispatch(setVacancyFromAnswAction([]));
          dispatch(setCurrentAnswDateAction(''));
          dispatch(setCurrentAnswIdAction(undefined));
          localStorage.setItem('vacancyFromAnsw', JSON.stringify([]));
          dispatch(setUserAction({
              email: "",
              isSuperuser: false
          }))
          setIsProfileButtonClicked(false);
          toast.success("Выход выполнен  успешно");
      }
      catch(error) {
          console.log(error)
      }
  }

  const handleSubmit = async () => {
      await logout();
  };

    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
            {IsMod &&  <Link to="/employee" className={styles.header__profile}>Работодатель</Link>}
            <span className={styles.header__spacer}>&nbsp;&nbsp;&nbsp;</span>
            {isUserAuth && <Link to="/answs" className={styles.header__profile}>Список откликов</Link>}
            {isUserAuth && IsAnsw && flag && (
  <Link to={`/answs/${answ}`} className={styles.header__profile}>
    Отклик
  </Link>
)}
{isUserAuth && !IsAnsw && flag && (
  <div style={{ color: "#fff", fontSize:20 }}>Отклик</div>
)}
                {isUserAuth && (
            <div className={styles.header__profile} onClick={handleSubmit}>
              Выход
            </div>
          )}
                {isUserAuth ? <div className={styles.header__profile} onClick={handleProfileButtonClick}/> : <Link to='/login' className={styles.header__profile}>Вход<div/></Link>}
                <Link to='/vacancies' className={styles.header__profile}>🔍 Поиск</Link>
            </div>
        </div>
    )
};

export default Header;