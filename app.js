const express=require('express');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser');
const errorMiddleware=require('./middleware/error')


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


//routes
const routes=require('./routes');
app.use('/api/v1',routes)


app.use(errorMiddleware)

module.exports=app;


