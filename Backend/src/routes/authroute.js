import express from 'express'
import { login,signup,logout,Updatepp} from '../controllers/authcontrollers.js'
import dotenv from 'dotenv'
import { arcjetProtection } from '../middleware/arcjetmiddleware.js'
dotenv.config()
import { protectRoute } from '../middleware/authmiddleware.js'


const router =express.Router()

// router.use(arcjetProtection)

router.post('/login',login)
router.post('/signup',signup)

router.post('/logout',logout)
router.put('/update-profile',protectRoute, Updatepp)
router.get('/check',protectRoute,(req,res) => {res.status(200).send(req.user) })


export default router