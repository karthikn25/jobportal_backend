const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {connectDataBase} = require('./db.js');
const {notesRouter}=require('./Routes/notes.js');
const {isAuth}=require('./Controller/auth.js');
const path = require('path');
const bodyParser = require('body-parser');
const { userRouter } = require('./Routes/user.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(cors())


connectDataBase();

app.use(bodyParser.json())


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use("/user",userRouter);

app.use("/notes",isAuth,notesRouter);



app.listen(PORT,()=>console.log(`server running under localhost:${PORT}`))