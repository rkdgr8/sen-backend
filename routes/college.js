const express = require('express');
const collegeController = require('../controllers/college');
const signInController = require('../controllers/signin');

const router = express.Router();

router.get('/:collegeId', collegeController.getCollege);
router.get('/search/:query', collegeController.searchCollege);


if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
  router.use(signInController.isAuthenticated);
}
router.get('/', collegeController.getAllColleges);
router.post('/add', collegeController.addCollege);
router.put('/update', collegeController.updateCollege);
router.delete('/:collegeId', collegeController.deleteCollege);


module.exports = router;
