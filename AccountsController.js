const AccountsService = require('../Services/ToDosService'); //doesnt exist  yet
const DbService = require('../Services/DbService'); //sdoesnt exist yet
const ObjectId = require('mongodb').ObjectId;

function getAllAccounts(req, res) {
    DbService.connectToDB(function(db) {
        AccountsService.getAllAccounts(db, function (documents) {
            res.json(documents)
        })
    })
}

// let getAllAccounts = (db, callback) => {
//     //setup collection
//     let collection = db.collection('accounts');
//     // now can query stuff
//     collection.find({}).toArray((error, docs) => {
//         console.log('Found teh following Accounts');
//         //we then run the provied callback, passimg it the results, so thety can be sent to the user
//         callback(docs); // this callback function be defined later
//     })
// }

module.exports.getAllAccounts = getAllAccounts;