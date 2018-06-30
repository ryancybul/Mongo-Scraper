// Grab the articles as a json file for
$.getJSON("/articles", function(data) {
    // For each one
    data.forEach(article => {
    if (article.favorite) {
      $(".favoriteArticles").append(
        `<div class="card text-center">
           <div class="card-header">
              <h3>${article.title}<h3>
            </div>
            <div class="card-body">
             <p class="card-text">${article.summary}</p>
            <a href="${article.link}" class="btn btn-primary">Read Article</a>
            <button data-id=${article._id} id='notesBtn'  data-toggle='modal' data-target='#myModal' class="btn btn-info">Article Notes</button>
            <button id='deleteArticle' data-id=${article._id} class="btn btn-danger">Delete Article</button>
            </br>
        </div>`
      )
    }

    $(".articles").append(
      `<div class="card text-center">
          <div class="card-header">
            <h3>${article.title}<h3>
          </div>
          <div class="card-body">
            <p class="card-text">${article.summary}</p>
          <a href="${article.link}" class="btn btn-primary">Read Article</a>
          <button id='saveArticle' data-id=${article._id} class="btn btn-primary">Save Article</button>
      </div>`
    )
    });
  });

//Save articles on click event. 
$(document).on('click', "#saveArticle", function(){
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/favorites/" + thisId,
    success: function(){
      alert('Article saved!');
    }
  });
});

//Delete articles on click event. 
$(document).on('click', "#deleteArticle", function(){
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId,
    success: function(){
      alert('Article deleted!');
      document.location.reload();
    }
  });
});

//Scrape scrape articles on click
$(document).on('click', ".scrapeBtn", function(){
  $.ajax({
    method: "GET",
    url: "/scrape",
    success: function(data){
      console.log("data: ", data);
      alert(`You scraped ${data.length} new articles.`);
      document.location.reload();
    }
  });
});

//Note button funcationality
$(document).on("click", "#notesBtn", function() {
  
  $(".modal-title").empty();
  $(".input").empty();

  // Save the id from .btn-note
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .then(function(data) {
      console.log('Data: ', data);

      $(".modal-title").append("<h5>" + data.title + "</h5>");
      $(".input").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".input").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
