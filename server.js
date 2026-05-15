const express = require('express')
require('dotenv').config();
const router = require('./routes/index')
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router)

app.listen(process.env.APP_PORT, () => {
    console.log("listening");
})