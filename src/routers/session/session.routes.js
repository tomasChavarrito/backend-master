const { Router } = require('express')
const userModel = require('../../dao/models/user.model')
const { roleMiddleware } = require('../../middlewares/role.middleware')

const router = Router()

router.get('/', (req, res)=>{
    res.send('Session')
})

router.post('/register', async (req, res)=>{
    try {
        const email = req.body.email
        let user = await userModel.findOne({ email });
        if (user) {
            return res.send('Error: Email already registered');
        }
        await userModel.create(req.body)
        res.redirect('/login')
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status:'error',
            error: error
        })
    }
})

router.post('/login', roleMiddleware, async (req,res)=>{
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({email: email}).lean()
        if(user.password !== password){
            return res.send('incorrect password')
        }
        if(!user){
            return res.send('User not found')
        }
        const userSession = {
            ...user,
            role: 'user'
        } 
        req.session.user = userSession
        req.session.save(err => {
            if (err){
                console.log('session error: ', err);
            } 
            else {
                res.redirect('/products');
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })
    }
})

router.get('/logout', async (req, res)=>{
    try {
        req.session.destroy(err => {
            if (err) {
              console.log(err);
            }
            else {
              res.clearCookie('session')
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })   
    }
})


module.exports = router