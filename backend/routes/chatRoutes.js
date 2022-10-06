const express = require('express')
const { 
  accessChat, 
  fetchChats, 
  createGroupChat, 
  renameGroup, 
  removeFromGroup, 
  addToGroup } = require('../controllers/chatControllers')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', protect, accessChat)

router.get('/', protect, fetchChats)

router.post('/group', protect, createGroupChat)

router.put('/rename', protect, renameGroup)

router.put('/groupadd', protect, addToGroup)

router.put('/groupremove', protect, removeFromGroup)


module.exports = router