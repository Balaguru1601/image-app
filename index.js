if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const User = require("./models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utilities/ExpressError");
const flash = require("connect-flash");
const session = require("express-session");
const imageRoute = require("./routes/imageRoutes");
const commentRoute = require("./routes/commentsRoute"); 
const userRoute = require("./routes/usersRoute");

const app = express();

mongoose
    .connect("mongodb://localhost:27017/imageApp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((err) => {
        console.log("OH NO MONGO ERROR!!!!");
        console.log(err);
    });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    session({
        secret: "MyfirstWebstagramApp",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.currentUrl = req.originalUrl;
    res.locals.imageArray = [];
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/user", userRoute);
app.use("/images", imageRoute)
app.use("/images/:id/comments",commentRoute);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Listening at 3000");
});
