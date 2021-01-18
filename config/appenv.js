var appenv = {};
appenv.ms = {};
appenv.custom = {};
//Porta
appenv.port = 80
//Endereço do Banco de Dados
appenv.mongodb = ''
//Office365
appenv.ms.addressm = '' //Dominio do endereço de email
appenv.ms.clientid = '' //Client ID
appenv.ms.clientsecret = '' //Client Secret
appenv.ms.uuid = '' //Identificador unico da aplicação
//Customização
appenv.custom.separator = '.' //Separador dos nomes (nome.sobrenome)/(nome_sobrenome)/(nome-sobrenome)/etc
appenv.custom.logo = '' //url da logo do projeto, preferencialmente em vetor (svg)

module.exports = appenv;
