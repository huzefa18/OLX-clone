const express = require('express');
const cors = require('cors')
const app = express();
const cookieParser=require('cookie-parser')
const authRoutes = require("./src/routes/auth.routes"); 
app.use(cookieParser);
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));


const categoryRoutes = require('./src/routes/categoryRoutes'); 
const productRoutes  = require('./src/routes/productRoutes');
app.use('/categories', categoryRoutes);          
app.use('/products',  productRoutes);           
app.use('/api/auth',authRoutes)
require('dotenv').config();
const connectDB = require('./config/db');


const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}. Access it at http://localhost:${PORT}`);   
        });
    } 
    catch (error) 
    {
        console.error(error);
        process.exit(1);
    }
}

startServer();