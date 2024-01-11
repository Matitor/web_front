import React, { ChangeEvent, useState } from 'react'
import axios from 'axios'
import styles from './AnswListPage.module.scss'
import Header from '../../components/Header'
import ModalWindow from '../../components/ModalWindow/ModalWindow'
import AnswTab from '../../components/AnswTab/AnswTab'
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs'
import { useDispatch } from 'react-redux'
import { setCurrentUserFilterAction,useCurrentUserFilter,setEndilterAction, setAnswAction, setStartFilterAction, setStatusFilterAction, useEndFilter, useAnsw, useStartFilter, useStatusFilter } from "../../slices/AnswSlice"
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";
import { Next } from 'react-bootstrap/esm/PageItem'
import { useIsMod } from '../../slices/AuthSlice'
import Form from 'react-bootstrap/Form';
import { Button, Dropdown} from 'react-bootstrap'

export type ReceivedRespData = {
    id: number;
    name:string;
    status: string;
    created_at: string;
    processed_at: string;
    completed_at: string;
    suite?: string | null;
  }
const statuses = ["Не выбрано",'сформирован', "отказ", "одобрено"]
const AnswListPage = () => {
    const dispatch = useDispatch();
    const answ = useAnsw();
    const IsMod = useIsMod();
    const linksMap = useLinksMapData();
    const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
    const userFilter = useCurrentUserFilter();
    const startTime = useStartFilter();
    const endTime = useEndFilter();
    const statusValue = useStatusFilter();

    const getAllAnsw = async () => {
      let res = ''
      console.log("strt end stat", startTime, endTime, statusValue,userFilter)
      if (startTime && endTime) {
      res += `?start=${startTime}&end=${endTime}`
      } else if(startTime) {
      res += `?start=${startTime}`
      } else if(endTime) {
      res += `?end=${endTime}`
      }
      let trstatus = ''
      if (statusValue) {
          trstatus = getStatusFromTranslation(statusValue)
      }
      
      if (res.length === 0 && statusValue !== 'Не выбрано') {
      res += `?status=${trstatus}`
      } else if (res.length !== 0 && statusValue !== 'Не выбрано'){
      res += `&status=${trstatus}`
      }
      try {
        const response = await axios(`http://localhost:8000/answer/${res}`, {
          method: 'GET',
          withCredentials: true
        });
        console.log(response.data);
        const rawData = response.data;
        let filteredData; // Объявление переменной filteredData перед блоком if-else
        
        if (userFilter) {
          filteredData = rawData
          .filter((raw: ReceivedRespData) => raw.status !== 'delited')
          .filter((raw: ReceivedRespData) => raw.status !== 'registered')
          .filter((raw: ReceivedRespData) => raw.user.email.toLowerCase().includes(userFilter.toLowerCase()))
          .map((raw: ReceivedRespData) => ({
            id: raw.id,
              status: getStatusTranslation(raw.status),
              created_at: raw.created_at,
              processed_at: raw.processed_at,
              completed_at: raw.completed_at,
              suite: raw.suite,
              name:raw.user.email
          }));
        }
        else{
          filteredData = rawData
            .filter((raw: ReceivedRespData) => raw.status !== 'delited')
            .map((raw: ReceivedRespData) => ({
              id: raw.id,
              status: getStatusTranslation(raw.status),
              created_at: raw.created_at,
              processed_at: raw.processed_at,
              completed_at: raw.completed_at,
              suite: raw.suite,
              name:raw.user.email
            }));
          }
    
        dispatch(setAnswAction(filteredData));
      } catch(error) {
        throw error;
      }
  }

  const getStatusTranslation = (status: string): string => {
      switch (status) {
          case 'confirmed':
              return 'сформирован';
          case 'denied':
              return 'отказ';
          case 'canceled':
              return 'отменен';
          case 'registered':
              return 'зарегистрирован';
          case 'approved':
              return 'одобрено';
          // Добавьте другие статусы по мере необходимости
          default:
              return status;
      }
  };

  const getStatusFromTranslation = (translation: string): string => {
      switch (translation) {
        case 'сформирован':
          return 'confirmed';
        case 'отказ':
          return 'denied';
        case 'отменен':
          return 'canceled';
        case 'зарегистрирован':
          return 'registered';
        case 'одобрено':
          return 'approved';
        // Добавьте другие переводы статусов по мере необходимости
        default:
          return translation;
      }
    };
    const handleSearchButtonClick = () => {
      getAllAnsw();
  };
  const handleUserValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentUserFilterAction(event.target.value));
    //userFilter=event.target.value;
  };
  const handleCategorySelect = (eventKey: string | null) => {
      if (eventKey !== null) {
        const selectedStatus = statuses.find(status => status === eventKey)
        if (selectedStatus && selectedStatus !== statusValue && selectedStatus) {
          dispatch(setStatusFilterAction(selectedStatus))
        }
      }
  };
    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Отклики', '/answs']
        ])))
        getAllAnsw()
        const pollingInterval = setInterval(() => {
          getAllAnsw();
        }, 5000);
        return () => {
          clearInterval(pollingInterval);
        };
    }, [startTime, endTime, statusValue,userFilter])
    
    
    return (
      
        <div className={styles.applications__page}>
            <Header flag={false}/>
            <div className={styles['applications__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h2 className={styles['applications__page-title']}>История откликов</h2>
                {IsMod &&(<Form.Group controlId="name" style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyItems: "center", 
                gap: "20px"
            }}>
                 <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatch(setStartFilterAction(event.target.value))}} value={startTime} className={styles.form__input} type="text" placeholder="Начальная дата (Год-Месяц-День)" />
              </div>
              <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatch(setEndilterAction(event.target.value))}} value={endTime} className={styles.form__input} type="text" placeholder="Конечная дата (Год-Месяц-День)" />
              </div>
              <Dropdown  className={styles['dropdown']} onSelect={handleCategorySelect}>
                <Dropdown.Toggle
                    className={styles['dropdown__toggle']}
                    variant="success"

                >   
                    {statusValue}
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles['dropdown__menu']}>
                    {statuses
                    .map(status => (
                        <Dropdown.Item className={styles['dropdown__menu-item']} key={status} eventKey={status}>
                        {status}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
                
                
                <Form.Control
                type="text"
                placeholder="Введите имя пользователя"
                style={{
                    backgroundColor: 'white',
                    height: '40px',
                    width: '600px',
                    marginBottom: '40px',
                    //marginLeft: "100px"
                }}
                
                onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatch(setCurrentUserFilterAction(event.target.value))}}
                value={userFilter} 
                />
            </Form.Group>)}
                <AnswTab answ={answ}/>
                
            </div>
        </div>
    )
}

export default AnswListPage