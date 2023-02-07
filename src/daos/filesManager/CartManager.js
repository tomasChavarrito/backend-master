import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import ProductManager from './ProductManager.js';

let productManager = new ProductManager('./src/data/products.json');

class CartManager {
    constructor(path) {
        this.path = path
    }

    async addCart() {
        try {
            const savedCarts = await this.getCarts()
            const newId = savedCarts.length > 0 ? savedCarts[savedCarts.length - 1].id + 1 : 1
            const newCart = {
                id: newId,
                products: []
            }
            savedCarts.push(newCart)
            const cartListString = JSON.stringify(savedCarts, null, '\t')
            await writeFile(this.path, cartListString)
            return `cart id: ${newId} is load`
        }
        catch (error) {
            return error.message
        }
    }
    async getCarts() {
        try {
            if (existsSync(this.path)) {
                const carts = await readFile(this.path, 'utf-8')
                if (carts.length > 0) {
                    const parsedCarts = JSON.parse(carts)
                    return parsedCarts
                }
                else return []
            }
            else return []
        }
        catch (error) {
            return error.message
        }
    }

    async getCartById(id) {
        try {
            const savedCarts = await this.getCarts();
            const selectedCart = savedCarts.find(cart => cart.id === id)
            if (!selectedCart) {
                throw new Error(`there is no cart with id:${id}`)
            }
            return selectedCart
        }
        catch (error) {
            return error.message
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            const productExist = await productManager.getProductById(+pid)
            if (productExist === `there is no product with id:${pid}`) {
                throw new Error(`there is no product with id:${pid}`)
            }
            const savedCarts = await this.getCarts()
            const targetCart = await this.getCartById(cid)

            if (!targetCart.id > 0) {
                throw new Error(targetCart)
            }
            else {
                const targetProduct = await targetCart.products.find(product => product.product == pid)
                const updatedProduct = targetProduct ? { product: targetProduct.product, quantity: (targetProduct.quantity + +(quantity)) }
                    : { product: pid, quantity: +quantity }
                    
                    if (productExist.stock < quantity) {
                        throw new Error(`there is not enough quantity of the product:${productExist.id}`)
                    }   
                    productManager.updateProduct(productExist.id, {stock: productExist.stock-quantity})
                const targetCartFilter = await targetCart.products.filter(id => id.product !== pid)
                const updatedCart = { ...targetCart, products: [...targetCartFilter, updatedProduct] }
                const updatedList = savedCarts.map(cart => {
                    if (cart.id === cid) {
                        return updatedCart
                    } else {
                        return cart
                    }
                })
                const cartListString = JSON.stringify(updatedList, null, '\t')
                await writeFile(this.path, cartListString)
                return `product id: ${pid} add to cart id: ${targetCart.id} `
            }
        }
        catch (error) {
            return error.message
        }
    }
    async deleteProductToCart(cid, pid) {
        try {
            const savedCarts = await this.getCarts()
            const targetCart = await this.getCartById(cid)

            if (!targetCart.id > 0) {
                throw new Error(targetCart)
            }
            const targetProduct = await targetCart.products.find(product => product.product == pid)
            if (!targetProduct) {
                throw new Error(`there is no product with id:${pid}`)
            }
            else {
                const targetCartFilter = await targetCart.products.filter(id => id.product !== pid)
                const updatedCart = { ...targetCart, products: [...targetCartFilter] }
                const updatedList = savedCarts.map(cart => {
                    if (cart.id === cid) {
                        return updatedCart
                    } else {
                        return cart
                    }
                })
                const cartListString = JSON.stringify(updatedList, null, '\t')
                await writeFile(this.path, cartListString)
                return `product id: ${pid} delete to cart id: ${targetCart.id} `
            }
        }
        catch (error) {
            return error.message
        }
    }

    async deleteCart(id) {
        try {
            const savedCarts = await this.getCarts();
            const targetCart = await this.getCartById(id)
            const filteredList = savedCarts.filter(cart => cart.id !== id)
            if (!targetCart.id > 0) {
                throw new Error(targetCart)
            }
            else {
                const cartListString = JSON.stringify(filteredList, null, '\t')
                await writeFile(this.path, cartListString)
                return `removed cart id: ${targetCart.id} `
            }
        }
        catch (error) {
            return error.message
        }
    }
}

export default CartManager;