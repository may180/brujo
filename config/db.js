const mysql = require('mysql2');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'maikol2'
  };
  
  

const connection = mysql.createConnection(dbConfig);
  
  
  module.exports = connection;