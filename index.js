const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL 
}));

app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use('/static', express.static('public/static'));  // 

// Rutas
app.use('/api', routes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
