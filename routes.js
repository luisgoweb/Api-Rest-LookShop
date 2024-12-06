const express = require('express');
const pool = require('./db'); // Conexión a la base de datos
const { verifyToken } = require('./middlewares'); // Middleware para validar tokens

const router = express.Router();

// Ruta protegida para obtener productos (necesita token)
router.get('/products', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
