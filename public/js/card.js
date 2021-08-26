function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

// window.onload = function() {
  
// };

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
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

    