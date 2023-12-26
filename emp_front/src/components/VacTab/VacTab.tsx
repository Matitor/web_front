import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './VacTab.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useCurrentAnswDate, useVacancyFromAnsw,
  setCurrentAnswDateAction, setVacancyFromAnswAction, setCurrentAnswIdAction } from "../../slices/AnswSlice";
import { ButtonGroup } from 'react-bootstrap';


interface VacancyData {
  id: number,
  name: string,
  price_min?: number,
  price_max?: number,
  company: string,
}

export type VacTableProps = {
  vacancies: VacancyData[];
  className?: string;
  flag?: boolean;
};

const VacancyTable: React.FC<VacTableProps> = ({vacancies, className, flag}) => {
  const dispatch = useDispatch();
  const vacan = useVacancyFromAnsw()

  const deleteVacancyFromResp = async (id: number) => {
    try {
      const response = axios(`http://localhost:8000/vac_answ/${id}`, {
        method: 'DELETE',
        withCredentials: true
      })

      console.log(id, vacan)

      dispatch(setVacancyFromAnswAction(vacan.filter(vacancy => vacancy.id !== id)))

      toast.success("Вакансия удалена");
    } catch(error) {
      throw error;
    }
  }

  const handleDeleteButtonClick = (id: number) => {
    deleteVacancyFromResp(id)
  }

  return (
    <div className={styles.table__container}>
      <Table responsive borderless className={styles.table__container} >
        <thead>
          <tr className={styles.table__container}>
            <th>№</th>
            <th>Название</th>
            <th>Компания</th>
            <th>Зарплата</th>
            {!flag && <th></th>}
          </tr>
        </thead>
        <tbody className={styles.table__container}>
          {vacancies.map((vacancy: VacancyData, index: number) => (
            <tr key={vacancy.id}>
              <td>{++index}</td>
              <td>{vacancy.name}</td>
              <td>{vacancy.company}</td>
              {vacancy.price_min && vacancy.price_max &&<td>{vacancy.price_min} - {vacancy.price_max} ₽</td>}
              {!vacancy.price_min && vacancy.price_max &&<td>до {vacancy.price_max} ₽</td>}
              {vacancy.price_min && !vacancy.price_max &&<td>от {vacancy.price_min} ₽</td>}
              {!flag && <td className={styles.table__action}><Button  onClick={() => handleDeleteButtonClick(vacancy.id)}>🗑️</Button></td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default VacancyTable