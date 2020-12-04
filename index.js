const expressPkg = require('express'); //import the express pkg
const MongoClient = require('mongodb').MongoClient;
//need body parser for POST requests
const bodyParser = require('body-parser');

const app = expressPkg();
const port = 3008;

//need body parser for POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//helpful to delete or get stuff by ID
const ObjectId = require('mongodb').ObjectId;

//where db is that we are going ot use, protocol = mongodb
const url = "mongodb://root:password@localhost:27017"; //default port

const bankingData = [
    {name: 'Turin', address: 'RAC', balance: '-100'},
    {name: 'Pree', address: 'The Royal, Westerley', balance: '23100'},
    {name: 'Dutch', address: 'Lucy', balance: '700'}
]

//GIT WIP branch - do i need to git add package-lock.json file??

// CALLBACKS

//FUNCTIONS


// FUNCTIONS
//this now works with ID for 1 user account
let updateMoney = (db, accountID, amount) => {
    let collection = db.collection('accounts');
    //find current balance for current user, increase it by x amount
    let currentBalance = getAccountByID(accountID, db, (documentsReturned) => {
        console.log(`found some records inside addMoney: amt to update ${amount}`);
        console.log(`id: ${accountID}`);
        collection.updateOne({_id: accountID}, {
            //increment feature to increase value of exsting field
            $inc: {
                balance: amount
            }
        });
    })
}

let insertNewAccount = (db, dataToSend) => {
    let collection = db.collection('accounts');
    console.log(`found insertNewAccount `);
    collection.insertOne(dataToSend); //no need for any options here, mongodb will just store json for us
}


//this func is used for retrieving all records from the people collection
//first param is teh db itself
//second param is a callback torun after the query has completed
//Requirement - Get all Accounts
let getAllAccounts = (db, callback) => {
    //setup collection
    let collection = db.collection('accounts');
    // now can query stuff
    collection.find({}).toArray((error, docs) => {
        console.log('Found teh following Accounts');
        //we then run the provied callback, passimg it the results, so thety can be sent to the user
        callback(docs); // this callback function be defined later
    })
}

let getAccountByID = (id, db, callback) => {
    //setup collection
    let collection = db.collection('accounts');
    // now can query stuff
    collection.find({_id: id}).toArray((error, docs) => {
        console.log(`Found One Account by ID: ${id} `);
        //we then run the provied callback, passimg it the results, so thety can be sent to the user
        callback(docs); // this callback function be defined later
    })
}


//ROUTES

//Requirement use PUT - add money to account ie increase value of balance field
//Requirement use PUT - withdraw money from account ie reduce value of balance field

//Requirement use PUT - transfer money from one user to another ie adjust value of balance fields by same amount across 2 differnt  user accounts
    //this route is beingn called, instead of the one with only 2 parms !
//can use 2x url placeholders , with amt in body
app.put('/accounts', async (request, response) => {
    // let id = ObjectId(request.params.id);
    const accountIDFrom = request.body.idFrom;  //best to get from body or params?
    const accountIDTo = request.body.idTo;
    const amount = parseFloat(request.body.amount);

    console.log(request.body);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo for PUT');
        let db = client.db('bank');

        //if amt is 100, from is -100, and to is +100
        updateMoney(db, accountIDFrom, -amount);
        updateMoney(db, accountIDTo, amount);
    })
    response.json({message: `Updated balance using PUT to update money ${amount}  for accountIDFrom ${accountIDFrom}  to accountIDTo ${accountIDTo} `});
})


//Requirement - use POST - add/create new account, w name, address, balance 0 as default
app.post('/accounts', (request, response) => {
    //fyi if some properties are nto provided, a new account ist  still created
    let newAccountName = request.body.name;
    let newAccountAddress = request.body.address;
    let newAccountBalance = request.body.balance;
    let dataToSend = {
        name: newAccountName,
        address: newAccountAddress,
        balance: newAccountBalance
    }
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo DB for POST request');
        let db = client.db('bank');
        //forgot to add this line - this does the actual insertion!
        insertNewAccount(db, dataToSend);
    });
    response.json({message: `inserted new account for: ${newAccountName}`});
    // response.send('inserted!');

});

// ALL ROUTES
app.get('/', (request, response) => {
    response.send('Hello banking Root');
})

//put to update balance by x amount - should params go in url or POST BODY! - PB as QP are for sorting or filtering
//this can be  used to both add or withdraw money, if using negative value
// app.put('/accounts/:id/:amount', async (request, response) => {
app.put('/accounts/:id', async (request, response) => {
    // const accountID = request.body.id;
    const amount = parseFloat(request.body.amount);
    let accountID = ObjectId(request.params.id);

    console.log(request.body);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo for PUT');
        let db = client.db('bank');
        updateMoney(db, accountID, amount);
    })

    response.json({message: `Updated balance using PUT to update money ${amount}  for id ${accountID} `});
})


app.get('/accounts', async (request, response) => {
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


app.get('/accounts/:id', async (request, response) => {
    // console.log('blah');
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        let accountID = ObjectId(request.params.id); //need when GETting thign too

        console.log(`connected to mongo DB for query with ID: ${request.params.id}`);
        // now get details for just one account - this needs to be inside the callback block otherwise it doestn know what client.db() is!
        let db = client.db('bank');
        //if account not found, would be nice to show error msg, dont worry about case for Name
        getAccountByID(accountID, db, (documentsReturned) => {
            console.log(`found some records by GET and id: ${accountID}`);
            console.log(documentsReturned);
            response.json(documentsReturned);
        })
    })
})

app.listen(port, () => {
    console.log(`Banking API listening on port http://localhost:${port}`);
})