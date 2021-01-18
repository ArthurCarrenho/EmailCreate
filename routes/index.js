const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth') 
var fs = require('fs');
var emailCreated
const appenv = require('../config/appenv.js')

function readFile() {
   try {  
        var data = fs.readFileSync('emails.txt', 'utf8');
        emailCreated = data.toString().split(';')
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

setInterval(readFile, 500);


//login page
router.get('/', (req,res)=>{
    res.render('login',{
        appenv: appenv
    });
})
//register page
router.get('/register',ensureAuthenticated,(req,res)=>{
    res.render('register',{
        adminN: req.user
    });
})
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user: req.user,
        emailList: emailCreated,
        appenv: appenv
    });
})
module.exports = router; 