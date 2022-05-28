require('dotenv').config();
const express = require('express');
const credentials = require('./controllers/middleware/credentials');
const cors = require('cors');
const corsOptions = require('./controllers/config/cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;

const app = express();

// Def Middlewares
app.use(fileUpload({safeFileNames: true, preserveExtension: true}));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Static files 
app.use('/static', express.static('static'));

// Routes
app.use('/api/v1/login', require('./controllers/api/v1/auth/login'));
app.use('/api/v1/register', require('./controllers/api/v1/auth/register'));
app.use('/api/v1/logout', require('./controllers/api/v1/auth/logout'));
app.use('/api/v1/refresh', require('./controllers/api/v1/auth/refresh'));

app.use('/api/v1/profile/general', require('./controllers/api/v1/profile/general'));
app.use('/api/v1/profile/password', require('./controllers/api/v1/profile/password'));
app.use('/api/v1/profile/social', require('./controllers/api/v1/profile/social'));
app.use('/api/v1/profile/info', require('./controllers/api/v1/profile/info'));

app.use('/api/v1/news/add', require('./controllers/api/v1/news/add'));
app.use('/api/v1/news/list', require('./controllers/api/v1/news/list'));
app.use('/api/v1/news/id', require('./controllers/api/v1/news/news'));

app.use('/api/v1/file-upload/image', require('./controllers/api/v1/fileUpload/image'));
app.use('/api/v1/file-upload/images', require('./controllers/api/v1/fileUpload/images'));


app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});