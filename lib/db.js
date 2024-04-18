import mysql from 'mysql';
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'llinh666',
  port: '3306',
  database: 'database_work1',
});

module.exports = connection;