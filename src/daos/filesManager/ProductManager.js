import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(product) {
        try {
            const savedProducts = await this.getProducts()
            const DuplicatedProduct = savedProducts.find(item => item.code == product.code)
            if (DuplicatedProduct) {
                throw new Error(`The code ${product.code} has already been registered`)
            }
            for (const key in product) {
                if (
                    key !== "id"
                    && key !== "title"
                    && key !== "description"
                    && key !== "price"
                    && key !== "code"
                    && key !== "thumbnail"
                    && key !== "status"
                    && key !== "stock"
                    && key !== "category"
                ) {
                    return `${key} is not an allowed field`
                }
            };
            if (product.id) {
                throw new Error(`You should NOT add an id. It's automatic`)
            }
            if (!product.title) {
                throw new Error(`title is required`)
            }
            if (!product.description) {
                throw new Error(`description is required`)
            }
            if (!product.price || typeof product.price === 'string') {
                throw new Error(`price is required and must be a number`)
            }
            if (!product.stock || typeof product.stock === 'string') {
                throw new Error(`stock is required and must be a number`)
            }
            if (!product.category) {
                throw new Error(`category is required`)
            }
            if (!product.code) {
                throw new Error(`code is required`)
            }

            const newId = savedProducts.length > 0 ? savedProducts[savedProducts.length - 1].id + 1 : 1
            const newProduct = {
                id: newId,
                ...product
            }
            savedProducts.push(newProduct)
            const productListString = JSON.stringify(savedProducts, null, '\t')
            await writeFile(this.path, productListString)
            return `product code: ${product.code} is load`
        }
        catch (error) {
            return error.message
        }
    }

    async getProducts() {
        try {
            if (existsSync(this.path)) {
                const products = await readFile(this.path, 'utf-8')
                if (products.length > 0) {
                    const parsedProducts = JSON.parse(products)
                    return parsedProducts
                }
                else return []
            }
            else return []
        }
        catch (error) {
            return error.message
        }
    }

    async getProductById(id) {
        try {
            const savedProducts = await this.getProducts();
            const selectedProduct = savedProducts.find(prod => prod.id === id)
            if (!selectedProduct) {
                throw new Error(`there is no product with id:${id}`)
            }
            return selectedProduct
        }
        catch (error) {
            return error.message
        }
    }

    async updateProduct(id, product) {
        try {
            const savedProducts = await this.getProducts()
            const targetProduct = await this.getProductById(id)
            if (product.id) {
                return "It is strictly forbidden to modify the id"
            }
            for (const key in product) {
                if (
                    key !== "id"
                    && key !== "title"
                    && key !== "description"
                    && key !== "price"
                    && key !== "code"
                    && key !== "thumbnail"
                    && key !== "status"
                    && key !== "stock"
                    && key !== "category"
                ) {
                    return `${key} is not an allowed field`
                }
            }
            if (typeof product.price === 'string') {
                throw new Error(`price must be a number`)
            }
            if (typeof product.stock === 'string') {
                throw new Error(`stock must be a number`)
            }
            if (product.status && typeof product.status !== 'boolean') {
                throw new Error(`status has to be true or false`)
            }
            if (!targetProduct.id > 0) {
                throw new Error(targetProduct)
            }
            else {
                const updatedProduct = { ...targetProduct, ...product }
                const updatedList = savedProducts.map(prod => {
                    if (prod.id === id) {
                        return updatedProduct
                    } else {
                        return prod
                    }
                })
                const productListString = JSON.stringify(updatedList, null, '\t')
                await writeFile(this.path, productListString)
                return `updated product id: ${targetProduct.id} `
            }
        }
        catch (error) {
            return error.message
        }
    }

    async deleteProduct(id) {
        try {
            const savedProducts = await this.getProducts();
            const targetProduct = await this.getProductById(id)
            const filteredList = savedProducts.filter(prod => prod.id !== id)
            if (!targetProduct.id > 0) {
                throw new Error(targetProduct)
            }
            else {
                const productListString = JSON.stringify(filteredList, null, '\t')
                await writeFile(this.path, productListString)
                return `removed product id: ${targetProduct.id} `
            }
        }
        catch (error) {
            return error.message
        }
    }
}

export default ProductManager;