const express = require('express');
const router = express.Router();
const adminSecret = "N46MVExB5pteLEVShqTqcrZVjmY5HyVW8FtqBhNKwwUTHFAX"
const User = require("../models/user");
const appenv = require('../config/appenv.js')
var app = express()
var axios = require('axios')
var qs = require('qs');
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded
var Escolhas = {}
var alreadyCheck = false
var msToken
var fs = require("fs");
var emailList
var codigoMatricula

function removeItem(arr, item) {
    return arr.filter(f => f !== item)
}

function gerar(name) {
    const nameseparator = appenv.custom.separator //Separador de nomes. Pode ficar em branco.
    const maildomain = '' 
    const mailseparator = ';'
    let generated = ''
    let names = name.split(' ');
    for (let index = 0; index < names.length - 1; index++) {
        generated += `${names[0]}${nameseparator}${names[index + 1]}${maildomain}`
        generated += mailseparator
    }
    generated += `${names[0]}${nameseparator}`
    for (let index = 1; index < names.length - 1; index++) {
        generated += names[index].split('')[0]
    }
    generated += `${names[names.length - 1]}`
    generated += `${maildomain}`
    generated += mailseparator
    generated += `${names[0]}${nameseparator}`
    for (let index = 1; index < names.length; index++) {
        generated += names[index].split('')[0]
    }
    generated += `${maildomain}`
    generated += mailseparator
    for (let index = 0; index < names.length - 1; index++) {
        generated += names[index].split('')[0]
    }
    generated += `${nameseparator}${names[names.length - 1]}`
    generated += `${maildomain}`
    //generated += mailseparator
    try {
        var data = fs.readFileSync('emails.txt', 'utf8');
        emailList = data.toString().split(';')
        //console.log(emailCreated)
    } catch (e) {
        console.log('Error:', e.stack);
    }

    function removeDups(names) {
        let unique = {};
        names.forEach(function(i) {
            if (!unique[i]) {
                unique[i] = true;
            }
        });
        return Object.keys(unique);
    }
    Escolhas = generated.split(';')
    Escolhas = removeItem(removeDups(Escolhas), "")
    vetorBases = Escolhas
    toRemove = new Set(emailList);
    Escolhas = Escolhas.filter(x => !toRemove.has(x));
    if (Escolhas.length == 0) {
        var semiComp = 0
        while (Escolhas.length == 0) {
            semiComp++
            for (let index = 0; index < vetorBases.length; index++) {
                Escolhas[index] = `${vetorBases[index]}${semiComp}`
            }
            Escolhas = Escolhas.filter(x => !toRemove.has(x));
        }
        complemento = semiComp
    }
    console.log(Escolhas)
    return generated
}




router.post('/', async (req, res) => {
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
        data: dataToken
    };

    await axios(configToken)
        .then(async function(response) {
            msToken = await response.data.access_token
            //console.log(msToken)
        })
        .catch(async function(error) {
            console.log(error.response.data);
        });
    //console.log(req.body) privacy
    const {
        postPW,
        email,
        usrName,
        pssd
    } = req.body;
    await User.findOne({
        name: usrName
    }, 'already', function(err, user) {
        
        if (err) return handleError(err);
        if (user.already == false) {
            alreadyCheck = true;
        }
        if (user.already == true) {
            alreadyCheck = false
        }
    });
    await User.findOne({
      name: usrName
  }, 'email', function(err, user) {
      codigoMatricula = user.email
      console.log(codigoMatricula)
      if (err) return handleError(err);
  });
    if (email == undefined) {
        msErro = 'Você não escolheu um email!'
        res.end(
            `<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>SGA - Login</title> <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"> <link href="css/sb-admin-2.min.css" rel="stylesheet"></head><body class="bg-gradient-primary"> <div class="container"> <div class="row justify-content-center"> <div style="background-image: url(img/logo.svg);height: 100px;width: 100%;background-repeat: no-repeat;background-position: center;margin-top: 35px;"></div><div class="col-xl-10 col-lg-12 col-md-9"> <div class="card o-hidden border-0 shadow-lg my-5"> <div class="card-body p-0"> <div class="row"> <div class="col-lg-3 d-none d-lg-block"></div><div class="col-lg-6"> <div class="p-5"> <div class="text-center"> <h1 class="h4 text-gray-900 mb-4">Ops, algo deu errado!</h1> <h1>D:</h1> <h1 class="h4 text-gray-900 mb-4">${msErro}</h1><a href='/dashboard'>Clique aqui para tentar novamente!</a></div></div></div></div></div></div></div></div></div><script src="vendor/jquery/jquery.min.js"></script> <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> <script src="vendor/jquery-easing/jquery.easing.min.js"></script> <script src="js/sb-admin-2.min.js"></script></body></html>`
        )
    }
    gerar(usrName)
    if (postPW == adminSecret && alreadyCheck && email != undefined) {
        var finalmentes = Escolhas[email]
        console.log(codigoMatricula)
        var data = JSON.stringify({
            "accountEnabled": true,
            "displayName": usrName,
            "mailNickname": "mailNickname-value",
            "usageLocation": "BR",
            "jobTitle": codigoMatricula,
            "userPrincipalName": `${finalmentes}@${appenv.ms.addressm}`,
            "passwordProfile": {
                "forceChangePasswordNextSignIn": false,
                "password": pssd
            }
        });
        var config = {
            method: 'post',
            url: 'https://graph.microsoft.com/v1.0/users',
            headers: {
                'Authorization': `Bearer  ${msToken}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(async function(response) {
                //console.log(JSON.stringify(response.data)); respeito a privacidade
                await res.end(`<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Email criado com sucesso!</title> <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"> <link href="css/sb-admin-2.min.css" rel="stylesheet"></head><body class="bg-gradient-primary"> <div class="container"> <div class="row justify-content-center"> <div style="background-image: url(img/logo.svg);height: 100px;width: 100%;background-repeat: no-repeat;background-position: center;margin-top: 35px;"></div><div class="col-xl-10 col-lg-12 col-md-9"> <div class="card o-hidden border-0 shadow-lg my-5"> <div class="card-body p-0"> <div class="row"> <div class="col-lg-3 d-none d-lg-block"></div><div class="col-lg-6"> <div class="p-5"> <div class="text-center"> <h1 class="h5 text-gray-900 mb-4">Olá, <b>${usrName}<b> seu email foi criado com sucesso!</h1> <h1 class="h5 text-gray-900 mb-4">:D</h1> <h2 class="h5 text-gray-900 mb-4">Email escolhido:<br><b>${finalmentes}@${appenv.ms.addressm}</b></h2> <a href="/users/logout">Sair!</a> </div></div></div></div></div></div></div></div></div><script src="vendor/jquery/jquery.min.js"></script> <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> <script src="vendor/jquery-easing/jquery.easing.min.js"></script> <script src="js/sb-admin-2.min.js"></script></body></html>`)
                console.log(`Email criado para: ${usrName}`)
                await User.findOneAndUpdate({
                    name: usrName
                }, {
                    already: true
                }).exec();
                await User.findOneAndUpdate({
                    name: usrName
                }, {
                    escolhido: `${finalmentes}@${appenv.ms.addressm}`
                }).exec();

                fs.readFile("emails.txt", "utf-8", (err, data) => {
                    var updateList = `${data}${finalmentes};`
                    fs.writeFile("emails.txt", updateList, (err) => {
                        if (err) console.log(err);
                        console.log("Lista de emails atualizada.");
                    });
                });
            })
            .catch(async function(error) {
                console.log(error.response.data.error.message);
                switch (await error.response.data.error.message) {
                    case "A password must be specified to create a new user.":
                        msErro = 'Você não inseriu uma senha!'
                        break;
                    case "Another object with the same value for property userPrincipalName already exists.":
                        msErro = 'Já existe um email com mesmo nome!'
                        break;
                    case "The specified password does not comply with password complexity requirements. Please provide a different password.":
                        msErro = 'Sua senha não preenche os requisitos minimos indicados!'
                        break
                    default:
                        msErro = error.response.data.error.message
                        break;
                }
                res.end(
                    `<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>SGA - Login</title> <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"> <link href="css/sb-admin-2.min.css" rel="stylesheet"></head><body class="bg-gradient-primary"> <div class="container"> <div class="row justify-content-center"> <div style="background-image: url(img/logo.svg);height: 100px;width: 100%;background-repeat: no-repeat;background-position: center;margin-top: 35px;"></div><div class="col-xl-10 col-lg-12 col-md-9"> <div class="card o-hidden border-0 shadow-lg my-5"> <div class="card-body p-0"> <div class="row"> <div class="col-lg-3 d-none d-lg-block"></div><div class="col-lg-6"> <div class="p-5"> <div class="text-center"> <h1 class="h4 text-gray-900 mb-4">Ops, algo deu errado!</h1> <h1>D:</h1> <h1 class="h4 text-gray-900 mb-4">${msErro}</h1><a href='/dashboard'>Clique aqui para tentar novamente!</a></div></div></div></div></div></div></div></div></div><script src="vendor/jquery/jquery.min.js"></script> <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> <script src="vendor/jquery-easing/jquery.easing.min.js"></script> <script src="js/sb-admin-2.min.js"></script></body></html>`
                )
            });

    } else {
        res.end('Erro interno, por favor tente novamente.');
    }
})
module.exports = router;