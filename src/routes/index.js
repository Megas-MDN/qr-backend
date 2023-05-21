const errorHandler = require('../middlewares/errorHandler');
const getToken = require('../middlewares/getToken');
const notImplemented = require('../middlewares/notImplemented');
const userCont = require('../controllers/userController');
const hostCont = require('../controllers/hostController');
const prodCont = require('../controllers/productController');

const router = require('express').Router();
router.get('/', (_req, res) => res.status(200).json({ message: 'Server Up' }));
router.get('/role', getToken, userCont.getRole);

router.get('/host', getToken, hostCont.getProducts);
router.get('/host/all', getToken, hostCont.getAllHost);

router.post('/product', getToken, prodCont.createProduct);
router.get('/product/:id', prodCont.getProductById);

router.delete('/product/:id/:userId', getToken, prodCont.removeProduct);

router.post('/register', userCont.goRegister);
router.post('/login', userCont.goLogin);

router.use(notImplemented);
router.use(errorHandler);
module.exports = router;
