const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(bodyparser.json())
require('dotenv').config();
const port = process.env.PORT ;
// const {protect} = require('./middleware/handlerFile')
const connectDB = require('./db/db')
connectDB();
const dotenv = require('dotenv').config()

app.use(require("./routers/baseRouter"))
app.use(require("./routers/adminRouter"))
// app.use(protect)
app.listen(port,()=>console.log(`Server started on port ${port}`))