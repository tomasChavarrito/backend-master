import { Router } from "express";
import ProductManager from '../daos/filesManager/ProductManager.js';
import { uploader } from "../utils.js";
import ProductManagerMongo from "../daos/mongoManager/mongoProductManager.js";
import options from "../config/options.js";

const productsRoutes = Router();

let productManager = new ProductManager(options.fileSystem.productsFileName);
const productMongoService = new ProductManagerMongo()

// CREATE PRODUCT 
productsRoutes.post('', uploader.array('thumbnail'), async (req, res) => {

    try {
        let product = req.body
        let thumbnail = req.files ? (req.files.map(file => `/img/${file.originalname}`)) : [];
        let productJson = {
            ...product,
            thumbnail: thumbnail,
        }
        const newProduct = await productMongoService.addProduct(productJson)
        res.send({
            status: 'success',
            message: newProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});

// READ PRODUCTS 
productsRoutes.get('/', async (req, res) => {
    const { page, limit, order, available, category } = req.query
    const nroPage = page?+page:1
    const nroLimit = limit?+limit:10
    const orderDirection = order?{price:order}:""
    const isAvailable = available?{$gt:1}:""
    const whitchCategory = category?category:""
    
    try {
        const products = await productMongoService.getProducts(nroPage,nroLimit, orderDirection, isAvailable, whitchCategory)

        return res.send({
            status: 'success',
            data: products

        })
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})
// READ PRODUCTS BY ID 
productsRoutes.get('/:pid', async (req, res) => {
    const id = req.params.pid
    try {
        const product = await productMongoService.getProductById(id)
        res.send({ product })

    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})
// UPDATE PRODUCT 
productsRoutes.put('/:pid', uploader.array('thumbnail'), async (req, res) => {
    let pid = req.params.pid
    let product = req.body

    const productId = req.params.pid
    try {
        let productTarget = await productManager.getProductById(pid)
        let price = (product.price) ? +(product.price) : productTarget.price;
        let stock = (product.stock) ? +(product.stock) : productTarget.stock;
        let statusProduct = (product.status) ? (product.status.toLowerCase() == "true") ? true : false : productTarget.status;
        let thumbnailWhat = req.files[0] ? (req.files.map(file => `/img/${file.originalname}`)) : productTarget.thumbnail;
        let productJson = { ...product, thumbnail: thumbnailWhat, price: price, stock: stock, status: statusProduct }
        let updateProduct = await productMongoService.updateProduct(pid, productJson);
        res.send({
            status: 'success',
            newProduct: updateProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }

});
// DELETE PRODUCT 
productsRoutes.delete('/:pid', async (req, res) => {
    const productId = req.params.pid
    try {
        const deleteProduct = await productMongoService.deleteProduct(productId)
        res.send({
            status: 'success',
            deletedProduct: deleteProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

export default productsRoutes