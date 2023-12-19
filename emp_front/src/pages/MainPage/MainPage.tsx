import React, { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from '../../components/Header';
import Card from '../../components/Card';
import styles from './MainPage.module.scss';
import {mockVacancies} from '../../../consts'
import BreadCrumbs from '../../components/BreadCrumbs';
import {useDispatch} from "react-redux";
import {useVac,  useTitleValue, setTitleValueAction, setVacAction} from "../../slices/MainSlice";
import axios from 'axios';
import { useIsAuth} from "../../slices/AuthSlice";
import { useLinksMapData, setLinksMapDataAction } from "../../slices/DetaildSlice";
import {setCurrentAnswIdAction, useCurrentAnswId} from "../../slices/AnswSlice";
import { useVacancyFromAnsw, setVacancyFromAnswAction } from '../../slices/AnswSlice';


export type Vacancy = {
    id:number;
    name:string;
    desc:string;
    price_min?:number;
    price_max?:number;
    company:string;
    pic:string;
    status:string;
    total_desk?:string;
    adress?:string;
  };
  export type ReceivedVacData = {
    id:number;
    name:string;
    desc:string;
    price_min?:number;
    price_max?:number;
    company:string;
    pic:string;
    status:string;
    total_desk?:string;
    adress?:string;
  }
  export type ReceivedUserData = {
    id: number,
    email: string,
    password: string,
    is_superuser: boolean,
}

const MainPage: React.FC = () => {
  const dispatch = useDispatch()
    const titleValue = useTitleValue();
    const vacancies = useVac();
    const VacancyFromAnsw = useVacancyFromAnsw();
    const isUserAuth = useIsAuth();
    const linksMap = useLinksMapData();
    React.useEffect(() => {
      dispatch(setLinksMapDataAction(new Map<string, string>([
          ['Вакансии', '/vacancies']
      ])))
  }, [])
    
  const getCurrentAnsw = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/answer/${id}`, {
        method: 'GET',
        withCredentials: true,
      })
      
      const newArr = response.data.vacancies.map((raw: ReceivedVacData) => ({
        id: raw.id,
            name: raw.name,
            desc: raw.desc,
            price_min: raw.price_min,
            price_max: raw.price_max,
            company: raw.company,
            pic: raw.pic,
            status:raw.status
    }));
   
    dispatch(setVacancyFromAnswAction(newArr))
} catch(error) {
  throw error;
}
}
const getVacancies = async () => {
    let url = 'http://localhost:8000/vacancies'
    if (titleValue) {
        url += `?keyword=${titleValue}`
    }
    console.log("here")
    try {
        const response = await axios(url, {
            method: 'GET',
            withCredentials: true 
        });
        console.log("here")
        if (response.data.answer) {
            getCurrentAnsw(response.data.answer);
            dispatch(setCurrentAnswIdAction(response.data.answer))
            
        }
        const jsonData = response.data.vacancy;
        const newArr = jsonData.map((raw: ReceivedVacData) => ({
          id: raw.id,
          name: raw.name,
          desc: raw.desc,
          price_min: raw.price_min,
          price_max: raw.price_max,
          company: raw.company,
          pic: raw.pic,
          status:raw.status
        }));
        dispatch(setVacAction(newArr));
    }
    catch {
        console.log('запрос не прошел !')
        if (titleValue) {
            const filteredArray = mockVacancies.filter(mockVacancies => mockVacancies.name.includes(titleValue));
            dispatch(setVacAction(filteredArray));
        }
        else {
            dispatch(setVacAction(mockVacancies));
        }
    }
};
const postVacancyToAnsw = async (id: number) => {
  try {
      const response = await axios(`http://localhost:8000/vacancies/${id}/post`, {
          method: 'POST',
          withCredentials: true,
      })
      const addedVacancy= {
          id:response.data.id,
          name:response.data.name,
          desc:response.data.desc,
          price_min:response.data.price_min,
          price_max:response.data.price_max,
          company:response.data.company,
          pic:response.data.pic,
          status:response.data.status,
          total_desk:response.data.total_desk,
          adress:response.data.adress
      }
      console.log('123')
      console.log(response)
      dispatch(setVacancyFromAnswAction([...VacancyFromAnsw, addedVacancy]))
      toast.success("Вакансия успешно добавлена в отклик!");
  } catch (error) {
      if (error instanceof Error) {
          // Если error является экземпляром класса Error
          toast.error("Вакансия уже добавлена в отклик");
      } else {
          // Если error не является экземпляром класса Error (что-то другое)
          toast.error('Ошибка при добавлении');
      }
  }
  getVacancies();
}

const handleSearchButtonClick = () => {
    getVacancies();
};

const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitleValueAction(event.target.value));
};


    return (
      <div className={styles.page}>
      <Header/>
      <div>
      <BreadCrumbs links={linksMap}></BreadCrumbs>
      </div>
              <Form>
                  <Form.Control className={styles.page__input} value={titleValue} onChange={handleTitleValueChange} type="text" placeholder="Профессия..."/>
                  <Button className={styles.page__button} type="submit"onClick={() => handleSearchButtonClick()}>Поиск</Button>
              </Form>
              <div className={styles.page__content}>
                  {
                  vacancies.map((vac: Vacancy) => (
                      <Card id={vac.id} desc={vac.desc} name={vac.name} company={vac.company} price_min={vac.price_min} price_max={vac.price_max} pic={vac.pic} isUserAuth={isUserAuth} onButtonClick={() => postVacancyToAnsw(vac.id)}></Card>
                  ))}
              </div>
          {vacancies.length === 0 && <p > <big>таких вакансий нет</big></p>}
      </div>
 
)
};
  
export default MainPage;