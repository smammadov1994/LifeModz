const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const toDo = require("./models/todo");

const app = express();

// SETUP DB
mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true });

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

// CONTROLLERS
const usersController = require("./controllers/users.js");
const sessionsController = require("./controllers/sessions.js");

// MIDDLEWARE
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Superman",
    resave: false,
    saveUninitialized: false
  })
);
app.use("/users", usersController);
app.use("/sessions", sessionsController);

app.get("/", (req, res) =>
  res.render("index.ejs", {
    currentUser: req.session.currentUser
  })
);

app.post("/todo/", (req, res) => {
  toDo.create(req.body, (error, createdTask) => {
    if (error) {
      res.send(error);
    } else {
      res.redirect("/todo");
    }
  });
});
app.get("/todo", (req, res) => {
  toDo.find({}, (error, allTasks) => {
    if (error) {
      res.send(error);
    } else {
      res.render("indexitem.ejs", {
        tasks: allTasks
      });
    }
  });
});

//create new item//
app.get("/todo/new", (req, res) => {
  if (req.session.currentUser) {
    res.render("newitem.ejs");
  } else {
    res.redirect("/sessions/new");
  }
});

//specific item view//
app.get("/todo/:id", (req, res) => {
  toDo.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundItem);
      res.render("showitem.ejs", {
        tasks: foundItem
      });
    }
  });
});

app.delete("/todo/:id", (req, res) => {
  toDo.findByIdAndRemove(req.params.id, (err, deletedFruit) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/todo");
    }
  });
});

app.get("/todo/:id/edit", (req, res) => {
  toDo.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      res.render("edititem.ejs", {
        tasks: foundItem
      });
    }
  });
});

app.put("/todo/:id", (req, res) => {
  toDo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedTask) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/todo");
      }
    }
  );
});

app.listen(3000, () => console.log("running on 3000"));
