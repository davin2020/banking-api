const expressPkg = require('express'); //import the express pkg
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser'); //RM
const cors = require('cors');

const app = expressPkg();
const port = 3008;

//need bodyParser for POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//helpful to get objects by ID, or delete them
const ObjectId = require('mongodb').ObjectId;

//Location of DB that we are going to use (connection protocol = mongodb)
// const url = "mongodb://root:password@localhost:27017"; //default port & login for Macs
const url = "mongodb://localhost:27017"; //default port & login for Windows10

// todo - 13feb2021 what about putting mongo db in cloud?? so when i make demo deployable version it will work ok, but that would make install instructions different

//example data structure, before using external MongoDB
const bankingData = [
    {nickname: 'Turin', fullname: 'Alfred Olyevich Turin', location: 'RAC', balance: '23000'},
    {nickname: 'Pree', fullname: 'Johnny Andras Jaqobis', location: 'Lucy', balance: '7100'},
    {nickname: 'Dutch', fullname: 'Yalena Yardeen', location: 'Lucy', balance: '1200'}
]

// TODO refactor code in this index file into separate callbacks & functions
// CALLBACKS


// FUNCTIONS
//this now works with ID for 1 user account
let updateMoney = (db, accountID, amount) => {
    let collection = db.collection('accounts');
    //find current balance for current user, increase it by x amount
    let currentBalance = getAccountByID(accountID, db, (documentsReturned) => {
        console.log(`found some records inside updateMoney: amt to update ${amount}`);
        console.log(`id: ${accountID}`);
        collection.updateOne({_id: accountID}, {
            //increment feature to increase value of exsting field
            $inc: {
                balance: amount
            }
        });
        console.log(`updateMoney: updated balance by amount`);
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
    //added to controller file ok - needs to be in SERVICES file instead!!
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
    // need to get obj id!
    // let accountID = ObjectId(request.params.id);
    const accountIDFrom = ObjectId(request.body.idFrom);  //best to get from body or params?
    const accountIDTo = ObjectId(request.body.idTo);
    const amount = parseFloat(request.body.amount);

    console.log(request.body);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo for PUT as part of TRF');
        // todo - need to abstract this db client name
        let db = client.db('banking');

        //if amt is 100, from is -100, and to is +100
        //chage this to updateMoneyTransfer(),which calls these 2
        // 30jan is negative sign causing an issue? try parseFloat() ?
        updateMoney(db, accountIDFrom, -amount);
        updateMoney(db, accountIDTo, amount);
    })
    response.json({message: `Updated balance using PUT to update money ${amount}  for accountIDFrom ${accountIDFrom}  to accountIDTo ${accountIDTo} `});
})

//Requirement - use POST - add/create new account, w nickname, location, balance 0 as default
app.post('/accounts', (request, response) => {
    //fyi if some properties are nto provided, a new account ist  still created
    let newAccountFullname = request.body.fullname;
    let newAccountNickname = request.body.nickname;
    let newAccountLocation = request.body.location;
    let newAccountBalance = request.body.balance;
    let dataToSend = {
        fullname: newAccountFullname,
        nickname: newAccountNickname,
        location: newAccountLocation,
        balance: newAccountBalance
    }
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo DB for POST request');
        let db = client.db('banking');
        //forgot to add this line - this does the actual insertion!
        // todo - nothing is actuallly inserted!!
        // need to check for error condition and respond w error msg
        insertNewAccount(db, dataToSend);
        console.log(`any error: ${error}`);
    });
    response.json({message: `Created new account for: ${newAccountNickname}`});
    // response.send('inserted!');

});

// ALL ROUTES
app.get('/', (request, response) => {
    response.send('Hello, banking API is running');
})

//put to update balance by x amount - should params go in url or POST BODY! - PB as QP are for sorting or filtering
//this can be  used to both add or withdraw money, if using negative value
// app.put('/accounts/:id/:amount', async (request, response) => {
app.put('/accounts/:id', async (request, response) => {
    // const accountID = request.body.id;
    const amount = parseFloat(request.body.amount);
    let accountID = ObjectId(request.params.id);
    console.log(`value of amount: ${amount}`);

    console.log(request.body);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo for PUT');
        let db = client.db('banking');
        updateMoney(db, accountID, amount);
    })

    response.json({message: `Updated balance using PUT to update money ${amount}  for id ${accountID} `});
})

//this is the code that shoudl be  in teh CONTROLLER!
app.get('/accounts', async (request, response) => {
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        console.log('connected to mongo DB');
        //instead of respnding with text ok, can now respond with result of query ie json
        // response.send('Accounts');
        let db = client.db('banking'); //name of DB in mongo
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
        let db = client.db('banking');
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