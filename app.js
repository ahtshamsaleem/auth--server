const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const sendMail = require('./utils/sendMail');


const app = express();


app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/', authRoutes);

app.use(userRoutes);








// Error Handler Middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message});
});






mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fpjtbus.mongodb.net/${process.env.MONDO_DATABASE}`).then(() => {
    console.log('Connected to Database.');
    app.listen(process.env.PORT || 8000);
})
.catch((error) => {
    console.log('Some error occurred while conneting to the Database.')
})


