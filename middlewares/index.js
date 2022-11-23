const Posts = require("../models/postModel");
const Comment = require("../models/commentsModel");

module.exports.isLoggedin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must sign in!");
		return res.redirect("/user/login");
	}
	next();
};

module.exports.isPostOwner = async (req, res, next) => {
    const { id } = req.params;
    const post = await Posts.findById(id).populate()
    if (!req.user._id.equals(post.user_id)) {
        req.flash("error", "Access Denied");
        return res.redirect(`/images/${id}`);
    }
    next();
}

module.exports.isCommentOwner = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!req.user._id.equals(comment.author)) {
        req.flash("error", "Access Denied");
		return res.redirect(`/images/${id}`);
    }
    next();
}
