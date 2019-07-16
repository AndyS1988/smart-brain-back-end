const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./Controllers/signin');
const register = require('./Controllers/register');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  	ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('It is working!') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/profile/emailChange', (req, res) => { profile.hadleProfileEmailPut(req, res, db) })
app.put('/profile/passwordChange', (req, res) => { profile.hadleProfilePasswordPut(req, res, db, bcrypt) })
app.delete('/profile/delete', (req, res) => { profile.hadleProfileDelete(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
	console.log(`App is running on port ${process.env.PORT}`);
})
