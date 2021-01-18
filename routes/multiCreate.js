const express = require('express');
const router = express.Router();
var axios = require('axios');
var qs = require('qs');


router.post('/', async (req,res)=>{
  const {multipleList} = req.body
  function splitLines(t) { return t.split(/\r\n|\r|\n/); }
  var lol = splitLines(multipleList)
  
  for (let index = 0; index < lol.length; index++) {
    lol[index] = lol[index].split(';')
  }
  
  console.log(lol)
  var stringed = ''
for (let index = 0; index < lol.length; index++) {
    stringed += '['
    for (let lndex = 0; lndex < lol[index].length; lndex++) {
        stringed += lol[index][lndex]
        stringed += ', '
    }
    stringed -+ ', '
    stringed += ']\n'
}
  res.end(stringed)  

  
  for (let index = 0; index < lol.length; index++) {

    var data = qs.stringify({
     'name': lol[index][0],
     'email': lol[index][1],
     'password': lol[index][2],
     'password2': lol[index][2] 
     });
    
     var config = {
     method: 'post',
     url: 'https://facefemailchoose.herokuapp.com/users/register',
     headers: { 
       'Content-Type': 'application/x-www-form-urlencoded', 
       'Cookie': 'connect.sid=s%3AQzbfyr5lx7598lAJxk_5uq0yQt51LfS0.5bWK5EF7eh12ApHI7ZrPETTWkR58pl%2FpCxjDVp1Sp%2Bo'
     },
     data : data
     };
    
       axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    }); 
    
  }

})

module.exports = router; 
