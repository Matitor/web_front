import React from 'react';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import { useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import {useDispatch} from "react-redux";
import {useUser, useIsAuth, setIsAuthAction, setUserAction} from "../../slices/AuthSlice";
import { useVacancyFromAnsw} from "../../slices/AnswSlice";
const cookies = new Cookies();
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import ProfileWindow from '../ProfileWindow/ProfileWindow.tsx';
const Header: React.FC = () => {
  const dispatch = useDispatch();
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false);
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = useState(false)
    const isUserAuth = useIsAuth();
    const vacanciesFromApplications = useVacancyFromAnsw();
    let user = useUser();

    const handleProfileButtonClick = () => {
        setIsProfileButtonClicked(!isProfileButtonClicked);
    };

    const logout = async () => {
        try {
            console.log(cookies.get('session_id'))
            const response: AxiosResponse = await axios('http://localhost:8000/logout/',
            {
                method: "POST",
                withCredentials: true,
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                }, 
            })

            cookies.remove("session_id", { path: "/" }); 

            dispatch(setIsAuthAction(false))
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

                {/* <div className={styles.header__blocks}>
                    <Link className={styles.header__block} to='/'>Виды абонементов</Link>
                    <Link className={styles.header__block} to='/'>Выгодные предложения</Link>
                    <Link className={styles.header__block} to='/'>О нас</Link>
                    <Link className={styles.header__block} to='/'>Поддержка</Link>
                </div> */}
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