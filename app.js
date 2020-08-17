const { render } = require("ejs");

const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      app = express(),
      Blog = require("./models/blogs");

mongoose.connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conneted to DB'))
    .catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: blog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            console.log(blog);
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(3000, function() {
    console.log("server is running on port 3000");
});