import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { DatacontextProvider } from "./Context/Datacontext";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DatacontextProvider>
        <App />
      </DatacontextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
