import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const productCollection = 'products'

const productSchema = new Schema({
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true
    },
    code: { 
        type: String, 
        required: true, 
        unique: true
    },
    price: { 
        type: Number, 
        required: true
    },
    stock: { 
        type: Number, 
        required: true
    },
    category: { 
        type: String, 
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    thumbnail:{
        type: [String],
        required: true
    }
})
productSchema.plugin(mongoosePaginate)

const productModel = model(productCollection, productSchema)

export default productModel