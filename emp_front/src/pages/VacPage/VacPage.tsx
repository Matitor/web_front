import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './VacPage.module.scss';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import {mockVacancies} from '../../../consts'
import Breadcrumps from '../../components/Breadcrumps';
export type Vacancy = {
  id:number;
  name:string;
  desc:string;
  price_min?:number;
  price_max?:number;
  company:string;
  pic:string;
  adress:string;
  total_desc:string;
  status:string;
};


const VacPage: React.FC = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;

    const[vacancy,setVacancy]=useState<Vacancy>();
    const fetchVacancy=async()=>{

      let url = `http://127.0.0.1:8000/vacancies/${id}`
      fetch(url) //!!!!!!!!!!!!!!!
      .then((response) => response.json())
      .then((data) => {
        const options = data.vacancy;
        setVacancy(data);
      })
      .catch(() => {
        createMock();
      });
      //createMock()
    }
    const createMock=()=>{
      const vacc = mockVacancies.find(item => item.id === Number(id));
            setVacancy(vacc)
      }
    useEffect(()=>{
      fetchVacancy();
    },[]);
 
    return (
      <div >
      <Header/>
      <Breadcrumps/>
      <Card className={styles.card}>
      <Image className={styles.card__image}  src={vacancy?.pic ? vacancy?.pic : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}/>
      <Card.Header className={styles.card__container_name}>{vacancy?.name}</Card.Header>
      <Card.Body>
        <Card.Title className={styles.card__container_price}>{vacancy?.price_min && vacancy?.price_max &&<div>{vacancy?.price_min} - {vacancy?.price_max} ₽</div>}</Card.Title>
        <Card.Title className={styles.card__container_price}>{!vacancy?.price_min && vacancy?.price_max &&<div>до {vacancy?.price_max} ₽</div>}</Card.Title>
        <Card.Title className={styles.card__container_price}>{vacancy?.price_min && !vacancy?.price_max &&<div>от {vacancy?.price_min} ₽</div>}</Card.Title>
        <Card.Text className={styles.card__container_desc}>
          {vacancy?.desc}
        </Card.Text>

        <Card.Text className={styles.card__container_company}>
        {vacancy?.company}
        </Card.Text>
        
      </Card.Body>
    </Card>
    </div>
    )
};
  
export default VacPage;