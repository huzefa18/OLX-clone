import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import LocationProvider from './components/context/context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
  <LocationProvider>
    <App />
  </LocationProvider>
  </BrowserRouter>
);
