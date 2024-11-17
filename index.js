// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const {connectDataBase} = require('./db.js');
// const {notesRouter}=require('./Routes/notes.js');
// const {isAuth}=require('./Controller/auth.js');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { userRouter } = require('./Routes/user.js');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 8080;

// app.use(express.json());

// app.use(cors())


// connectDataBase();

// app.use(bodyParser.json())


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// app.use("/user",userRouter);

// app.use("/notes",isAuth,notesRouter);



// app.listen(PORT,()=>console.log(`server running under localhost:${PORT}`))

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDataBase } = require('./db.js');
const { notesRouter } = require('./Routes/notes.js');
const { userRouter } = require('./Routes/user.js');
const { isAuth } = require('./Controller/auth.js');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDataBase();

// Static file serving (e.g., for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/user", userRouter);
app.use("/notes", notesRouter);  // Protect the notes routes with the isAuth middleware

// Start the server
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
