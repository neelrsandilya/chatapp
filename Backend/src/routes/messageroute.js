import express from 'express'
import { getChatpartners,getContacts,sendMessage,messagesbyUserId } from '../controllers/messagecontrollers.js'
import { protectRoute } from '../middleware/authmiddleware.js'

const router =express.Router()

// router.use(protectRoute)

router.get("/contacts",protectRoute,getContacts)
router.get("/chat",protectRoute,getChatpartners)
router.get("/:id",protectRoute,messagesbyUserId)
router.post("/send/:id",protectRoute,sendMessage)

export default router