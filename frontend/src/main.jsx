import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import LocationProvider from './components/context/context.jsx';
import { CategoryProvider } from './components/context/CategoryProvider.jsx';
import { ProductProvider } from './components/context/ProductProvider.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ProductProvider>

<CategoryProvider>

  <LocationProvider>
    <App />
  </LocationProvider>
</CategoryProvider>
    </ProductProvider>
    
  </BrowserRouter>
);
