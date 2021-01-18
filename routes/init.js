const appenv = require('../config/appenv.js')
async function init() {
var axios = require('axios')
var qs = require('qs');
var toWrite = ''
fs = require('fs');
var dataToken = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': appenv.ms.clientid,
  'scope': 'https://graph.microsoft.com/.default',
  'client_secret': appenv.ms.clientsecret
   });
   var configToken = {
     method: 'post',
     url: `https://login.microsoftonline.com/${appenv.ms.uuid}/oauth2/v2.0/token`,
     headers: { 
       'Host': 'login.microsoftonline.com', 
       'Content-Type': 'application/x-www-form-urlencoded', 
       'Cookie': 'fpc=AmXF15e5mK9HhE0zAuQnYFqEZezyAQAAAHHvMtcOAAAA; x-ms-gateway-slice=prod; stsservicecookie=ests'
     },
     data : dataToken
   };
   
   await axios(configToken)
   .then(async function (response) {
     msToken = await response.data.access_token
     //console.log(msToken)
   })
   .catch(async function (error) {
     console.log(error.response.data);
   });
   var config = {
    method: 'get',
    url: 'https://graph.microsoft.com/v1.0/users?$select=userPrincipalName',
    headers: { 
      'Authorization': `Bearer ${msToken}`
    }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    var jason = response.data
    console.log(jason)
    for (let index = 0; index < jason.value.length; index++) {
    almost = jason.value[index].userPrincipalName.split("@").shift()
    toWrite += `${almost};`
    //console.log(jason.value[index].userPrincipalName)
    }
    console.log(toWrite)
    fs.writeFile('emails.txt', toWrite, function (err) {
        if (err) return console.log(err);
      });
  })
  .catch(function (error) {
    console.log(error);
  });
}
init();