import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import LocationProvider from './components/context/context.jsx';
import store from '../store/store.js';
import { Provider } from "react-redux";
import { AuthProvider } from './auth/AuthContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <AuthProvider>


  <Provider store={store}>


  <LocationProvider>
    <App />
  </LocationProvider>
  </Provider>
      </AuthProvider>
    
  </BrowserRouter>
);
