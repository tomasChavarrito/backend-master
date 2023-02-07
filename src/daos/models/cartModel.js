import { Schema, model, SchemaTypeOptions } from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new Schema({
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: Number,
        _id:false
      }]
})

cartSchema.pre('find', function(){
  this.populate('products.productId')
})

cartSchema.pre('findOne', function(){
  this.populate('products.productId')
})

const cartModel = model(cartCollection, cartSchema)

export default cartModel