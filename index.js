const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth'); // Rutas de autenticación
const apiRoutes = require('./routes'); // Otras rutas protegidas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', apiRoutes);       // Rutas protegidas

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
