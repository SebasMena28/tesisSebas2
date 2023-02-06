const express = require('express');
const router = express.Router();

router.get('/inicio', async (req, res) => {
    res.redirect('/inicio/inicio');
});