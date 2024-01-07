import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './AnswTab.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from '../ModalWindow/ModalWindow';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useCurrentAnswDate, useVacancyFromAnsw,
  setCurrentAnswDateAction, setVacancyFromAnswAction, setCurrentAnswIdAction } from "../../slices/AnswSlice"
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useIsMod } from '../../slices/AuthSlice';

interface AnswData {
  id: number;
  status: string;
  created_at: string;
  processed_at: string;
  completed_at: string;
  suite?:string | null;
}

interface VacancyData {
    id: number,
    name: string,
    price_min?: number,
    price_max?: number,
    company: string,
}

export type ReceivedVacancyData = {
  id: number,
  name: string,
  price_min?: number,
  price_max?: number,
  company: string,
}

export type VacancyTableProps = {
  answ: AnswData[];
  className?: string;
};

const AnswTab: React.FC<VacancyTableProps> = ({answ, className}) => {
  const dispatch = useDispatch();
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentVacancies, setCurrentVacancies] = useState<VacancyData[]>([])
  const IsMod = useIsMod();
  const getCurrentAnsw = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/answer/${id}`, {
        method: 'GET',
        withCredentials: true,
      })
      const newArr = response.data.response.map((raw: ReceivedVacancyData) => ({
        id: raw.id,
        name: raw.name,
        price_min: raw.price_min,
        price_max: raw.price_max,
        company: raw.company,
    }));
    setCurrentVacancies(newArr)
    console.log('newArr is', newArr)
    } catch(error) {
      throw error;
    }
  }
  const Putstatus = async (id: number | null, st: string) => {
    const data = {status: st };
    try {
      const response = axios(`http://localhost:8000/answer/${id}/confirm`, {
        method: 'PUT',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      })

      console.log(response)

      toast.success("Статус изменен");
    } catch(error) {
      throw error;
    }
  }

  const handleConfirmResponse = (id: number | null, status: string) => {
    Putstatus(id, status)
};
  const handleDetailedButtonClick = (id: number) => {
    getCurrentAnsw(id);
    setIsModalWindowOpened(true)
  };

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th style={{backgroundColor:'lightgray'}}>№</th>
            <th style={{backgroundColor:'lightgray'}}>Статус</th>
            <th style={{backgroundColor:'lightgray'}}>Дата создания</th>
            <th style={{backgroundColor:'lightgray'}}>Дата изменения</th>
            <th style={{backgroundColor:'lightgray'}}>Дата завершения</th>
           
            <th style={{backgroundColor:'lightgray'}}>Вероятность одобрения</th>
            <th style={{backgroundColor:'lightgray'}}></th>
            <th style={{backgroundColor:'lightgray'}}></th>
            {/*<th style={{backgroundColor:'lightgray'}}></th>*/}
          </tr>
        </thead>
        <tbody style={{alignItems:"center"}}>
          {answ.map((answ: AnswData, index: number) => (
            <tr key={answ.id}>
              <td style={{backgroundColor:'lightgray'}}>{answ.id}</td>
              <td style={{backgroundColor:'lightgray'}}>{answ.status}</td>
              <td style={{backgroundColor:'lightgray'}}>{new Date(answ.created_at).toLocaleString()}</td>
              <td style={{backgroundColor:'lightgray'}}>{answ.processed_at ? new Date(answ.processed_at).toLocaleString(): '-'}</td>
              <td style={{backgroundColor:'lightgray'}}>{answ.completed_at ? new Date(answ.completed_at).toLocaleString()  : '-'}</td>
           
              <td style={{backgroundColor:'lightgray'}}>{answ.suite}</td>
              <td style={{backgroundColor:'lightgray'}}>
                <Link to={`/answs/${answ.id}`} style={{backgroundColor:'lightgray'}}>
                <Button style={{alignItems:"center",}}>Подробнее</Button>
                </Link>
                {/* <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button> */}
              </td>
              {IsMod && answ.status == 'сформирован' && (<td style={{backgroundColor:'lightgray'}}>
    <Button onClick={() => handleConfirmResponse(answ.id, 'approved')}     style={{
                    backgroundColor: 'rgb(231, 230, 230)',
                    borderColor:"gray",
                    borderRadius:"8px",
                    height: "30px",
                    justifyContent: "center",
                    marginBottom:"3px"
                    
                }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="gray" className="bi bi-check-lg" viewBox="0 4 16 16" >
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
</svg>
    </Button>
    <div>
    <Button onClick={() => handleConfirmResponse(answ.id, 'denied')}  style={{
                    backgroundColor: 'rgb(231, 230, 230)',
                    borderColor:"gray",
                    borderRadius:"8px",
                    height: "30px",
                    justifyContent: "center"
                    
                }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" className="bi bi-check-lg" viewBox="-2 3 20 20">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
    </Button>
    </div>
</td>)
              }
              {IsMod && answ.status != 'сформирован' && (<th style={{backgroundColor:'lightgray'}}></th>)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>
  );
}

export default AnswTab