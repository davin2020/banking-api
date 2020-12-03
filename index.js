const expressPkg = require('express'); //import the express pkg
const MongoClient = require('mongodb').MongoClient;

const app = expressPkg();
const port = 3008;
//helpful to delete stuff by ID
const ObjectId = require('mongodb').ObjectId;

//where db is that we are going ot use, protocol = mongodb
const url = "mongodb://root:password@localhost:27017"; //default port

const bankingData = [
    {name: 'Turin', address: 'RAC', balance: '-100'},
    {name: 'Pree', address: 'The Royal, Westerley', balance: '23100'},
    {name: 'Dutch', address: 'Lucy', balance: '700'}
]


// CALLBACKS

//this func is used for retrieving all records from the people collection
//first param is teh db itself
//second param is a callback torun after the query has completed
//Requirement - Get all Accounts
let getAllAccounts = (db, callback) => {
    //setup collection
    let collection = db.collection('users');
    // now can query stuff
    collection.find({}).toArray((error, docs) => {
        console.log('Found teh following Accounts');
        //we then run the provied callback, passimg it the results, so thety can be sent to the user
        callback(docs); // this callback function be defined later
    })
}

//how to pass in the id here?? - just added it to func params for now
//Requirement - Get specific account by ID - currently done by Name
let getAccountByID = (name, db, callback) => {
    //setup collection
    let collection = db.collection('users');
    // now can query stuff
    collection.find({name: name}).toArray((error, docs) => {
        console.log(`Found One Account ${name} `);
        //we then run the provied callback, passimg it the results, so thety can be sent to the user
        callback(docs); // this callback function be defined later
    })
}

//Requirement use PUT - add money to account ie increase value of balance field

//Requirement use PUT - withdraw money from account ie reduce value of balance field

//Requirement use PUT - transfer money from one user to another ie adjust value of balance fields by same amount across 2 differnt  user accounts

//Requirement - use POST - add/crerate new account, w name, address, balance 0 as default

// ALL ROUTES
app.get('/', (request, response) => {
    response.send('Hello banking Root');
})


// MONGO DB STUFF
app.get('/accounts', async (request, response) => {
    // console.log('blah');
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo DB');

        //instead of respnding with text ok, can now respond with result of query ie json
        // response.send('Accounts');

        let db = client.db('bank'); //name of DB in mongo
        getAllAccounts(db, (documentsReturned) => {
            console.log('found some records:');
            console.log(documentsReturned);
            response.json(documentsReturned);
            //callbacks are hard to follow, all this stuff happens async
        })
    })
})

//GIT WIP branch

app.get('/accounts/:name', async (request, response) => {
    // console.log('blah');
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        let name = request.params.name;
        console.log(`connected to mongo DB for query with Name: ${request.params.name}`);
        // console.log('dfgdfgf');
        // now get details for just one account - this needs to be inside the callback block otherwise it doestn know what client.db() is!
        let db = client.db('bank');
        getAccountByID(name, db, (documentsReturned) => {
            console.log('found some records:');
            console.log(documentsReturned);
            response.json(documentsReturned);
            //callbacks are hard to follow, all this stuff happens async
        })
    })
})

app.listen(port, () => {
    console.log(`Banking API listening on port http://localhost:${port}`);
})