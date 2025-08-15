const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());


const categoryRoutes = require('./src/routes/categoryRoutes'); 
const productRoutes  = require('./src/routes/productRoutes');
app.use('/categories', categoryRoutes);          
app.use('/products',  productRoutes);           

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