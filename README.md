# banking-api
RESTful Banking API with Killjoys Characters as Customers

## To Install
1. Clone repo locally & `cd` to directory
2. Run `npm install`
3. Create a local MongoDB database called `banking`
4. If your local MongoDB needs a username & password to connect, add them to `index.js` - see lines 17-19 for example formats
5. Create a collection called `accounts` & import data from file `banking-accounts.json`
6. Run `nodemon index.js`
7. Navigate to `htt://localhost:3008` in browser to test its running - you should see `'Hello, banking API is running`
8. Use Postman or similar to submit requests, using the below routes

## API Feature/Routes

- Create new account (should have a name, address and balance)
- Add money to an account
- Wthdraw money from an account 
- Transfer money from one account to another
- Get all accounts
- Get specific account by ID 

### Scenarios & Examples using Killjoys Characters
Killjoys is a scifi tv series about Dutch, Johnny & Davin, who are all bounty hunters in the Quad solar system.
Their friend Pree, runs The Royale bar in Old Town, on a planet called Westerley. Turin manages The RAC, where the trio work and sends them off on missions. The currency used within the Quad is called Joy.

- CREATE Davin is new to the team and needs to open an account, and add 80 credits in cash

- Johnny lost a wager to Davin, he checks his balance and transfers 20 credits to Davin

- Dutch needs some info from a local monk and withdraws 50 in cash to donate to his cause

- PUT Its the end of the month. Turin has to pay their salary according to their level at the RAC.
Turin pays Dutch 1000 credits, Johnny 600 and Davin 800

- The trio meetup at the Royale and its Dutch's round. She pays Pree 25 credits for drinks & snacks

- Their arch nemesis hacks into the bank and checks out everyones balance 

EG ROUTES from Aptitude Test

**/accounts**

GET
- Gets all accounts
- No request data
- Returns array of accounts, with _id, name, address & balance: 
`[
  {
  "_id": "5fca5c01bdd52a2ea127f317",
  "fullname": "John Andras Jaqobis",
  "nickname": "Johnny",
  "location": "Onboard Lucy the spaceship",
  "balance": 1077
  },
  {
  "_id": "5fca5c28bdd52a2ea127f318",
  "fullname": "Alfred Olyevich Turin",
  "nickname": "Turin",
  "location": "The R.A.C.",
  "balance": 4700
  },
  {
  "_id": "5fca5c91f1c7152ec5d3023d",
  "fullname": "Yalena Yardeen",
  "nickname": "Dutch",
  "location": "Onboard Lucy the Spaceship",
  "balance": 970
  }
  ]`

POST
- Create new account. 
- EG Davin is the newest member of the team so  needs to create an account & pay in 50 joy
- Sends fullname, nickname, location & balance details needed to create a new account, via POST Body :`{"fullname":"Davin Jaqobis", "nickname":"Davin", "location":"Onboard Lucy the Spaceship", "balance":50 }`
- Returns message when new account is created: `{"message": "Created new account for: Davin" }`

PUT
- Transfers money from one account to another
- EG Its the end of the month. Turin has to pay their salary according to their rank at the RAC.
  Turin pays Dutch 1000 joy, Johnny 600 and Davin 800
- Sends amount, idFrom, idTo, via POST Body:  `{"amount":1000, "idFrom":"5fca5c28bdd52a2ea127f318", "idTo":"5fca5c91f1c7152ec5d3023d" }`
- Returns message - `{
  "message": "Updated balance using PUT to update money 1000 for accountIDFrom 5fca5c28bdd52a2ea127f318 to accountIDTo 5fca5c91f1c7152ec5d3023d "
  }`

**/accounts/{id}**

GET
- Gets specific account by ID
- EG Get Dutch's account balance
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





