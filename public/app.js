
var makeRequest = function (url, callback) {

  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

var requestComplete = function(){
  if(this.status !== 200){
    return;
  }
  var jsonString = this.responseText;
  var albums = JSON.parse(jsonString);
  populateList(albums);

}

var populateList = function (albums) {
  var ul = document.querySelector('#albums');

  albums.albums.items.forEach(function(album){
    var a = document.createElement('a');
    var div = document.createElement('div');
    var infoDiv = document.createElement('div');
    var img = document.createElement('img');

    a.innerText = album.name;
    img.src = album.images[0].url;
    div.setAttribute("class", "flex-item")
    a.href = album.external_urls.spotify;

    infoDiv.appendChild(a);
    div.appendChild(infoDiv);
    div.appendChild(img);
    ul.appendChild(div);
  });
  handleNext(ul, albums);
  handlePrevious(ul, albums);
}

var handleNext = function (ul, albums) {
  var next = document.createElement('button');
  next.innerText = "next";
  next.onclick = function(){
    ul.innerHTML = '';
    makeRequest(albums.albums.next, requestComplete);
  }
  ul.appendChild(next);
}

var handlePrevious = function (ul, albums) {
  var previous = document.createElement('button');
  previous.innerText = "back";
  previous.onclick = function(){
    ul.innerHTML = '';
    makeRequest(albums.albums.previous, requestComplete);
  }
  if(albums.albums.offset > 0) {
    ul.appendChild(previous);
  }
}

var handleInput = function (e, query) {
  if (e.which==13){
    var ul = document.getElementById("albums");
    ul.innerHTML = '';
    var searchUrl = "https://api.spotify.com/v1/search?q=" + query.value + "&type=album&limit=6"
    makeRequest(searchUrl, requestComplete);
  }
}

var app = function () {
  var query = document.querySelector('#search-query');
  query.onkeypress = function(e){
    handleInput(e, query);
  }
}

window.onload = app;