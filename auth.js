const express = require('express');
const pool = require('./db'); // Conexión a la base de datos
const bcrypt = require('bcrypt'); // Cambiar a 'bcryptjs' si lo instalaste
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Registrar usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar datos en la base de datos
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generar un token JWT
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    // Enviar respuesta con el token
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error en la ruta de registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


  

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Buscar el usuario por email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Enviar el token en la respuesta
    res.json({ token });
  } catch (err) {
    console.error('Error en la ruta de login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


module.exports = router;
