
var mysql = require('mysql2/promise');

const pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        :process.env.DB_PASS,
  database        : process.env.DB_NAME,
  multipleStatements: true
});

pool.on('connection', function(connection) {
  console.log('Connected to MySql db');
});

pool.on('error', function(err) {
  console.log('Something went wrong with the database connection');

});


module.exports = pool;