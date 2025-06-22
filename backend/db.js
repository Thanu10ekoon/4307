// db.js
const mysql = require('mysql');

const db = mysql.createConnection({ 
    host: 'b0wfogeparw9tbiqltdk-mysql.services.clever-cloud.com',
    user: 'uc7re1qyvlgndxfc',
    password: 'oZnz8f4VAR5MSl4lutJ5',
    database: 'b0wfogeparw9tbiqltdk'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error!', err);
    } else {
        console.log('MySQL connected');
    }
});

// Export db
module.exports = db;
