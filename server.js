const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventsRouter = require('./routes/events'); // ✅ correct file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/events', eventsRouter); // ✅ use /api/events

// Root endpoint
app.get('/', (req, res) => {
  res.send('Kalvium EventHub API is running!');
});

// Star
