const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet')
const session = require('express-session');
const nocache = require('nocache');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use((req, res, next) => {
  //on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  //on indique les entêtes qui seront utilisées après la pré-vérification cross-origin (vérifie sur le protocole CORS est autorisé)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //n'autorise que ce serveur à fournir des scripts pour la page visitée
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: process.env.DB_CONNECT,
  collection: 'mySessions'
});
 
// Catch errors
store.on('error', function(error) {
  console.log(error);
});
 
app.use(require('express-session')({
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(nocache());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
