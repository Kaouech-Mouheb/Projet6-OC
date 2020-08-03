// Contient les fonctions qui s'appliquent aux différentes routes pour les utilisateurs

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordControl = require('../middleware/passwordControl');

router.post('/signup', passwordControl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
