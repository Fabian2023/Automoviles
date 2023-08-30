const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes')

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/', productRoutes);
router.use('/create', productRoutes);
router.use('/update', productRoutes);
router.use('/users', userRoutes);


module.exports = router;
