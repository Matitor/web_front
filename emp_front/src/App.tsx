import {Navigate, HashRouter, Routes, Route } from 'react-router-dom'
// import styles from './App.module.scss'
import MainPage from './pages/MainPage';
import VacPage from './pages/VacPage';
import Breadcrumps from "./components/Breadcrumps/Breadcrumps";
//import RegistrationPage from 'pages/RegistrationPage';
//import LoginPage from 'pages/LoginPage';

function App() {
    return (
      <div className='app'>
        
       {/*<Breadcrumps />*/}
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/vacancy" element={<Navigate to="/" replace />} />
                <Route path="/vacancy">
                  <Route path=":id" element={<VacPage />} />
                </Route>

                {/*<Route path='/registration' element={<RegistrationPage/>}></Route>
                <Route path='/login' element={<LoginPage/>}></Route>*/}
            </Routes>
        </HashRouter>
      </div>
    );
  }
  
export default App;