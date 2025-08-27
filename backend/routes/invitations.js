// routes/invitations.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Send invitations
router.post('/send', (req, res) => {
const { event_id, recipient_emails } = req.body;

if (!event_id || !Array.isArray(recipient_emails) || recipient_emails.length === 0) {
return res.status(400).json({ error: 'Missing event ID or recipient emails' });
}

const values = recipient_emails.map((email) => [event_id, email]);

db.query(
'INSERT INTO invitations (event_id, recipient_email) VALUES ?',
[values],
(err) => {
if (err) {
console.error('Invitation send error:', err);
return res.status(500).json({ error: 'Server Error' });
}
res.json({ msg: 'Invitations Sent' });
}
);
});

// RSVP with invitation ID
router.post('/rsvp', (req, res) => {
const { invitation_id, response } = req.body;

if (!invitation_id || !response) {
return res.status(400).json({ error: 'Missing invitation ID or response' });
}

db.query(
'UPDATE invitations SET response = ? WHERE id = ?',
[response, invitation_id],
(err) => {
if (err) {
console.error('RSVP update error:', err);
return res.status(500).json({ error: 'Server Error' });
}
res.json({ msg: 'RSVP updated' });
}
);
});

// RSVP using event_id and recipient_email
router.post('/respond', (req, res) => {
const { event_id, recipient_email, response } = req.body;

if (!event_id || !recipient_email || !response) {
return res.status(400).json({ error: 'Missing required RSVP fields' });
}

db.query(
'UPDATE invitations SET response = ? WHERE event_id = ? AND recipient_email = ?',
[response, event_id, recipient_email],
(err) => {
if (err) {
console.error('RSVP respond error:', err);
return res.status(500).json({ error: 'Server Error' });
}
res.json({ message: 'RSVP recorded' });
}
);
});

// Get invitations for a recipient
router.get('/for-user/:email', (req, res) => {
const { email } = req.params;

db.query(
'SELECT * FROM invitations WHERE recipient_email = ?',
[email],
(err, results) => {
if (err) {
console.error('Fetch invitations error:', err);
return res.status(500).json({ error: 'Server Error' });
}
res.json(results);
}
);
});

// Send event cancellation notification
router.post('/notify-cancellation', (req, res) => {
    const { event_title, event_date, invitee_emails, creator_email } = req.body;

    if (!event_title || !invitee_emails || !Array.isArray(invitee_emails)) {
        return res.status(400).json({ error: 'Missing required fields for cancellation notification' });
    }

    res.json({ 
        message: 'Cancellation notifications sent successfully',
        notified_count: invitee_emails.length 
    });
});

// Send event update notification
router.post('/notify-update', (req, res) => {
    const { event_title, event_date, location, invitee_emails, creator_email, changes } = req.body;

    if (!event_title || !invitee_emails || !Array.isArray(invitee_emails)) {
        return res.status(400).json({ error: 'Missing required fields for update notification' });
    }

    // In a real application, you would send actual emails/notifications here
    console.log(`Event Updated: "${event_title}" scheduled for ${event_date} at ${location}`);
    console.log(`Changes: ${changes.join(', ')}`);
    console.log(`Notifying invitees: ${invitee_emails.join(', ')}`);
    console.log(`Updated by: ${creator_email}`);

    res.json({ 
        message: 'Update notifications sent successfully',
        notified_count: invitee_emails.length 
    });
});

module.exports = router;