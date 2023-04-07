const express = require('express');
const connectDB = require('./config/connectDB');
const mongoose = require('mongoose');
const cors = require('cors');

const errorResponse = require('./middleware/errorHandler');

const PORT = process.env.PORT || 5000
const app = express();
const dotenv = require('dotenv');

const user = require('./routes/user')

mongoose.set('strictQuery', true);

dotenv.config({ path: './config/config.env' });
dotenv.config({ path: '.env' });

app.use(cors());
app.use(errorResponse)
connectDB();

// to allow a maximum of 50 mb of data transfer from client to server in req.body.
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/user', user);

app.listen(PORT, () => {
    console.log("Server listening at port no ", PORT);
})