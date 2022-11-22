const express = require('express');
const router = express.Router();

router.get('citas', (req, res) => {
    res.render('citas/nuevaCita');
});

router.post('/citas', (req, res) => {

})

module.exports = router;