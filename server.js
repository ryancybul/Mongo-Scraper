var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoscraperdb");

// routes
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every postwrapper
    $("article.story").each(function(i, element) {
      // Save an empty result object
      var result = {};
    
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).children("h2").text();
      result.link = $(element).children("h2").children('a').attr("href");
      result.summary = $(element).children('p.summary').text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
        return result;
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({}).then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: 'req.params.id'})
  .populate('note')
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

//Put route to update the article favorite boolean
app.post("/favorites/:id", function(req, res){
  db.Article.update()
  .then(function(){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {favorite: true});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  });
});

//Put route to update the article favorite boolean
app.post("/delete/:id", function(req, res){
  db.Article.update()
  .then(function(){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {favorite: false});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
