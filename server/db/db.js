var mysql = require('mysql2');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.HOST,
  user            : process.env.DBUSER,
  password        : process.env.PASSWORD,
  database        : process.env.DATABASE,
  waitForConnections: true,
  queueLimit: 0
});
module.exports = pool