const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', protect, allUsers)

router.post('/login', authUser)

router.post('/', registerUser)

module.exports = router