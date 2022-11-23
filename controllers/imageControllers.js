const Post = require("../models/postModel");
const User = require("../models/userModel");
const { cloudinary } = require("../cloudinary");

module.exports.showAll = async (req, res, next) => {
	const posts = await Post.find().populate("user_id");
	res.render("Images/showAll", { posts });
};

module.exports.showImg = async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findById(id)
		.populate({ path: "comments", populate: { path: "author" } })
		.populate("user_id");
	let alreadyCommented = false;
	for (let comment of post.comments)
		if (comment.author._id.equals(res.locals.currentUser._id))
			alreadyCommented = true;
	if (!post) {
		req.flash("error", " post not found!");
		return res.redirect("/");
	}
	return res.render("Images/showImg", { post, alreadyCommented });
};

module.exports.renderNewForm = (req, res) => {
	res.render("Images/new");
};

module.exports.postNew = async (req, res) => {
    const newpost = new Post({
        user_id: res.locals.currentUser._id,
        description: req.body.description,
        upTime: Date.now()
    });
    const user = await User.findById(res.locals.currentUser._id);
    newpost.imgs = req.files.map(f => ({ url : f.path, filename : f.filename }));
    await newpost.save();
    await user.posts.push(newpost);
    await user.save();
    req.flash("success", "Posted!");
    res.redirect(`/images/${newpost._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user_id");
    res.locals.imageArray = post.imgs;
    res.render("Images/edit", { post });
}

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    let previmgs = [];
    const oldpost = await Post.findByIdAndUpdate(id, { description }, { new: true });
    for(let img of oldpost.imgs) 
        await Post.findByIdAndUpdate(id, { $pull: { imgs: { url: img.url } } });
    const post = await Post.findById(id);
    if (req.body.prevImages) 
        previmgs = req.body.prevImages.map((f) => ({ url: f.split("#")[1], filename: f.split("#")[0] }));
    previmgs.push(
		...req.files.map((f) => ({ url: f.path, filename: f.filename }))
	);
    post.imgs.push(...previmgs);
    await post.save();
    res.locals.imageArray = [];
    res.redirect("/images/" + id);
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    for (let img of post.imgs) 
        cloudinary.uploader.destroy(img.filename);
    await Post.findByIdAndDelete(id);
    req.flash("success", "Deleted the Post!");
    res.redirect("/images");
}