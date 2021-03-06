const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const appenv = require('./config/appenv.js')


//passport config:
require('./config/passport')(passport)
//mongoose
mongoose.connect(appenv.mongodb,{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('MongoDB: Conectado :D\n'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
app.use(express.static('public'))
    
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/create',require('./routes/create'));
app.use('/listUpdate',require('./routes/listUpdate'));
app.use('/multiCreate',require('./routes/multiCreate'));


mongoose.set('useFindAndModify', false);

//
import('./routes/init.js')

app.listen(appenv.port); 