function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

function appendCards(data) {
  var mainContainer = document.getElementById("cards");
  for (var i = 0; i < data.length; i++) {
      var li = document.createElement("li");
      li.className = "cards__item";
      var cardDiv = document.createElement("div");
      cardDiv.className = "card";
      var imgDiv = document.createElement("div");
      imgDiv.classList.add("card__image");
      // imgDiv.classList.add("card__image--bg");
      imgDiv.style.backgroundImage="url(/photos/" + data[i].imageId + ")";
      var cntDiv = document.createElement("div");
      cntDiv.className = "card__content"
      var titleDiv = document.createElement("div");
      titleDiv.className = "card__title";
      var p = document.createElement("p");
      p.className = "card__text";
      // add text
      var alink = document.createElement("a");
      var href = document.createAttribute("href");
      href.value = "/comments/" + data[i].id;
      alink.setAttributeNode(href);
      alink.classList.add("card-btn");
      alink.classList.add("card-btn--block");
      alink.classList.add("card-btn-comment");

      var iele = document.createElement("i");
      iele.classList.add("fa");
      iele.classList.add("fa-commenting-o");

      titleDiv.textContent = 'Posted By ' + data[i].username + ' @ ' + data[i].date;
      cntDiv.appendChild(titleDiv);
      p.textContent = data[i].sentence;
      cntDiv.appendChild(p);
      alink.appendChild(iele);
      cntDiv.appendChild(alink);

      cardDiv.appendChild(imgDiv);
      cardDiv.appendChild(cntDiv);

      li.appendChild(cardDiv);

      mainContainer.appendChild(li);
  }
}

/* Entry Point */
window.onload = function() {
  var username = getCookie('username');
  var currentUser = document.getElementById("currentUser");
  if (username) {
    currentUser.append(username);
  } else {
    currentUser.append('Anonymous')
  }
};

fetch('/cards')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    appendCards(data);
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

    