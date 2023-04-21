const app=require('./app');
const dotenv = require("dotenv");
const cloudinary=require('cloudinary');
const connectDatabase=require('./config/database');
dotenv.config({ path: "config/config.env" });
connectDatabase();


process.on("uncaughtException", (err) => {
    console.log(err.message);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on localhost: ${process.env.PORT}`)
})

process.on("unhandledRejection", (err) => {
    console.log(err.message);
    console.log(`Shutting down the server due to Unhandled Rejection`);
    server.close(() => {
      process.exit(1);
    });
});
