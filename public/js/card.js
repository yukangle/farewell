function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

function loadComments(cardId) {
  fetch("/allComments/" + cardId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cardsContainer = document.getElementById('cards-container');
      cardsContainer.innerHTML = '';

      for (var i = 0; i < data.length; i++) {
        var ccontainer = document.createElement('div');
        ccontainer.className = "icard-container";
        var cbody = document.createElement('div');
        cbody.className = "icard-body";
        cbody.textContent = data[i].sentence;
        var cfooter = document.createElement('div');
        cfooter.className = "icard-footer";
        var ul = document.createElement('ul');
        var li1 = document.createElement('li');
        li1.className = "icard-publishedat";
        var li2 = document.createElement('li');
        li2.className = "card-publishedby";
        li1.textContent = data[i].date;
        li2.textContent = data[i].username;

        ul.appendChild(li1);
        ul.appendChild(li2);
        cfooter.appendChild(ul);
        ccontainer.appendChild(cbody);
        ccontainer.appendChild(cfooter);

        cardsContainer.appendChild(ccontainer);
      }
      
    })
    .catch(function (err) {
      console.log('error: ' + err);
    });
}

currentUser = getCookie("username");
cardId = getCookie("id");
cardUrl = "/card/" + cardId;

fetch(cardUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var cardCover = document.getElementById("icard-cover");
    var cardSummary = document.getElementById("icard-summary");
    var cardAt = document.getElementById("icard-publishedat");
    var cardBy = document.getElementById("icard-publishedby");

    cardCover.style.backgroundImage="url(/photos/" + data[0].imageId + ")";
    var p = document.createElement("p");
    p.textContent = data[0].sentence;
    cardSummary.appendChild(p);
    cardAt.textContent = data[0].date;
    cardBy.textContent = data[0].username;

    loadComments(cardId);

    $("#addComment").on('click', function() {
      var newComment = {"username": currentUser };
      newComment.sentence = document.getElementById("sentence").value;

      $("#result").text("submitting comment...");
      $("#result").css({ "display":"inline-block", "color": "#747d8c"});
      $.ajax({  
        type: "post",  
        url:"/comment/" + data[0].id, 
        async: true,
        data: JSON.stringify(newComment),  
        contentType: "application/json; charset=utf-8",  
        dataType: "json",  
        success: function(data) {  
          if (data.result == "success") {
            $("#result").text("new comment added");
            $("#result").css({ "display":"inline-block", "color": "#2ed573"});

            loadComments(cardId);
          } else {
            $("#result").text("failed to add new comment");
            $("#result").css({ "display":"inline-block", "color": "#ff4757"});
          }
        } 
      }); 
    });
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

    