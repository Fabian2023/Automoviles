const express = require('express');
const UserController = require('../controllers/usersController'); // Asegúrate de importar el controlador correcto

const router = express.Router();

// Ruta para crear un usuario
router.post('/user', UserController.createUser);

// Otras rutas relacionadas con usuarios, como actualizar, eliminar, obtener, etc.
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);
// router.get('/user/:id', UserController.getUserById);
// router.get('/users', UserController.getAllUsers);

module.exports = router;
