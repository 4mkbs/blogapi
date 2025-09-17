const mongoose = require('mongoose');
const { title } = require('process');

const articleSchema = new mongoose.Schema({
    title:{ type: String, required:true },
    content:{ type: String, required:true },
    author:{ type: String, required:true },
    tags:[{ type: String }],
    createdAt:{ type: Date, default: Date.now },
    updatedAt:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);