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
            <a id='deleteArticle' data-id=${article._id} class="btn btn-danger">Delete Article</a>
            </br>
            <form>
              <div class="form-group">
              <label><strong>Write a note:</strong></label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </div>
              <a id='saveNote' data-id=${article._id} class="btn btn-info">Save Note</a>
            </form>
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
          <a id='saveArticle' data-id=${article._id} class="btn btn-primary">Save Article</a>
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
