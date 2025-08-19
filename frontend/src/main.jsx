import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import LocationProvider from './components/context/context.jsx';
import { CategoryProvider } from './components/context/CategoryProvider.jsx';
import { ProductProvider } from './components/context/ProductProvider.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ProductProvider>
      <AuthProvider>


<CategoryProvider>

  <LocationProvider>
    <App />
  </LocationProvider>
</CategoryProvider>
      </AuthProvider>
    </ProductProvider>
    
  </BrowserRouter>
);
