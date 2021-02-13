# banking-api
RESTful Banking API with Killjoys Characters as Customers

## To Install
1. clone repo locally & cd to directory
2. run `npm install`
3. create local MongoDB database called `bank`
4. create collection called `accounts` & import data from file `accounts.json`
5. if your local db needs a username & password, add them to file index.js on line xxx
6. run `nodemon index.js`
7. navigate to `localhost:3008` in browser to test its running
8. use Postman or similar to submit requests

## API Feature/Routes
- Create new account (should have a name, address and balance)
- Add money to an account
- Wthdraw money from an account 
- Transfer money from one account to another
- Get all accounts
- Get specific account by ID 

### Scenarios & Examples
Dutch and  brothers Johnny & Davin, are a trio of bounty hunters in the Quad solar system. On the planet Westerley, Pree runs a bar called The Royale in Old Town. Turin manages The RAC, where the trio work and sends them off on bounty hunting missions

- Davin is new to the team and needs to open an account, and add 80 credits in cash

- Johnny lost a wager to Davin, he checks his balance and transfers 20 credits to Davin

- Dutch needs some info from a local monk and withdraws 50 in cash to donate to his cause

- Its the end of the month. Turin has to pay their salary according to their level at the RAC.
Turin pays Dutch 1000 credits, Johnny 600 and Davin 800

- The trio meetup at the Royale and its Dutch's round. She pays Pree 25 credits for drinks & snacks

- Their arch nemesis hacks into the bank and checks out everyones balance 

EG ROUTES from Aptitude Test

**/accounts/{id}**

GET
- Gets specific account by ID
- `/accounts/5fca5c91f1c7152ec5d3023d`
- Returns _id, name, address & balance of account
 `{
        "_id": "5fca5c91f1c7152ec5d3023d",
        "name": "Dutch",
        "address": "Lucy the  Spaceship",
        "balance": 970
    }`
  

PUT
- Credits or debits money to the account specified
- Use a positive amount for a credit or a negative amount for a debit
- Sends: `{"amount":100 }`
- Returns: `{message: "Updated balance using PUT to update money 100  for id 5fca5c91f1c7152ec5d3023d"}`


**/accounts**

GET
- Gets all accounts 
- No request data
- Returns array of accounts, with _id, name, address & balance: `[{"_id": "5fca5c28bdd52a2ea127f318", "name": "Turin", "address": "The R.A.C.", "balance": 4700},{"_id": "5fca5c91f1c7152ec5d3023d", "name": "Dutch","address": "Lucy the  Spaceship", "balance": 970}]` 

POST
- Create new account
- Sends name, address & balanace details needed to create a new account :`{"name":"Pree", "address":"The Royale", "balance":5000 }`
- Returns message when new account is created ??: `{"message": "inserted new account for: Turin" }`

PUT
- Transfers money from one account to another
- Sends via Post Body:  `{"amount":100, "idFrom":"5fca5c28bdd52a2ea127f318", "idTo":"5fca5c01bdd52a2ea127f317" }`
- Returns message - `{
    "message": "Updated balance using PUT to update money 100  for accountIDFrom 5fca5c28bdd52a2ea127f318  to accountIDTo 5fca5c01bdd52a2ea127f317 "
}`




