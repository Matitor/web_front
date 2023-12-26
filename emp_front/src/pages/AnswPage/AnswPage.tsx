import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './AnswPage.module.scss'
import Header from '../../components/Header';
import VacancyTable from '../../components/VacTab/VacTab';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";
import {useCurrentAnswDate, useVacancyFromAnsw,setCurrentAnswDateAction, setVacancyFromAnswAction } from  "../../slices/AnswSlice";
import {setCurrentAnswIdAction, useCurrentAnswId} from "../../slices/AnswSlice";
import Button from 'react-bootstrap/Button';

export type ReceivedVacancyData = {
  id: number,
    name: string,
    price_min?: number,
    price_max?: number,
    company: string,
}


const AnswPage = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const currentAnswId = useCurrentAnswId()
    const dispatch = useDispatch();
    const linksMap = useLinksMapData();
    const [currentStatus, setCurrentStatus] = React.useState("начало")

    const getCurrentAnsw = async () => {
        try {
          const answ = await axios(`http://localhost:8000/answer/${id}`, {
            method: 'GET',
            withCredentials: true,
          })
          setCurrentStatus(answ.data.answ.status)
          const newArr = answ.data.vacancies.map((raw: ReceivedVacancyData) => ({
            id: raw.id,
        name: raw.name,
        price_min: raw.price_min,
        price_max: raw.price_max,
        company: raw.company,
            }));
            console.log(answ)
        console.log(newArr)
        dispatch(setVacancyFromAnswAction(newArr))
        } catch(error) {
          throw error;
        }
      }
      const hr = async () => {
        console.log("мы получили",id)
        
        try {
          axios(`http://localhost:8000/async_task/${id}`, {
                method: 'GET',
                withCredentials: true,
          });
          console.log("отправили запрос")
          dispatch(setCurrentAnswIdAction(undefined));
        } catch(error) {
          console.log("ЧТо-то пошло не так")
        }
      }
      const sendResp = async () => {
        try {
          await axios(`http://localhost:8000/answer/accept`, {
            method: 'PUT',
            withCredentials: true
          })
    
          dispatch(setVacancyFromAnswAction([]));
          dispatch(setCurrentAnswDateAction(''));
          // dispatch(setCurrentRespIdAction(undefined));
          localStorage.setItem('vacancyFromAnsw', JSON.stringify([]));
          // dispatch(setCurrentRespIdAction(null));
          setCurrentStatus("made")
          toast.success("Отправлено на проверку модератору");
        } catch(error) {
          throw error;
        }
      }
      const deleteResp = async () => {
        try {
          await axios(`http://localhost:8000/answer/delete`, {
          method: 'DELETE',
          withCredentials: true
        })
    
        dispatch(setVacancyFromAnswAction([]));
        dispatch(setCurrentAnswDateAction(''));
        dispatch(setCurrentAnswIdAction(undefined));
        localStorage.setItem('vacancyFromAnsw', JSON.stringify([]));
        toast.success("Отклик удален");
        setCurrentStatus("deleted")
        }
        catch(error) {
          throw error;
        }
        
      }
      const handleSendButtonClick = () => {
        sendResp();
        hr();
        getCurrentAnsw();
      }
    
      const handleDeleteButtonClick = () => {
        deleteResp();
      }
      React.useEffect(() => {
        const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
        newLinksMap.set("Детали отклика", '/resp/' + id);
        dispatch(setLinksMapDataAction(newLinksMap))
        getCurrentAnsw();
        console.log("Статус в стаут", currentStatus)
    }, [id])

    const currentVac = useVacancyFromAnsw()

    return (
      <div className={styles.application__page}>
      <Header/>
      <div className={styles['application__page-wrapper']}>
          <BreadCrumbs links={linksMap}></BreadCrumbs>
          <h1 className={styles['application__page-title']}>
              Добавленные вакансии
          </h1>
          {currentStatus != 'deleted' ? <div>
          <div style={{justifyContent: "center"}}>
          <VacancyTable
            flag={currentStatus !== "registered"}
            vacancies={currentVac}
            className={styles["application__page-info-table"]}
          />
          </div>
          <div className={styles['application__page-info-btns']}>
          <Button onClick={() => handleSendButtonClick()} className={styles['application__page-info-btn']} style={{ display: currentStatus === 'registered' ? 'block' : 'none' }}>Отправить</Button>
        <Button onClick={() => handleDeleteButtonClick()} className={styles['application__page-info-btn']} style={{ display: currentStatus === 'registered' ? 'block' : 'none' }}>Удалить</Button>
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

export default AnswPage