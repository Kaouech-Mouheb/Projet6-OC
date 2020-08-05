const express = require('express');
//Analyser les corps de requête entrants 
const bodyParser = require('body-parser');
//Mongoose est un outil de modélisation d'objets MongoDB
const mongoose = require('mongoose');
//module path
const path = require('path');
//Helmet permet de sécuriser vos applications Express en définissant divers en-têtes HTTP
const helmet = require('helmet');

const session = require('express-session');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//permet de charger les variables d'environnement
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use((req, res, next) => {
  //on permet d'accéder à notre API depuis n'importe quelle origine ( '*'
  res.setHeader('Access-Control-Allow-Origin', '*');
  //permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //permet d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//Stockage de session basé sur MongoDB pour connect et Express
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: process.env.DB_CONNECT, // une chaîne de connexion MongoDB
  collection: 'mySessions' //la collection MongoDB pour stocker les sessions
});
 
//  Attraper les erreurs
store.on('error', function(error) {
  console.log(error);
});
 
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));
 
app.get('/', function(req, res) {
  res.send('Hello ' + JSON.stringify(req.session));
});

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

