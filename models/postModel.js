import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String }, // URL to cover image
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate slug & excerpt before save if missing
postSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content
      .replace(/<[^>]+>/g, "") // strip html if any
      .slice(0, 180)
      .trim();
    if (this.content.length > 180) this.excerpt += "...";
  }
  next();
});

export default mongoose.model("Post", postSchema);
