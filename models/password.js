const passwordValidator = require('password-validator');

// Schéma de mot de passe plus sécure
const passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
.is().min(8)                                    // Longueur minimun :8
.has().uppercase()                              // au moins une majuscule
.has().lowercase()                              // au moins une minuscule
.has().digits()                                 // au moins un chiffre
.has().not().spaces()                           // pas avoir d'esapces
module.exports = passwordSchema;
