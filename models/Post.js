const mongoose = require('mongoose');  

const PostSchema = new mongoose.Schema({  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  content: { type: String, required: true, maxlength: 300 },  
  location: { type: String, required: true },  
  imageUrl: { type: String },  
  tags: [{ type: String }],  
  isAnonymous: { type: Boolean, default: false },  
  createdAt: { type: Date, default: Date.now },  
});  

module.exports = mongoose.model('Post', PostSchema);  