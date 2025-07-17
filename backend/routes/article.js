const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');

router.post('/', async (req, res) => {
  const { text, keywords, action } = req.body;

  try {
    await ollamaService.processRequest(text, keywords, action, res);
    // res.send(response);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Error processing request');
  }
});

module.exports = router;
