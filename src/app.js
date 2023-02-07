import express from 'express'
import cartsRoutes from './routes/cartsRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io'
import './config/dbConfig.js'
import chatModel from './daos/models/chatModel.js';

const app = express();
const httpServer = app.listen(8080, () => console.log("Server OK! Listening PORT 8080"))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)
app.use('/', viewsRoutes)
app.use(express.static(__dirname + '/public'))



io.on('connection', (socket) => {
    console.log("new client connected");
    app.set('socket', socket)
    app.set('io', io)
})
// Sockets
const messages = await chatModel.find().lean();
const messagesRealTime = [...messages];

io.on('connection', (socket) => {
    console.log("New client connected!");

    socket.on('login', (user) => {
        socket.emit('message-logs', messagesRealTime);
        socket.emit('welcome', user);
        socket.broadcast.emit('new-user', user);
    });

    socket.on('message', (data) => {
        chatModel.create(data)
        messagesRealTime.push(data);
        io.emit('message-logs', messagesRealTime);
    })
});