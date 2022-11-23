const mongoose = require("mongoose");
const images = require("../models/postModel");
const User = require("../models/userModel");

mongoose
	.connect("mongodb://localhost:27017/imageApp")
	.then(() => {
		console.log("MONGO CONNECTION OPEN!!!");
	})
	.catch((err) => {
		console.log("OH NO MONGO ERROR!!!!");
		console.log(err);
    });
    
const seedDb = async () => {
    const tester = await User.findOne({ username: "tester" })
    await User.findByIdAndUpdate(tester._id, { $set: { 'posts': [] } }, { multi: true })
    const id = "61e46779831ec20ce2f50cec";
    await User.findByIdAndUpdate(
		id,
		{ $set: { images: [] } },
		{ multi: true }
	);
    await images.deleteMany({});
    for (let i = 0; i < 20; i++){
        const img = new images({
			imgs: [
				{
					url: "https://images.unsplash.com/photo-1500614922032-b6dd337b1313?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
					filename: "elephant",
				},
				{
					url: "https://images.unsplash.com/photo-1500614922032-b6dd337b1313?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
					filename: "elephant",
				},
			],
			user_id: tester._id,
			description: "Jus an Elephant",
			upTime: Date()
		});
        await tester.posts.push(img._id);
        await img.save();
        await tester.save();
    }
}

seedDb().then(() => mongoose.connection.close());