import cartModel from '../models/cartModel.js'
import productModel from '../models/productModel.js';


class CartManagerMongo {

     
    async getCarts() {
        try {
            const carts = await cartModel.find()
            return carts
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).lean()
            if (!cart) {
                throw new Error('ERROR: no product matches the specified ID')
            }
            return cart
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async addCart() {
        try {
            const newCart = {
                products: []
            }
            await cartModel.create(newCart)
            console.log(`Cart added`)
            return newCart
        }
        catch (error) {
            throw new Error(error.message)
        }
    }


    async addProductToCart(cid, pid, quantity) {
        try {
            const cartExist = await this.getCartById(cid)
            const productExist = cartExist.products.find(product => product.productId == pid)
            const setProductId = productExist ? productExist.productId : pid;
            const setQuantity = productExist ? quantity + productExist.quantity : quantity

            if (productExist != undefined) {
                const updatedProduct = await cartModel.findOneAndUpdate(
                    { _id: cid, 'products': { $elemMatch: { productId: setProductId } } },
                    { $set: { 'products.$.quantity': setQuantity } },
                    { new: true },
                );
                return updatedProduct
            } else {
                const updatedProduct =
                    await cartModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: quantity } } })
                return updatedProduct
            }

        }
        catch (error) {
            throw new Error(error.message)
        }
    };

    async deleteProductToCart(cid, pid) {
        try {
            const deleteProduct = await cartModel.findOneAndUpdate(

                { _id: cid, "products.productId": pid },
                { $pull: { "products": { "productId": pid } } },
            );
            return deleteProduct

        }
        catch (error) {
            throw new Error(error.message)
        }
    };

    async deleteCart(id) {
        try {
            const deletedProduct = await cartModel.deleteOne({ _id: id })
            console.log(`product deleted`)
            return deletedProduct
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

}

export default CartManagerMongo