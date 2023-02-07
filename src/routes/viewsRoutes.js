import { Router } from "express";
import ProductManager from '../daos/filesManager/ProductManager.js';
import { uploader } from "../utils.js";
import ProductManagerMongo from "../daos/mongoManager/mongoProductManager.js";
import CartManagerMongo from "../daos/mongoManager/mongoCartManager.js";

const viewsRoutes = Router();
let productManager = new ProductManager('./src/data/products.json');
const productMongoService = new ProductManagerMongo()
const cartMongoService = new CartManagerMongo()

viewsRoutes.get('/home', async (req, res) => {
    const products = await productMongoService.getProducts(1,10,"")
    const limit = req.query.limit
    if (!limit) {
        return res.render('home', {
            products: products.docs.map(product => product.toJSON()),
            title: 'Products'
        })
    }
    const limitedProducts = products.slice(0, limit)
    res.render('home', {
        products: limitedProducts,
        title: 'Products'
    })
})

viewsRoutes.get('/realtimeproducts', async (req, res) => {
    const products = await productMongoService.getProducts(1,10,"")
    const limit = req.query.limit
    if (!limit) {
        return res.render('realTimeProducts', {
            products: products.docs.map(product => product.toJSON()),
            title: 'Real Time Products'
        })
    }
    const limitedProducts = products.slice(0, limit)
    res.render('realTimeProducts', {
        products: limitedProducts,
        title: 'Real Time Products'
    })
})

viewsRoutes.post('/realtimeproducts', uploader.array('thumbnail'), async (req, res) => {
    const newProduct = req.body
    let thumbnail = req.files ? (req.files.map(file => `/img/${file.originalname}`)) : [];
    newProduct.thumbnail = thumbnail
    let statusProduct = (newProduct.status) ? newProduct.status.toLowerCase() === "true" ? true : false : true
    let productJson = {
        ...newProduct,
        thumbnail: thumbnail,
        price: +(newProduct.price),
        stock: +(newProduct.stock),
        status: statusProduct
    }
    const createProduct = await productManager.addProduct(productJson)

    const socket = req.app.get('socket')
    console.log(productJson)
    if (!newProduct) {
        return res.status(400).send({
            error: 'missing product'
        })
    }
    socket.emit('newProduct', newProduct)
    res.send({
        status: 'success',
        payload: createProduct
    })
})


viewsRoutes.get('/chat', (req, res) => {

    res.render('chat', {})
})

viewsRoutes.get('/cart/:cid', async (req, res) => {
    const cartId = req.params.cid 
    try {
        const cart = await cartMongoService.getCartById(cartId)
        res.render('cart', {
            title: "Cart",
            products: cart.products,
            cartId: cart._id
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

export default viewsRoutes