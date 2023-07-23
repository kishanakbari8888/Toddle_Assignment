const express = require('express');
const initRoute = require('./routes/initRoute');
const authRoute = require('./routes/authRoute');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const {connection} = require('./dataBaseconnection');
const journalCreate = require('./routes/journalCreate');
const journalUpdate = require('./routes/journalUpdate');
const journaldelete = require('./routes/journalDelete');
const feedRoute = require('./feedRoute/feedRoute');

require("dotenv").config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/api/user', authRoute);




app.use('/api/journal', journalCreate);
app.use('/api/journal/update', journalUpdate);
app.use('/api/journal/delect', journaldelete);

app.use('/api/feed', feedRoute);

app.use('', initRoute);


app.listen(PORT,async ()=>{  
    
    console.log(`here we go ${PORT}`);

});