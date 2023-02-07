import productModel from '../models/productModel.js'


class ProductManagerMongo {
    
    async getProducts( page, limit, order, available, category) {
        
        try {
            const products = await productModel.paginate(
                {"stock": available, category: category},
                {page: page,limit: limit, sort: order})
            return products
        } catch (error) {
            throw new Error(error.message)
        }
    }

     async getProductById(id) {
        try{
            const product = await productModel.findById(id)
            if(!product){
                throw new Error('ERROR: no product matches the specified ID')
            }
            return product
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProduct(product) {
        try{
            const newProduct = {
                status: product.status || true,
                ...product
            }
            await productModel.create(newProduct)
            console.log(`${product.title} added`)
            return newProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const updatedProduct = await productModel.updateOne({_id: id}, product)
            console.log(`${id} modified`)
            return updatedProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const deletedProduct = await productModel.deleteOne({_id: id})
            console.log(`product deleted`)
            return deletedProduct   
        }
        catch(error){
            throw new Error(error.message)
        }
    }

}

export default ProductManagerMongo