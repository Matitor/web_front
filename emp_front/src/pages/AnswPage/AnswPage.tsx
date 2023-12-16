import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './AnswPage.module.scss'
import Header from '../../components/Header';
import VacancyTable from '../../components/VacTab/VacTab';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";

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
    const [currentVac, setCurrentVac] = React.useState([])
    const dispatch = useDispatch();
    const linksMap = useLinksMapData();

    const getCurrentResp = async () => {
        try {
          const response = await axios(`http://localhost:8000/answer/${id}`, {
            method: 'GET',
            withCredentials: true,
          })

          const newArr = response.data.vacancies.map((raw: ReceivedVacancyData) => ({
            id: raw.id,
        name: raw.name,
        price_min: raw.price_min,
        price_max: raw.price_max,
        company: raw.company,
            }));
            console.log(response)
        console.log(newArr)
        setCurrentVac(newArr)
        } catch(error) {
          throw error;
        }
      }

    React.useEffect(() => {
        const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
        newLinksMap.set("Детали отклика", '/answs/' + id);
        dispatch(setLinksMapDataAction(newLinksMap))
        getCurrentResp();

    }, [])

    return (
        <div className={styles.application__page}>
            <Header/>
            <div className={styles['application__page-wrapper']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>
                <h1 className={styles['application__page-title']}>
                    Добавленные вакансии
                </h1>
                <VacancyTable flag={true} vacancies={currentVac} className={styles['application__page-table']}/>
            </div>
        </div>
    )
}

export default AnswPage