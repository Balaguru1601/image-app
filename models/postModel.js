const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./commentsModel");
const User = require("./userModel");

const PostSchema = new Schema({
	imgs: [
		{
			url: String,
			filename: String,
		},
	],
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	description: String,
	upTime: Date,
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

PostSchema.post("findOneAndDelete", async function (data){
    if (data) {
        await Comment.deleteMany({
            _id: { $in: data.comments }
        });
        await User.findByIdAndUpdate(data.user_id,{ $pull: {posts: data._id}})
    }
})

module.exports = mongoose.model("Image", PostSchema);