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
  // Optional filters: category, tag, search
  const { category, tag, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .populate("author", "name email");
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name email"
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const getPostBySlug = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "author",
    "name email"
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const getRelatedPosts = async (req, res) => {
  const { id } = req.params;
  const current = await Post.findById(id);
  if (!current) return res.status(404).json({ message: "Post not found" });
  const criteria = [];
  if (current.category) criteria.push({ category: current.category });
  if (current.tags?.length) criteria.push({ tags: { $in: current.tags } });
  let query = criteria.length
    ? { $or: criteria, _id: { $ne: current._id } }
    : { _id: { $ne: current._id } };
  const related = await Post.find(query).sort({ createdAt: -1 }).limit(8);
  res.json(related);
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });

  const fields = [
    "title",
    "content",
    "coverImage",
    "category",
    "tags",
    "excerpt",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) post[f] = req.body[f];
  });
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
