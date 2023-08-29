const { Product, Category } = require('../db.js');


const ProductController = {

    // Crea un nuevo producto (automovil)

    async create(req, res) {
        try{
            const productsInput = Array.isArray(req.body) ? req.body : [req.body];
            const products = [];

            for (const productInput of productsInput){
                // crear un nuevo producto
                const newProduct = await Product.create(productInput);

                // obtener categorias del producto
                const categories = productInput.category;

                if ( categories && categories.length > 0 ){
                    // buscar las categorias en la base de datos
                    const categoriesExistentes = await Category.findAll({
                        where: {
                            name: categories
                        }
                    });

                     // Filtrar categoria que no existen en la base de datos
                     const categoriessNoExistentes = categories.filter(
                        gen => !categoriesExistentes.map(g => g.name).includes(gen)
                    );

                    // Crear nuevos géneros
                    const newCategories = await Category.bulkCreate(
                        categoriessNoExistentes.map(name => ({ name })),
                        { returning: true }
                    );

                    // Asociar géneros con el libro
                    await newProduct.setCategories([...categoriesExistentes, ...newCategories]);
                }

                products.push(newProduct);
                
            }

            res.status(201).json(products);

        } catch (error) {
            res.status(400).json({ mensaje: "Error al crear nuevos productos", error });
        }
    },


    // Actualiza un producto (automovil)

    async update(req, res) {
        try {
            const { id } = req.params;
            const productInput = req.body;

            // Buscar el producto por su ID
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            // Actualizar las propiedades del producto
            await product.update(productInput);

            // Si se proporcionan nuevas categorías
            const { category } = productInput;
            if (category && category.length > 0) {
                const categoriesExistentes = await Category.findAll({
                    where: {
                        name: category
                    }
                });

                const categoriessNoExistentes = category.filter(
                    gen => !categoriesExistentes.map(g => g.name).includes(gen)
                );

                const newCategories = await Category.bulkCreate(
                    categoriessNoExistentes.map(name => ({ name })),
                    { returning: true }
                );

                await product.setCategories([...categoriesExistentes, ...newCategories]);
            }

            res.status(200).json({ mensaje: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al actualizar el producto', error });
        }
    },

     // Obtener todos los productos con sus categorías
     async getAll(req, res) {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['name'] // Obtener solo el nombre de la categoría
                    }
                ]
            });

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los productos', error });
        }
    }

     
}


module.exports = ProductController;