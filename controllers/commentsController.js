const Image = require("../models/postModel");
const Comment = require("../models/commentsModel");

module.exports.newComment = async (req, res) => {
	const { id } = req.params;
	const { commentText } = req.body;
	const comment = new Comment({
		text: commentText,
		author: res.locals.currentUser._id,
	});
	const post = await Image.findById(id);
	await comment.save();
	post.comments.push(comment);
	await post.save();
	res.redirect(`/images/${id}`);
};

module.exports.editComment = async (req, res) => {
	const { id, commentId } = req.params;
	await Comment.findByIdAndUpdate(
		commentId,
		{ text: req.body.commentText },
		{ new: true }
	);
	res.redirect(`/images/${id}`);
};

module.exports.deleteComment = async (req, res) => {
	const { id, commentId } = req.params;
	await Image.findByIdAndUpdate(id, { $pull: { comments: commentId } });
	await Comment.findByIdAndDelete(commentId);
	req.flash("success", "Comment deleted!");
	res.redirect(`/images/${id}`);
};
