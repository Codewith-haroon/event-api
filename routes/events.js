const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/events.json');

// Get all events
router.get('/', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

// Add new event
router.post('/', (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });

    const events = JSON.parse(data);
    const newEvent = { id: events.length + 1, name, date };
    events.push(newEvent);

    fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save data' });
      res.status(201).json(newEvent);
    });
  });
});

module.exports = router;
