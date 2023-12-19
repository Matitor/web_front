import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import styles from './CurAnswPage.module.scss'
import Header from '../../components/Header'
import Button from 'react-bootstrap/Button'
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import {useCurrentAnswId } from  "../../slices/AnswSlice";
import { useDispatch } from 'react-redux'
import {useCurrentAnswDate, useVacancyFromAnsw,setCurrentAnswDateAction, setVacancyFromAnswAction } from  "../../slices/AnswSlice";
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";
import VacancyTable from '../../components/VacTab/VacTab'

export type ReceivedVacancyData = {
    id: number,
    name: string,
    price_min?: number,
    price_max?: number,
    company: string,
}

const CurrentAnswPage = () => {
  const dispatch = useDispatch();
  const currentAnswId = useCurrentAnswId();
  const linksMap = useLinksMapData();

  console.log("Черновик", currentAnswId)


  React.useEffect(() => {
    dispatch(setLinksMapDataAction(new Map<string, string>([
      ['Текущий отклик', '/answ']
  ])))
  if (currentAnswId) {getAnsw(currentAnswId)}
  }, [])

  const vacancies = useVacancyFromAnsw();
  const getAnsw = async (id: number) => {
    try {
        const response = await axios(`http://localhost:8000/answer/${id}`, {
            method: 'GET',
            withCredentials: true 
        });
        console.log("BASKET", response)
        const jsonData = response.data.answ;
        console.log(jsonData.created_at)
        dispatch(setCurrentAnswDateAction(jsonData.created_at));
    }
    catch (error) {
          toast.error("Ошибка импорта заявки");
        }
    }



  const sendAnsw = async () => {
    try {
      const response = await axios(`http://localhost:8000/answer/accept`, {
        method: 'PUT',
        withCredentials: true
      })

      dispatch(setVacancyFromAnswAction([]));
      dispatch(setCurrentAnswDateAction(''));
      toast.success("Отправлено на проверку модератору");
    } catch(error) {
      throw error;
    }
  }

  const deleteResp = async () => {
    try {
      const response = await axios(`http://localhost:8000/answer/del`, {
      method: 'DELETE',
      withCredentials: true
    })

    dispatch(setVacancyFromAnswAction([]));
    dispatch(setCurrentAnswDateAction(''));
    toast.success("Отклик удален");
    }
    catch(error) {
      throw error;
    }
    
  }

  const handleSendButtonClick = () => {
    sendAnsw();
  }

  const handleDeleteButtonClick = () => {
    deleteResp();
  }

  return (
    <div className={styles.application__page}>
      <Header/>
      <div className={styles['application__page-wrapper']}>
        <BreadCrumbs links={linksMap}></BreadCrumbs>
        <h1 className={styles['application__page-title']}>
          Текущий отклик
        </h1>

        {vacancies.length !=0 ? <div>
          

          <div className={styles['application__page-info']}>
            <h3 className={styles['application__page-info-title']}>Ваши вакансии:</h3>
            <VacancyTable vacancies={vacancies} className={styles['application__page-info-table']}/>

            <div className={styles['application__page-info-btns']}>
              <Button onClick={() => handleSendButtonClick()} className={styles['application__page-info-btn']}>Отправить</Button>
              <Button onClick={() => handleDeleteButtonClick()} className={styles['application__page-info-btn']}>Удалить</Button>
            </div>
          </div>
        </div>
        : <h5 className={styles['application__page-subtitle']}>
            В отклике нет вакансий
          </h5>
      }
      </div>
    </div>
  )
}

export default CurrentAnswPage