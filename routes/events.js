const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/events.json');

// Helper: read events
function readEvents(callback) {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return callback(null, []);
      return callback(err);
    }
    try {
      const events = JSON.parse(data);
      callback(null, events);
    } catch (parseError) {
      callback(parseError);
    }
  });
}

// Helper: write events
function writeEvents(events, callback) {
  fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8', callback);
}

// POST /api/events → create event
router.post('/', (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  if (!title || !date || !location || !maxAttendees) {
    return res.status(400).json({ error: 'Title, date, location, and maxAttendees are required.' });
  }
  if (!Number.isInteger(maxAttendees) || maxAttendees <= 0) {
    return res.status(400).json({ error: 'maxAttendees must be a positive integer.' });
  }

  readEvents((err, events) => {
    if (err) return res.status(500).json({ error: 'Failed to read events data.' });

    const newEvent = {
      eventId: 'EVT-' + Date.now(),
      title,
      description: description || '',
      date,
      location,
      maxAttendees,
      currentAttendees: 0,
      status: 'upcoming'
    };

    events.push(newEvent);

    writeEvents(events, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save event.' });
      res.status(201).json(newEvent);
    });
  });
});

// GET /api/events → list events
router.get('/', (req, res) => {
  readEvents((err, events) => {
    if (err) return res.status(500).json({ error: 'Failed to read events data.' });
    res.json(events);
  });
});

module.exports = router;
