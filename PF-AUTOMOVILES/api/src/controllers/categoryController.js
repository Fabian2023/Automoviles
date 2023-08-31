const { Category } = require('../db.js');

const CategoryController = {
    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            if (categories.length > 0) {
              res.status(200).json(categories);
            } else {
              res.status(404).json({ message: "No se encontraron categorías" });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Se produjo un error en el servidor" });
          }
    }
}

module.exports = CategoryController;