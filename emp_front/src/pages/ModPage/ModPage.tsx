import { useDispatch } from "react-redux";
import { setTitleValueAction, useTitleValue, useVac } from "../../slices/MainSlice";
import { useState } from "react";
import React from "react"; 
import Header from "../../components/Header";
import styles from "./ModPage.module.scss"
import CustomTable from "../../components/CustomTable/CustomTable";

export type ReceivedVacancyData = {
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
const columns = [
    {
        key: 'name',
        title: 'Название'
    },
    {
        key: 'price_min',
        title: 'Мин-ЗП'
    },
    {
      key: 'price_max',
      title: 'Макс-ЗП'
    },
    {
        key: 'adress',
        title: 'Адрес'
    },
    {
        key: 'total_desc',
        title: 'Описание'
    },
    {
        key: 'company',
        title: 'Компания'
    },
    {
        key: 'desc',
        title: ' Требования'
    },
    {
      key: 'pic',
      title: 'фото'
  },

]

const ModPage = () => {
    const dispatch = useDispatch()
    const vacancies = useVac()

    
    React.useEffect(() => {
    }, [])

    return (
        <div className={styles.admin__page}>
            <Header/>
    
            <div className={styles['admin__page-wrapper']}>
                <h1 className={styles['admin__page-title']}>Вакансии</h1>
    
                <div className={styles['admin__page-title']}>
                    <CustomTable className={styles['admin__page-table']} data={vacancies} columns={columns}
                    flag={2} ></CustomTable>
                    
                    
                </div>
                        
            </div>
        </div>
      )
    }
    
    export default ModPage