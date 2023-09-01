const { Product, Category } = require('../db.js'); // Importamos los modelos de la base de datos
const { Op } = require("sequelize");

// Función para quitar los acentos o tildes de una cadena
function quitarAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

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


   // Obtener todos los productos con sus categorías y filtros aplicados

   async getAll(req, res) {
    try {
        const { name, brand, maker, model, priceOrder, category, limit = 10, page = 1 } = req.query;
        let whereConditions = {};
        let orderConditions = [];

        if (name) whereConditions.name = { [Op.iLike]: `%${name}%` };
        if (brand) whereConditions.brand = { [Op.iLike]: `%${brand}%` };
        if (maker) whereConditions.maker = { [Op.iLike]: `%${maker}%` };
        if (model) whereConditions.model = model;
        if (priceOrder) orderConditions.push(['price', priceOrder.toUpperCase()]);

        // Cálculo del offset
        const offset = (page - 1) * limit;

        const products = await Product.findAll({
            where: whereConditions,
            order: orderConditions.length > 0 ? [orderConditions] : undefined,
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                    where: category ? {
                        name: {
                            [Op.iLike]: `%${quitarAcentos(category).toLowerCase()}%`
                        }
                    } : undefined
                }
            ]
        });

        // Obtener el número total de productos que cumplen con la condición
        const totalProducts = await Product.count({
            where: whereConditions,
        });

        // Enviar la respuesta
        res.status(200).json({
            data: products || [],
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error });
    }
},




    // encontrar el detalle por id

    async getById(req, res) {
        try {
            const { id } = req.params;

            // Buscar el producto por su ID en la base de datos
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ['name'] // Obtener solo el nombre de la categoría
                    }
                ]
            });

            if (!product) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el producto por ID', error });
        }
    }
};

     



module.exports = ProductController;