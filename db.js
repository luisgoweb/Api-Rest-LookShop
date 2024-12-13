const { Pool } = require('pg');
require('dotenv').config(); 

// Configuración del pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,  
  port: process.env.DB_PORT || 5432, 
  ssl: { rejectUnauthorized: false }
});

// Probar la conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos', err.stack);
  }
  console.log('Conexión exitosa a la base de datos');
  release(); // Liberar el cliente después de la conexión
});

module.exports = pool;
