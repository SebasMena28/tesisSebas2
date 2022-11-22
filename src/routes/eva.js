const express = require('express');
const router = express.Router();

router.get('/eva', (req, res) => {
    res.render('eval/evaluacion');
});

router.post('/eva', (req, res) => {

})

module.exports = router