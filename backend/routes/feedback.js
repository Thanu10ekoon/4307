// routes/feedback.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit feedback
router.post('/submit', (req, res) => {
    const { event_id, user_email, message } = req.body;

    db.query(
        'INSERT INTO event_feedback SET ?',
        { event_id, user_email, message },
        (err) => {
            if (err) {
                console.error('Submit Feedback Error:', err);
                return res.status(500).json({ error: 'Server Error' });
            }
            res.json({ msg: 'Feedback Submitted' });
        }
    );
});

// Get feedback for a specific event
router.get('/event/:id', (req, res) => {
    const eventId = req.params.id;

    db.query(
        'SELECT user_email, message FROM event_feedback WHERE event_id = ?',
        [eventId],
        (err, results) => {
            if (err) {
                console.error('Fetch Feedback Error:', err);
                return res.status(500).json({ error: 'Server Error' });
            }
            res.json(results);
        }
    );
});

// Export router
module.exports = router;
