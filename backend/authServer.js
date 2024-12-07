// mongodb
require('./config/db');

const express = require('express');
const app = express();
const port = 8080;

// cors
// const cors = require("cors");
// app.use(cors());

const AuthRouter = require('./api/Auth');

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/auth', AuthRouter)
app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});