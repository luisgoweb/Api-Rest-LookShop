const express = require('express');
const pool = require('./db'); // Conexión a la base de datos
const bcrypt = require('bcrypt'); // Cambiar a 'bcryptjs' si lo instalaste
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Registrar usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
      );
  
      res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
      console.error('Error en la ruta de registro:', err); // Agregar este log
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });
  

// Login de usuario
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
