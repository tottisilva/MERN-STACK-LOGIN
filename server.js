require("dotenv").config({path: "./config.env"});
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//Connect DB 
connectDB();


const app = express();
//Middlewares
app.use(express.json());

app.use("/api/auth", require("./routes/auth")); 
app.use("/api/private", require("./routes/private")); 

//The errorHandler shoud be the last piece of middleware
app.use(errorHandler);

//
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

process.on("unhandledRejection", (err, promisse) =>{
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
});