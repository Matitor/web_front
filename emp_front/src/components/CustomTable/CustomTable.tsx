import React, { useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
// import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { setTitleValueAction, setVacAction, useTitleValue, useVac } from '../../slices/MainSlice';
import { useDispatch } from 'react-redux';
import ModalWindow from '../ModalWindow/ModalWindow';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image'
//import { title } from 'process';

export type ReceivedVacancyData = {
  id:number;
  name:string;
  desc:string;
  price_min?:number;
  price_max?:number;
  company:string;
  pic:string;
  status:string;
  total_desc?:string;
  adress?:string;
  png?:File;
}

type ColumnData = {
    key: string;
    title: string;
  }

export type TableData = {
    columns: ColumnData[];
    data: any[];
    children?: React.ReactNode;
    flag: 0 | 1 | 2 | 3;
    className?: string;
  };

export type VacancyData = {
  id:number;
  name:string;
  desc:string;
  price_min?:number;
  price_max?:number;
  company:string;
  pic:string ;
  status:string;
  total_desc?:string;
  adress?:string;
  png?:File;
}

const CustomTable: React.FC<TableData> = ({columns, data, className}) => {
    const vacancies = useVac()
    const dispatch = useDispatch()
    const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false)
    const [currentVacanciesId, setCurrentVacanciesId] = useState<number>()
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState('')
    const [createRow, setCreateRow] = useState(false);
    const [editableRows, setEditableRows] = useState<number | null>(null);
    const [dictionary, setDictionary] = useState<VacancyData>({
      id: 0,
      name: "",
      desc: "",
      price_min: 0,
      price_max: 0,
      company: "",
      total_desc: "",
      pic: "",
      status: "",
      adress: "",
      png: undefined,
    });
    const [expandedRows, setExpandedRows] = useState<number[]>([]);


    
    console.log(dictionary)
    const toggleExpansion = (rowId: number) => {
      if (expandedRows.includes(rowId)) {
        setExpandedRows(expandedRows.filter((id) => id !== rowId));
      } else {
        setExpandedRows([...expandedRows, rowId]);
      }
    };
   
    
    const deleteVacancy = async () => {
      try {
        await axios(`http://localhost:8000/vacancies/${currentVacanciesId}`, {
          method: 'DELETE',
          withCredentials: true,
  
        })
  
        dispatch(setVacAction(vacancies.filter((vacancy) => {
          return vacancy.id !== currentVacanciesId 
        })))
        toast.success('Вакансия удалена')
      } catch(e) {
        throw e
      }
    }
  
    //const handleUpload = async () => {
    //  if (selectedImage) {
    //    try {
    //      const formData = new FormData();
    //      formData.append('file', selectedImage);
  
    //      const response = await axios.post(
    //        `http://localhost:8001/vacancies/${currentVacanciesId}/image`,
    //        formData,
    //        {
    //          headers: {
    //            'Content-Type': 'multipart/form-data',
    //          },
    //          withCredentials: true,
    //        }
    //      );
    //      const updatedVacancies = vacancies.map(vacancy => {
    //        if (vacancy.id === currentVacanciesId) {
    //          return {
    //            ...vacancy,
    //            image: response.data.image
    //          };
    //        }
    //        return vacancy;
    //      });
    //      dispatch(setVacAction(updatedVacancies))
    //      console.log(updatedVacancies)
    //      setSelectedImage(null)
    //      toast.success('Изображение успешно загружено')
  
    //    } catch (error) {
    //      console.error('Error uploading image:', error);
    //    } finally {
    //      setIsImageModalWindowOpened(false)
    //    }
    //  }
    //};
  
    // const handleSubscriptionFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault()
    //   if (isAddModalWindowOpened) {
    //     postSubscription()
    //   } else if(currentSubscriptionId) {
    //     putSubscription(currentSubscriptionId)
    //   }
    // }
  

  
    const handleDeleteButtonClick = (id: number) => {
      setCurrentVacanciesId(id)
      deleteVacancy();
    }
  
    //const handleImageButtonClick = (vacancy: VacancyData) => {
    //  setCurrentVacanciesId(vacancy.id || 0)
    //  setIsImageModalWindowOpened(true)
    //  setCurrentImage(vacancy.pic || '');
    //}

    const handleEditButtonClick = (selectedVacancy: VacancyData, row: number) => {
      console.log(row)
      setEditableRows(row);
      console.log("выбранная вакансия", selectedVacancy)
      const updatedDictionary = {
        name: selectedVacancy.name,
        desc: selectedVacancy.desc,
        price_min: selectedVacancy.price_min,
        price_max: selectedVacancy.price_max,
        company: selectedVacancy.company,
        pic: selectedVacancy.pic,
        adress: selectedVacancy.adress,
        id: selectedVacancy.id,
        status: selectedVacancy.status,
        total_desc: selectedVacancy.total_desc,
        png: selectedVacancy.png,
      };
  
      setDictionary(updatedDictionary);
    };
  
 
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    };

    const handleCreateButtonClick = () => {
      const newVacancy: VacancyData = {
        id: 0,
      name: "",
      desc: "",
      price_min: 0,
      price_max: 0,
      company: "",
      total_desc: "",
      pic: "",
      status: "",
      adress: "",
      };
      setDictionary(newVacancy)
      setCreateRow(true)
      
    };

    const postVacancy = async () => {
      console.log("нажали")
      if (dictionary.name.length == 0) {
        return toast.error("Введите название вакансии")
      }
      if (dictionary.price_min == 0) {
        return toast.error("Введите зарплату")
      }
      if (dictionary.price_max == 0) {
        return toast.error("Введите зарплату")
      }
      if (dictionary.company.length == 0) {
        return toast.error("Введите название компании")
      }
      if (dictionary.desc.length == 0) {
        return toast.error("Введите требования для работы")
      }
      if (!dictionary.total_desc) {
        return toast.error("Введите доп информацию о работе")
      }
      if (!dictionary.adress) {
        return toast.error("Введите город работы")
      }
      if (!dictionary.png) {
        return toast.error("Укажите изображение работы")
      }
      try {
        const formData = new FormData();
        formData.append('png', dictionary.png);
        formData.append('name', dictionary.name);
        formData.append('price_min', String(dictionary.price_min));
        formData.append('price_max', String(dictionary.price_max));
        formData.append('desc', dictionary.desc);
        formData.append('adress', dictionary.adress);
        formData.append('company', dictionary.company);
        formData.append('total_desc', dictionary.total_desc);
        //axios.post(`http://localhost:8000/vacancies/`, formData, {
        //  headers: {
        //    'Content-Type': 'multipart/form-data'
        //  }
        // }).then(response => {
        //  const reps=response
        //  console.log('Success:', response.data);
        // })

        //const response = await axios(`http://localhost:8000/vacancies/`, {
        //  method: 'POST',
        //  data: {
        //    name: dictionary.name,
        //    price_min: dictionary.price_min,
        //    price_max: dictionary.price_max,
        //    desc: dictionary.desc,
        //    adress: dictionary.adress,
        //    company: dictionary.company,
        //    total_desc: dictionary.total_desc
        //  },
        
        //  withCredentials: true
        //})
        const response = await axios({
          method: 'POST',
          url: 'http://localhost:8000/vacancies/',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
         });

        console.log(response)

        const jsonData = response.data;
        const newArr = jsonData.map((raw: ReceivedVacancyData) => ({
          name: raw.name,
          desc: raw.desc,
          price_min: raw.price_min,
          price_max: raw.price_max,
          company: raw.company,
          pic: raw.pic,
          adress: raw.adress,
          id: raw.id,
          status: raw.status,
          total_desc: raw.total_desc
      
        }));
        dispatch(setVacAction(newArr));
 
        setCreateRow(false)
        setDictionary({       
          id: 0,
          name: "",
          desc: "",
          price_min: 0,
          price_max: 0,
          company: "",
          total_desc: "",
          pic: "",
          status: "",
          adress: "",
          png:undefined
        });
        toast.success('Вакансия добавлена')
      } catch(e) {
        toast.error('Ошибка')
        throw e
      }
  }

  const putVacancy = async () => {
    try {
      const formData = new FormData();
      if (dictionary.png){
        formData.append('png', dictionary.png);}
        if (dictionary.name){
        formData.append('name', dictionary.name);}
        if (dictionary.price_min){
        formData.append('price_min', String(dictionary.price_min));}
        if (dictionary.price_max){
        formData.append('price_max', String(dictionary.price_max));}
        if (dictionary.desc){
        formData.append('desc', dictionary.desc);}
        if (dictionary.adress){
        formData.append('adress', dictionary.adress);}
        if (dictionary.company){
        formData.append('company', dictionary.company);}
        if (dictionary.total_desc){
        formData.append('total_desc', dictionary.total_desc);}
      //const response = await axios(`http://localhost:8000/vacancies/${dictionary?.id}`, {
      //  method: 'PUT',
      //  data: {
      //    name: dictionary.name,
      //    desc: dictionary.desc,
      //    price_min: dictionary.price_min,
      //    price_max: dictionary.price_max,
      //    company: dictionary.company,
      //    pic: dictionary.pic,
      //    adress: dictionary.adress,
          
      //    total_desc: dictionary.total_desc
          
      //  },
      //  withCredentials: true
      //})
      const response = await axios({
        method: 'PUT',
        url: `http://localhost:8000/vacancies/${dictionary?.id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
       });
       const jsonData = response.data;
       const newArr = jsonData.map((raw: ReceivedVacancyData) => ({
         name: raw.name,
         desc: raw.desc,
         price_min: raw.price_min,
         price_max: raw.price_max,
         company: raw.company,
         pic: raw.pic,
         adress: raw.adress,
         id: raw.id,
         status: raw.status,
         total_desc: raw.total_desc
     
       }));
       dispatch(setVacAction(newArr));
       setEditableRows(null);
      
       setDictionary({       
         id: 0,
         name: "",
         desc: "",
         price_min: 0,
         price_max: 0,
         company: "",
         total_desc: "",
         pic: "",
         status: "",
         adress: "",
         png:undefined
       });

      //const updatedVacancies = vacancies.map(vacancy => {
      //  if (vacancy.id === dictionary?.id) {
      //    return {
      //      ...vacancy,
      //      name: dictionary.name,
      //    desc: dictionary.desc,
      //    price_min: dictionary.price_min,
      //    price_max: dictionary.price_max,
      //    company: dictionary.company,
      //    pic: dictionary.pic,
      //    adress: dictionary.adress,
          
      //    total_desc: dictionary.total_desc
      //    };
      //  }
      //  return vacancy;
      //});
      //dispatch(setVacAction(updatedVacancies))
      //setEditableRows(null);
      //setDictionary({       
      //  id: 0,
      //    name: "",
      //    desc: "",
      //    price_min: 0,
      //    price_max: 0,
      //    company: "",
      //    total_desc: "",
      //    pic: "",
      //    status: "",
      //    adress: "",
      //});
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      toast.error('Такая вакансия уже существует!')
      throw e
    }
}



    return (
      <>
        <div className={`${styles.table__container} ${className}` }>
        <div className={`${styles.table__add} ${className}`}>
          <h6>
        <Link  onClick={() => handleCreateButtonClick()} to={""}>Новая вакансия</Link>
        </h6>
        {createRow && (
           <div>

          <input
              type="text"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['name']: event.target.value
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Название*"
              required
            />

            <input
              type="number"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['price_min']: Number(event.target.value)
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Мин-ЗП*"
              
            />
            <input
              type="number"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['price_max']: Number(event.target.value)
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Макс-ЗП*"
              
            />
            <input
              type="text"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['desc']: event.target.value
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Требования*"
            />
            <input
              type="text"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['adress']: event.target.value
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Полный адрес*"
            />
            <input
              type="text"
              onChange={(event) => {
                const updatedDictionary = {
                  ...dictionary,
                  ['company']: event.target.value
                };
                setDictionary(updatedDictionary);
              }}
              placeholder="Компания*"
              required
            />
            <textarea
             
             onChange={(event) => {
              const updatedDictionary = {
                ...dictionary,
                ['total_desc']: event.target.value
              };
              setDictionary(updatedDictionary);
            }}
             placeholder="Дополнительная информация*"
           />
           <input
            type="file"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
              // Assuming 'setDictionary' updates the dictionary with the uploaded file
              const updatedDictionary = {
                ...dictionary,
                ['png']: event.target.files[0]
              };
              setDictionary(updatedDictionary);
            }}}
            placeholder="Фото вакансии"
            />
           {/* Добавьте остальные поля */}
           <button type='submit' className='btn'  onClick={() => postVacancy()}>Сохранить</button>
           <button className='btn' onClick={() => {
                      setCreateRow(false);
                      setDictionary({           
                        id: 0,
          name: "",
          desc: "",
          price_min: 0,
          price_max: 0,
          company: "",
          total_desc: "",
          pic: "",
          status: "",
          adress: "",
          png:undefined,
                      });
                  }}>Отменить</button>
         </div>
        )}
        </div>
        <Table hover>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
                {<th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} >
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>
                  {row.id==editableRows && column.key==="pic" ?(
                    <input style={{width:'100px'}}
                    type="file"
                    onChange={(event) => {
                      if (event.target.files && event.target.files.length > 0) {
                      // Assuming 'setDictionary' updates the dictionary with the uploaded file
                      const updatedDictionary = {
                        ...dictionary,
                        ['png']: event.target.files[0]
                      };
                      setDictionary(updatedDictionary);
                    }}}
                    placeholder="Фото вакансии"
                    />
                  ):row.id == editableRows ? (
                    <input style={{width:'150px'}}
                    type="text"
                    value={dictionary[column.key as keyof typeof dictionary] as string}
                    onChange={(event) => {
                      const updatedDictionary = {
                        ...dictionary,
                        [column.key]: event.target.value
                      };
                      setDictionary(updatedDictionary);
                    }}
                  />
                  ) : column.key === "info" && row[column.key] !== null ? (
                    <div>
                      <>
                        {row[column.key].slice(0, 30)}
                        {expandedRows.includes(row.id) && row[column.key].slice(30)}
                        <div>
                          <Link onClick={() => toggleExpansion(row.id)} to={""}>
                            {expandedRows.includes(row.id) ? "Скрыть" : "Показать все"}
                          </Link>
                        </div>
                      </>
                    </div>
                  ) : column.key === "pic" && row[column.key] !== null ? (
                    <div>
                      <>
                        
                        
                        <div>
                          <Image style={{width:'100px',height:'50px'}} src={row[column.key]}/>
                        </div>
                      </>
                    </div>
                  ) : (
                    row[column.key]
                  )}
                </td>
                ))}
                  <td className={styles.table__action}>
                    {/* <EditIcon onClick={() => handleEditButtonClick(row)}/> */}
                    {editableRows!=row.id && (
                      <td className={styles.table__action}>
                    {/*<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16" onClick={() => (row)}>
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
                  </svg>*/}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16" onClick={() => handleDeleteButtonClick(row.id)}>
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16" onClick={() => handleEditButtonClick(row, row.id)}>
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                </td>
                    )}
                  {editableRows==row.id && (
                    <td className={styles.table__action}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" onClick={() => {
                      setEditableRows(null);
                      setDictionary({           
                        id: 0,
          name: "",
          desc: "",
          price_min: 0,
          price_max: 0,
          company: "",
          total_desc: "",
          pic: "",
          status: "",
          adress: "",
                      });
                  }}>
                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                  </svg>
                  <span className={styles.header__spacer}>&nbsp;&nbsp;&nbsp;</span> {/* Увеличенный пробел */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16" onClick={() => putVacancy()}>
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                  </svg>

                    </td>
                  )}
                  </td>
                </tr>
              ))}

            </tbody>
          </Table>

  
          {/*<ModalWindow handleBackdropClick={() => {setIsImageModalWindowOpened(false); setSelectedImage(null)}} active={isImageModalWindowOpened } className={styles.modal}>
            <h3 className={styles.modal__title}>Выберите картинку</h3>
            {currentImage && <h4 className={styles.modal__subtitle}>Текущее изображение</h4>}
            <div className={styles.dropzone__container}>
            <div className="dropzone__wrapper">
            <img className={styles.dropzone__image} src={currentImage} alt="" />
            {selectedImage && <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
            <div></div>
              <input className={styles.dropzone__input} id="upload" type="file" onChange={handleImageChange} />
            </div>
            </div>
            <Button disabled={selectedImage ? false : true} className={styles.dropzone__button} >Сохранить</Button>
            
          </ModalWindow>*/}
        </div>
      </>
    );
  }
  
  export default CustomTable