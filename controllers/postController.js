const Post = require('../models/Post');  

// Create a new post  
exports.createPost = async (req, res) => {  
  try {  
    const { content, location, imageUrl, tags, isAnonymous } = req.body;  
    const post = new Post({  
      userId: req.user.id,  
      content,  
      location,  
      imageUrl,  
      tags,  
      isAnonymous,  
    });  
    await post.save();  
    res.status(201).json(post);  
  } catch (err) {  
    res.status(500).json({ error: 'Server error' });  
  }  
};  

// Fetch all posts  
exports.getPosts = async (req, res) => {  
  try {  
    const posts = await Post.find().sort({ createdAt: -1 });  
    res.json(posts);  
  } catch (err) {  
    res.status(500).json({ error: 'Server error' });  
  }  
};  