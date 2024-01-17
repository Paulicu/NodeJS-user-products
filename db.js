const mysql = require('mysql2/promise');

// Se creeaza un pool de conexiuni mySQL = colectie de conexiuni la db care pot fi refolosite.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestionare_produse',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool; // Se exporta obiectul pool, pentru a fi utilizat mai departe in aplicatie.