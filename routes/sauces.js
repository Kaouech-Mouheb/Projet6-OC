const express = require('express'); 
const router = express.Router(); 

const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config'); 
const saucesCtrl = require('../controllers/sauces'); 

router.post('/', auth, multer, saucesCtrl.sauceCreated);
router.put('/:id', auth, multer, saucesCtrl.sauceModified);
router.delete('/:id', auth, saucesCtrl.sauceDeleted);
router.get('/:id', auth, saucesCtrl.getSauce);
router.get('/', auth, saucesCtrl.getSauces);
router.post('/:id/like', auth, saucesCtrl.liked)

module.exports = router;
