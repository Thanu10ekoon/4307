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

// Get event's reminders
router.get('/:id/reminders', (req, res) => {
    db.query('SELECT days_before FROM event_reminders WHERE event_id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({error:'Server Error'})
            res.json(results.map(r => r.days_before));
        });
});

// Delete event
router.delete('/:id', (req, res) => {
    const eventId = req.params.id;
    const { creator_email } = req.body;

    // First, verify the user is the creator of the event
    db.query('SELECT creator_email FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) return res.status(500).json({error: 'Server Error'});
        if (results.length === 0) return res.status(404).json({error: 'Event not found'});
        if (results[0].creator_email !== creator_email) {
            return res.status(403).json({error: 'You can only delete your own events'});
        }

        // Get all invitees before deletion for notification
        db.query('SELECT recipient_email FROM invitations WHERE event_id = ?', [eventId], (err, invitees) => {
            if (err) return res.status(500).json({error: 'Server Error'});

            // Delete related records first (due to foreign key constraints)
            db.query('DELETE FROM event_feedback WHERE event_id = ?', [eventId], (err) => {
                if (err) return res.status(500).json({error: 'Server Error'});
                
                db.query('DELETE FROM event_reminders WHERE event_id = ?', [eventId], (err) => {
                    if (err) return res.status(500).json({error: 'Server Error'});
                    
                    db.query('DELETE FROM invitations WHERE event_id = ?', [eventId], (err) => {
                        if (err) return res.status(500).json({error: 'Server Error'});
                        
                        // Finally delete the event
                        db.query('DELETE FROM events WHERE id = ?', [eventId], (err) => {
                            if (err) return res.status(500).json({error: 'Server Error'});
                            
                            // Return success with invitee emails for notification
                            res.json({
                                message: 'Event deleted successfully',
                                invitees: invitees.map(inv => inv.recipient_email)
                            });
                        });
                    });
                });
            });
        });
    });
});

// Update event
router.put('/:id', (req, res) => {
    const eventId = req.params.id;
    const { creator_email, title, event_date, location, reminders } = req.body;

    // First, verify the user is the creator of the event
    db.query('SELECT creator_email FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) return res.status(500).json({error: 'Server Error'});
        if (results.length === 0) return res.status(404).json({error: 'Event not found'});
        if (results[0].creator_email !== creator_email) {
            return res.status(403).json({error: 'You can only update your own events'});
        }

        // Get all invitees for notification
        db.query('SELECT recipient_email FROM invitations WHERE event_id = ?', [eventId], (err, invitees) => {
            if (err) return res.status(500).json({error: 'Server Error'});

            // Update the event
            db.query('UPDATE events SET title = ?, event_date = ?, location = ? WHERE id = ?',
                [title, event_date, location, eventId],
                (err) => {
                    if (err) return res.status(500).json({error: 'Server Error'});

                    // Delete existing reminders and insert new ones
                    db.query('DELETE FROM event_reminders WHERE event_id = ?', [eventId], (err) => {
                        if (err) return res.status(500).json({error: 'Server Error'});

                        // Insert new reminders if any
                        if (reminders && reminders.length) {
                            let values = reminders.map(r => [eventId, r]);
                            db.query('INSERT INTO event_reminders (event_id, days_before) VALUES ?',
                                [values],
                                (err) => {
                                    if (err) return res.status(500).json({error: 'Server Error'});
                                    res.json({
                                        message: 'Event updated successfully',
                                        invitees: invitees.map(inv => inv.recipient_email)
                                    });
                                });
                        } else {
                            res.json({
                                message: 'Event updated successfully',
                                invitees: invitees.map(inv => inv.recipient_email)
                            });
                        }
                    });
                });
        });
    });
});

// Export router
module.exports = router;
