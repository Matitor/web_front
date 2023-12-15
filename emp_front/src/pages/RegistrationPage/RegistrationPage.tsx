import * as React from 'react';
import { useState } from 'react';
import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Header from '../../components/Header';
import styles from './RegistrationPage.module.scss'
import axios, { AxiosResponse } from 'axios';
import { useDispatch } from "react-redux";
import { setUserAction, setIsAuthAction } from "../../slices/AuthSlice";
import { toast } from 'react-toastify';

const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch();
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordError, setPasswordError] = useState('init')
    const [emailError, setEmailError] = useState('init')
    const [isDataValid, setIsDataValid] = useState(false)

    const emailValidation = (value: string): void => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value.length !== 0) {
            setEmailError('Неправильный формат email!');
        } else if(value.length === 0)  {
            setEmailError('Это обязательное поле!');
        } else {
            setEmailError('');
        }
    };

    const  passwordValidation = (value: string): void => {
        if (value.length === 0) {
            setPasswordError('Это обязательное поле!');
        } else {
            setPasswordError('');
        }
    }





    React.useEffect(() => {
        if (!emailError && !passwordError) {
            setIsDataValid(true)
        } else {
            setIsDataValid(false)
        }
    }, [emailError, passwordError])

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const formData = new FormData();
        formData.append('email', emailValue);
        formData.append('password', passwordValue);
        const response: AxiosResponse = await axios.post('http://localhost:8000/create/', formData, {
          withCredentials: true, // Включаем передачу кук в запросах
        });

        dispatch(setIsAuthAction(true))

        dispatch(setUserAction({
            email: response.data.email,
            isSuperuser: response.data.is_superuser
        }));

        toast.success("Регистрация пройдена успешно!");
      } catch (error) {
        toast.error("Такой пользователь уже существует!");
        throw error
      }
    };

    const handleEmailValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        emailValidation(event.target.value)
        setEmailValue(event.target.value)
    };

    const handlePasswordValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        passwordValidation(event.target.value)
        setPasswordValue(event.target.value)
    };

    return (
        <div className={styles.registration__page}>
            <Header />
            <div style={{position: 'relative'}}className={styles['registration__page-wrapper']}>
                <Form  onSubmit={handleFormSubmit}
                className={styles['form']}>
                    <h3 className={styles['registration__page-title']}>Регистрация</h3>
                    <div className={styles.form__item}>
                        <Form.Group style={{height: 50}} className='w-100 mb-3' controlId="search__sub.input__sub">
                            <Form.Control onChange={handleEmailValueChange} value={emailValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="email" placeholder="E-mail..." />
                            <span className={styles['form__item-error']}>{emailError !== 'init' && emailError}</span>
                        </Form.Group>
                    </div>
                    <div className={styles.form__item}>
                        <Form.Group style={{height: 50}} className='w-100 mb-3' controlId="search__sub.input__sub">
                            <Form.Control onChange={handlePasswordValueChange} value={passwordValue} style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} type="password" placeholder="Пароль..." />
                            <span className={styles['form__item-error']}>{passwordError !== 'init' && passwordError}</span>
                        </Form.Group>
                    </div>
                    
                    {
                        isDataValid ? <Button type='submit' style={{backgroundColor: "#2787F5", padding: "10px 20px", borderColor: "#000", fontSize: 18, height: 50}}>Зарегистрироваться</Button>
                        : <Button disabled type='submit' style={{backgroundColor: "#2787F5", padding: "10px 20px", borderColor: "#000", fontSize: 18, height: 50}}>Зарегистрироваться</Button>
                    }
                    <Link className={styles['registration__page-link']} to='/login'>У вас уже есть аккаунт?</Link>
                </Form>
            </div>
        </div>
    )
};
  
export default RegistrationPage;