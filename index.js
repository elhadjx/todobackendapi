require('dotenv').config();
const express = require('express')
const { connectDB } = require('./config/db')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose')
const users = require('./routes/users')

const PORT = process.env.PORT || 3500

const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(morgan('common'))

app.use('/users', users);

connectDB()

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log('App listetning on port: ' + PORT)
    })
})