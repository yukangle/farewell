function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

function appendCards(data) {
  var mainContainer = document.getElementById("cards");
  for (var i = 0; i < data.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = 'Name: ' + data[i].username + ' ' + data[i].imageId;
      mainContainer.appendChild(div);
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

// fetch('/cards')
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     appendCards(data);
//   })
//   .catch(function (err) {
//     console.log('error: ' + err);
//   });

    