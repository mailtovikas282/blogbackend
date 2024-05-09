const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const colors=require('colors')
const dotenv=require('dotenv')
const connectDB = require('./config/db')


//env config // if another file then add path name inside bracket
dotenv.config();

// user router
const userRoutes=require('./routes/userRoutes');
const blogRoutes=require('./routes/blogRoutes');

//mongodb connection 
connectDB();

// rest object
const app=express()

// basic middlewares
app.use(cors())
app.use(express.json()) // to use data in json format -
app.use(morgan('dev')) // to show api on console->  Morgan is a Node.js middleware to log HTTP requests.
//  Monitoring and reading logs can help you better understand how your application behaves.custom morgan msgs can also be logged.


// routes
app.use("/user",userRoutes);
app.use("/api/v1/blog",blogRoutes);


//listen 
const PORT=process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`Server Running on ${process.env.DEV_MODE} MODE on portn number ${PORT}`.bgCyan.white);
})
