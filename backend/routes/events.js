// routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Create event
router.post('/create', (req, res) => {
    const { creator_email, title, event_date, location, reminders } = req.body;

    db.query('INSERT INTO events SET ?',
        { creator_email, title, event_date, location },
        (err, result) => {
            if (err) return res.status(500).json({error:'Server Error'})
            const eventId = result.insertId;

            // Insert event_reminders
            if (reminders && reminders.length) {
                let values = reminders.map(r => [eventId, r]);
                db.query('INSERT INTO event_reminders (event_id, days_before) VALUES ?',
                    [values],
                    (err) => {
                        if (err) return res.status(500).json({error:'Server Error'})
                        res.json({msg:'Event successfully created'})
                    });
            } else {
                res.json({msg:'Event successfully created'})
            }
        });
});

// Get events by creator
router.get('/created/:email', (req, res) => {
    db.query('SELECT * FROM events WHERE creator_email = ?',
        [req.params.email],
        (err, results) => {
            if (err) return res.status(500).json({error:'Server Error'})
            res.json(results);
        });
});

// Get event by id
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM events WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({error:'Server Error'})
            if (results.length == 0) return res.status(404).json({error:'Not found'})
            res.json(results[0]);
        });
});

// Get event's invitations
router.get('/:id/invitations', (req, res) => {
    db.query('SELECT * FROM invitations WHERE event_id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({error:'Server Error'})
            res.json(results);
        });
});

// Get event's feedback
router.get('/:id/feedback', (req, res) => {
    db.query('SELECT * FROM event_feedback WHERE event_id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({error:'Server Error'})
            res.json(results);
        });
});

// Export router
module.exports = router;
