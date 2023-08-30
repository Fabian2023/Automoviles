const { Product } = require('../db.js'); // Asegúrate de importar el modelo correcto

async function carDetail(req, res) {
  try {
    const { id } = req.params;

    // Buscar el producto por su ID en la base de datos
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Devolver el detalle del producto como respuesta
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el detalle del producto', error });
  }
}

module.exports = {
  carDetail,
  // Otros controladores aquí
};
