const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/events', eventsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Event API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
