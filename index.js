const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files setup
app.use(express.static(path.join(__dirname, "public")));

// Sample posts data
let posts = [
    {   
        id: uuidv4(),
        username: "vatsala",
        content: "I love coding!",
    },
    {   
        id: uuidv4(),
        username: "apna college",
        content: "I love apna college!",
    },
    {   
        id: uuidv4(),
        username: "studing",
        content: "I love learning :)!",
    },
];

// Routes
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id); // Ensure comparison is strict (===)
    if (!post) {
        return res.status(404).send("Post not found"); // Handle case where post is not found
    }
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => p.id === id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    post.content = newContent;
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    console.log("Editing post with id:", id);
    
    // Find the post by id
    let post = posts.find((p) => p.id === id);

    if (!post) {
        console.log("Post not found");
        return res.status(404).send("Post not found");
    }

    // Render the edit.ejs template with the found post
    res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id); // Use strict comparison (!==)

    res.redirect("/posts");
});

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
