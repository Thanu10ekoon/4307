// db.js
const mysql = require('mysql');

const db = mysql.createConnection({ 
    host: 'b0wfogeparw9tbiqltdk-mysql.services.clever-cloud.com',
    user: 'uc7re1qyvlgndxfc',
    password: 'oZnz8f4VAR5MSl4lutJ5',
    database: 'b0wfogeparw9tbiqltdk',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error!', err);
    } else {
        console.log('MySQL connected');
    }
});

// Handle connection errors
db.on('error', function(err) {
    console.log('Database connection error:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Attempting to reconnect...');
        setTimeout(() => {
            db.connect();
        }, 2000);
    } else {
        throw err;
    }
});

// Export db
module.exports = db;
