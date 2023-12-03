import React, { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
// import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Header from '../../components/Header';
import Card from '../../components/Card';
import styles from './MainPage.module.scss';
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

const MainPage: React.FC = () => {
    const[vacancy,setVacancy]=useState<Vacancy[]>([]);
    const[searchValue,setSearchValue]=useState("");
    const fetchVacancy=async()=>{

      let url = 'http://127.0.0.1:8000/vacancies'
      if(searchValue){
        url+=`?name=${searchValue}`
      }
      fetch(url) //!!!!!!!!!!!!!!!
      .then((response) => response.json())
      .then((data) => {
        const options = data.vacancy;
        setVacancy(options);
      })
      .catch(() => {
        createMock();
      });
      //createMock()
    }
    const handleSearchButtonClick =()=>{
      fetchVacancy();
    }
    const createMock=()=>{
      let filtered:Vacancy[]=mockVacancies.filter(
        (option)=>option.status=="enabled"
      )
      if(searchValue){
        filtered=filtered.filter((option)=>
          option.name.includes(searchValue)
        );
      }
    setVacancy(filtered)
    }
    const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };
    useEffect(()=>{
      fetchVacancy();
    },[]);
    return (
      <div className={styles.page}>
      <Header/>
      <div>
      <Breadcrumps />
      </div>
              <Form>
                  <Form.Control className={styles.page__input} value={searchValue} onChange={handleTitleValueChange} type="text" placeholder="Профессия..."/>
                  <Button className={styles.page__button} type="submit"onClick={() => handleSearchButtonClick()}>Поиск</Button>
              </Form>
              <div className={styles.page__content}>
                  {
                  vacancy.map((vac: Vacancy) => (
                      <Card id={vac.id} desc={vac.desc} name={vac.name} company={vac.company} price_min={vac.price_min} price_max={vac.price_max} pic={vac.pic} onButtonClick={() => console.log('!')}></Card>
                  ))}
              </div>
          {vacancy.length === 0 && <p > <big>таких вакансий нет</big></p>}
      </div>
 
)
};
  
export default MainPage;