import React, { useState } from 'react'
import axios from 'axios'
import styles from './AnswListPage.module.scss'
import Header from '../../components/Header'
import ModalWindow from '../../components/ModalWindow/ModalWindow'
import AnswTab from '../../components/AnswTab/AnswTab'
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs'
import { useDispatch } from 'react-redux'
import { setAnswAction, useAnsw } from "../../slices/AnswSlice"
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";
import { Next } from 'react-bootstrap/esm/PageItem'

export type ReceivedRespData = {
    id: number;
    status: string;
    created_at: string;
    processed_at: string;
    completed_at: string;
  }

const AnswListPage = () => {
    const dispatch = useDispatch();
    const answ = useAnsw();
    const linksMap = useLinksMapData();
    const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);

    const getAllAnsw = async () => {
        try {
          const response = await axios('http://localhost:8000/answer/', {
            method: 'GET',
            withCredentials: true
          })
          console.log(response.data)
          const newArr = response.data
          .filter((raw: ReceivedRespData) => raw.status != 'delited')
          .map((raw: ReceivedRespData) => ({
            id: raw.id,
            status: getStatusTranslation(raw.status),
            created_at: raw.created_at,
            processed_at: raw.processed_at,
            completed_at: raw.completed_at,
        }));
        dispatch(setAnswAction(newArr))
        } catch(error) {
          throw error
        }
    }
    const getStatusTranslation = (status: string): string => {
        switch (status) {
            case 'confirmed':
                return 'Сформировано';
            case 'denied':
                return 'Отклонено';
            case 'canceled':
                return 'Удалено';
            case 'registered':
                return 'Зарегистрировано';
            case 'approved':
                return 'Подтверждено';
            // Добавьте другие статусы по мере необходимости
            default:
                return status;
        }
    };

    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Отклики', '/answs']
        ])))
        getAllAnsw()
    }, [])
    
    return (
        <div className={styles.applications__page}>
            <Header/>
            <div className={styles['applications__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h1 className={styles['applications__page-title']}>История ваших откликов</h1>
                <h5 className={styles['applications__page-subtitle']}>
                Вы можете посмотреть информацию о каждом отклике, а также добавленные в него вакансии
                </h5>
                <AnswTab answ={answ}/>
                <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
                    <h3 className={styles.modal__title}>Регистрация прошла успешно!</h3>
                </ModalWindow>
            </div>
        </div>
    )
}

export default AnswListPage