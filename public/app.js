// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    data.forEach(article => {
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
    url: "/favorites/" + thisId
  });
});
