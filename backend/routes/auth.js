// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
    const { email, password, username } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({error:'Server Error'})
        db.query('INSERT INTO users SET ?',
            { email, password_hash: hash, username },
            (err) => {
                if (err) return res.status(500).json({error:'User already exists'})
                res.json({msg:'Signup successful'})
            });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
        if (err) return res.status(500).json({error:'Server Error'})
        if (results.length == 0) return res.status(400).json({error:'User not found'})
        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (err) return res.status(500).json({error:'Server Error'})
            if (match) res.json({msg:'Login successful'})
            else res.status(400).json({error:'Invalid password'})
        });
    });
});

// Get all users (for invitation picker)
router.get('/users', (req, res) => {
    db.query('SELECT email, username FROM users', (err, results) => {
        if (err) return res.status(500).json({error:'Server Error'})
        res.json(results);
    });
});

// Export router
module.exports = router;
