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

interface AnswData {
  id: number;
  status: string;
  created_at: string;
  processed_at: string;
  completed_at: string;
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
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата изменения</th>
            <th>Дата завершения</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {answ.map((answ: AnswData, index: number) => (
            <tr key={answ.id}>
              <td>{++index}</td>
              <td>{answ.status}</td>
              <td>{new Date(answ.created_at).toLocaleString()}</td>
              <td>{answ.processed_at ? new Date(answ.processed_at).toLocaleString(): '-'}</td>
              <td>{answ.completed_at ? new Date(answ.completed_at).toLocaleString()  : '-'}</td>
              <td className={styles.table__action}>
                <Link to={`/answs/${answ.id}`}>
                <Button>Подробнее</Button>
                </Link>
                {/* <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      {/*<ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
      <h3 className={styles.modal__title}>Добавленные вакансии</h3>
      <div className={styles.modal__list}>
        {currentVacancies.map((vacancy: VacancyData, index: number) => (
          <div className={styles['modal__list-item']}>
            <div className={styles['modal__list-item-title']}>
              {vacancy.name} "{vacancy.name}"
            </div>
            <b>{vacancy.company}</b>
          </div>
        ))}
      </div>
      </ModalWindow>*/}
    </>
  );
}

export default AnswTab