import { Router } from "express";
import CartManager from '../daos/filesManager/CartManager.js';
import CartManagerMongo from "../daos/mongoManager/mongoCartManager.js";
import ProductManagerMongo from "../daos/mongoManager/mongoProductManager.js";

const cartsRoutes = Router();

let cartManager = new CartManager('./src/data/carts.json');
const cartMongoService = new CartManagerMongo()
const productMongoService = new ProductManagerMongo()

// CREATE CART 
cartsRoutes.post('', async (req, res) => {
    try {
        let newCart = await cartMongoService.addCart()
        res.send({
            status: 'success',
            payload: newCart
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});

    
// READ CART
cartsRoutes.get('', async (req, res) => {
    let carts = await cartMongoService.getCarts()
    let limit = req.query.limit;
    if (!limit) return res.send({ status: "success", payload: carts });

    let cartLimit = carts.filter((cart, indice) => indice < limit);

    res.send({ status: "success", payload: cartLimit })

})
// READ CART BY ID 
cartsRoutes.get('/:cid', async (req, res) => {
    let cid = req.params.cid;
    try {
        let cart = await cartMongoService.getCartById(cid)
        let productsCart = cart.products
        res.send({ productsCart })

    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})
// ADD PRODUCT TO CART 
cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
    try{
    let cid = req.params.cid
    let pid = req.params.pid
    let quantity = req.query.q
    !quantity ? quantity = 1 : quantity = quantity
    await productMongoService.getProductById(pid)
    let addProduct = await cartMongoService.addProductToCart(cid, pid, quantity);
    res.send({ status: 'succes', message: addProduct })}catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});
// DELETE PRODUCT TO CART 
cartsRoutes.delete('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    try{
    let deleteProduct = await cartMongoService.deleteProductToCart(cid, pid);
    res.send({ status:'success', message: deleteProduct })}catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })}
});
// DELETE CART 
cartsRoutes.delete('/:pid', async (req, res) => {
    
    try {
        let pid = req.params.pid
    let cartDelete = await cartMongoService.deleteCart(pid);
        res.send({ status: 'success', payload:cartDelete })

    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});

export default cartsRoutes