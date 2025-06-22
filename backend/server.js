// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRouter = require("./routes/auth");

const eventsRouter = require("./routes/events");

const invitationsRouter = require("./routes/invitations");

const feedbackRouter = require("./routes/feedback");

const app = express();

app.use(cors()); // enable CORS for React
app.use(bodyParser.json()); // parses application/json

// routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/invitations', invitationsRouter);
app.use('/api/feedback', feedbackRouter);

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
