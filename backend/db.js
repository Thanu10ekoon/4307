// db.js
const mysql = require('mysql');

const dbConfig = {
    host: 'b0wfogeparw9tbiqltdk-mysql.services.clever-cloud.com',
    user: 'uc7re1qyvlgndxfc',
    password: 'oZnz8f4VAR5MSl4lutJ5',
    database: 'b0wfogeparw9tbiqltdk',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: true
};

// Use connection pool for better connection management
const db = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10,
    queueLimit: 0
});

// Test initial connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection error!', err);
    } else {
        console.log('MySQL connected');
        connection.release();
    }
});

// Export db
module.exports = db;
