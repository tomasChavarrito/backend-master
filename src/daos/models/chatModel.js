import { Schema, model } from 'mongoose'

const messageCollection = 'messages'

const messageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const chatModel = model(messageCollection, messageSchema)

export default chatModel