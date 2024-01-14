import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap.css';
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div style={{background:'#e7e5e5', width:'100%'}}>
  {/*//<React.StrictMode>*/}
    <App />
  {/*//</React.StrictMode>,*/}
  </div>
)
