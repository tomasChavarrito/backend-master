import mongoose from 'mongoose'
import options from './options.js'

mongoose.set('strictQuery', false)
mongoose.connect(options.mongoDB.url, (error) => {
    if(error){
        return console.log(`db connection failed: ${error}`)
    }
    console.log('connected to db');
})