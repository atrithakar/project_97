const express = require('express')
require('dotenv').config();
const router = require('./routes/index')
const path = require('path')
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger.util')

const app = express();

app.use((req, res, next) => {
  logger.info(`Incoming request`, { method: req.method, path: req.path });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/maps/gtav', express.static(path.join(__dirname, 'gta_map')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router)

app.listen(process.env.APP_PORT, () => {
    console.log("listening");
})