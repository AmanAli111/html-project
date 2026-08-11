//external module
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

//local module
const authRouter = require('./routes/authRouter');
const { default: mongoose, Collection } = require('mongoose');
const { userRouter } = require('./routes/userRouter');
const { storage, fileFilter } = require('./utils/fileUtils');

const store = new MongoDBStore({
    uri: process.env.MONGO_URL ,
    collection: 'sessions'
});

const multerOption = {storage,fileFilter}

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session(
{
    secret: 'SpendWise',
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie: { secure: false },
}));

app.use(multer(multerOption).single('ProfilePic'));
app.use(express.urlencoded());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());


app.use((req,res,next)=>
{
    console.log(req.method,req.path);
    next();
    
});

app.use('/auth',authRouter);
app.use('/user',userRouter);

app.use("/",(req,res,next)=>
{
    res.status(404).json("Error : Page Not Found")
});


const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL)
.then(()=>
{
    console.log("Connected to MongoDB");
    app.listen(PORT, () => 
    {
        console.log(`Server is running on PORT : http://localhost:${PORT}`);
    });
}).catch((err)=>
{
    console.log("Error while connecting Mongo",err);
});

