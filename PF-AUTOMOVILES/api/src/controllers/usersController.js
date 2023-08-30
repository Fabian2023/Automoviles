const { Users } = require('../db.js'); // Asegúrate de importar el modelo correcto

async function createUser(req, res) {
    try {
        // Obtener los datos del usuario desde el cuerpo de la solicitud
        const userData = req.body;

        // Crear el usuario en la base de datos utilizando el modelo
        const newUser = await Users.create(userData);

        // Enviar una respuesta exitosa con el nuevo usuario creado
        res.status(201).json(newUser);
    } catch (error) {
        // Enviar una respuesta de error si ocurre algún problema
        res.status(400).json({ mensaje: 'Error al crear el usuario', error });
    }
}

module.exports = {
    createUser
};
