import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  const updated = await post.save();
  res.json(updated);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
