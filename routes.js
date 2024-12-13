
const express = require('express');
const pool = require('./db');
const { verifyToken } = require('./middlewares'); // Middleware para validar JWT

const router = express.Router();

// Ruta para obtener productos sin autenticación
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta protegida para crear productos (requiere autenticación)
router.post('/products', verifyToken, async (req, res) => {
  const { name, description, price, image } = req.body;
  const userId = req.user.id;  // Suponiendo que en el middleware verifyToken se coloca el id del usuario en req.user

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }

  try {
    // Si no se proporciona una imagen, usa la imagen por defecto
    const imageUrl = image || `${req.protocol}://${req.get('host')}/static/default-product.jpg`;

    // Guardar el producto en la base de datos, ahora incluyendo el user_id
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image, user_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [name, description || 'Sin descripción', price, imageUrl, userId]
    );

    res.status(201).json({
      message: 'Producto creado',
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Ruta para obtener los productos del usuario autenticado
router.get('/user/products', verifyToken, async (req, res) => {
  const userId = req.user.id;  // El ID del usuario desde el token

  try {
    const result = await pool.query('SELECT * FROM products WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos del usuario' });
  }
});







module.exports = router;
