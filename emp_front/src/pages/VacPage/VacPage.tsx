import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from './VacPage.module.scss';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import {mockVacancies} from '../../../consts'
import BreadCrumbs from '../../components/Breadcrumps';
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
    const [linksMap, setLinksMap] = useState<Map<string, string>>(
      new Map<string, string>([['Вакансии', '/']])
  );
    const[vacancy,setVacancy]=useState<Vacancy>();
    const fetchVacancy=async()=>{

      let url = `http://127.0.0.1:8000/vacancies/${id}`
      fetch(url) //!!!!!!!!!!!!!!!
      .then((response) => response.json())
      .then((data) => {
        setVacancy(data);
        const newLinksMap = new Map<string, string>(linksMap);
      newLinksMap.set(data.name, '/vacancy/' + id);
            setLinksMap(newLinksMap)
      })
      .catch(() => {
        createMock();
        
      });
      //createMock()
      
    }
    const createMock=()=>{
      const vacc = mockVacancies.find(item => item.id === Number(id));
            setVacancy(vacc)
            const newLinksMap = new Map<string, string>(linksMap);
            newLinksMap.set('подробнее', '/vacancy/' + id);
            setLinksMap(newLinksMap)
      }
    useEffect(()=>{
      fetchVacancy();
    },[]);
 
    return (
      <div >
      <Header/>
      <BreadCrumbs links={linksMap}></BreadCrumbs>
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