const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('eval/nuevaEvaluacion');
});

router.post('/eva', (req, res) => {
    res.send('creo  que ya')
})

module.exports = router