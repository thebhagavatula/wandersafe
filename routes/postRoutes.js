const express = require('express');  
const { createPost, getPosts } = require('../controllers/postController');  
const auth = require('../config/auth');  

const router = express.Router();  

// @route   POST /api/posts  
// @desc    Create a post  
router.post('/', auth, createPost);  

// @route   GET /api/posts  
// @desc    Fetch all posts  
router.get('/', getPosts);  

module.exports = router;  