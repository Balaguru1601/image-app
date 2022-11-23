const express = require("express");
const router = express.Router({ mergeParams: true });
const { storage } = require("../cloudinary");
const multer = require("multer");
const { isLoggedin, isPostOwner } = require("../middlewares");
const upload = multer({ storage });
const imageController = require("../controllers/imageControllers");

const catchAsync = (func) => {
	return function (req, res, next) {
		func(req, res, next).catch(next);
	};
};

router.get("/", catchAsync(imageController.showAll));

router.get("/new", isLoggedin, imageController.renderNewForm);

router.post("/new", isLoggedin, upload.array("images"), catchAsync(imageController.postNew));

router.get("/:id", isLoggedin, catchAsync(imageController.showImg));

router.put("/:id", isLoggedin, isPostOwner, upload.array("images"), catchAsync(imageController.editPost))

router.delete("/:id", isLoggedin, isPostOwner, catchAsync(imageController.deletePost))

router.get("/:id/edit", isLoggedin, isPostOwner, catchAsync(imageController.renderEditForm))

module.exports = router;
