const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentsController");
const {isLoggedin,isCommentOwner} = require("../middlewares")

const catchAsync = (func) => {
	return function (req, res, next) {
		func(req, res, next).catch(next);
	};
};

router.post("/new", isLoggedin, catchAsync(commentController.newComment));

router.put("/:commentId", isLoggedin, isCommentOwner, catchAsync(commentController.editComment));

router.delete("/:commentId", isLoggedin, isCommentOwner, catchAsync(commentController.deleteComment));

module.exports = router;