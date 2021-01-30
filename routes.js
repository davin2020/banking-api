const BankController = require('../ToDosController');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

function routes(app) {
    //get all accounts
    app.get('/accounts', AccountsController.getAllAccounts);
    //get account for a certain user
    app.get('/accounts:/id', AccountsController.getAccountByID);

    //create  new account
    app.post('/accounts', jsonParser, AccountsController.insertNewAccount);

    //add or remove money
    app.put('/accounts/:id', AccountsController.updateMoney);

    //transfer  money between accoutns of differnt users
    app.put('/accounts', AccountsController.updateMoneyTransfer); //need  to callthis twice

    //this doesnt exist yet
    app.delete('/accounts/:id', AccountsController.deleteAccount)
}

module.exports = routes;