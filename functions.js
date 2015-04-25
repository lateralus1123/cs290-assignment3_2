// Adds a Gist list item to favorites list
function addToFav(i) {
  favGistsStr = localStorage.getItem('favGists');
  var favGists = JSON.parse(favGistsStr);
  favGists.favArray.push(fetchedGist[i]);
  localStorage.setItem('favGists', JSON.stringify(favGists));
  removeFromList(i, false);

  generateList();
  generateFavorites(favGists.favArray);
}

// Removes a Gist list item from either list
function removeFromList(i, fav) {
  if (fav == false) {
    fetchedGist.splice(i, 1);
    generateList();
  }
  else {
    favGistsStr = localStorage.getItem('favGists');
    var favGists = JSON.parse(favGistsStr);
    favGists.favArray.splice(i, 1);
    localStorage.setItem('favGists', JSON.stringify(favGists));
    generateFavorites(favGists.favArray);
  }
}

// Creates each Gist to be displayed in fetch list
function createListItem(gistObj, i, fav) {
  var gistDescript = gistObj.description;
  if (gistDescript == "")
    gistDescript = "No description provided";

  var gistDescriptNode = document.createTextNode(gistDescript);
  var gistURL = gistObj.url;

  var gist = document.createElement('div');

  if (fav == false)
    gist.appendChild(createAddFavButton(i));
  if (fav == true)
  	gist.appendChild(createRemoveFavButton(i));

  var gistLink = document.createElement('a');
  gistLink.setAttribute('href', gistURL);
  gistLink.appendChild(gistDescriptNode);
  gist.appendChild(gistLink);

  return gist;
}

// Create the add to favorite button on each GIST listed
function createAddFavButton(i) {
  var addFav = document.createElement('input');
  addFav.setAttribute('type', 'button');
  addFav.setAttribute('value','+');
  addFav.setAttribute('onclick', 'addToFav('+ i +')');

  return addFav;
}

// Create the remove from favorite button on each fav GIST
function createRemoveFavButton(i) {
  var removeFav = document.createElement('input');
  removeFav.setAttribute('type', 'button');
  removeFav.setAttribute('value','-');
  removeFav.setAttribute('onclick', 'removeFromList('+ i +')');

  return removeFav;
}

// Removes all favorites from search request.
function removeFavsFetched() {
  var favGistsStr = localStorage.getItem('favGists');
  var favGists = JSON.parse(favGistsStr);

  for (var i = 0; i < fetchedGist.length; i++) {
  	var j = 0;
  	var match = false;

  	while (match == false && j < favGists.favArray.length) {
      if (fetchedGist[i].id == favGists.favArray[j].id) {
      	fetchedGist.splice(i, 1);
      	i--;
      	match = true;
      }

      j++;
  	}
  }
}

// Generates list of GISTs for webpage
function generateList() {
  var gistList = document.getElementById('gistList');
  gistList.innerHTML = '';

  for (var i = 0; i < fetchedGist.length; i++)
   	gistList.appendChild(createListItem(fetchedGist[i], i, false));
}

// Generates list of favorite GISTS for webpage
function generateFavorites(favArray) {
  var favGistList = document.getElementById('favGistList');
  favGistList.innerHTML = '';

  for (var i = 0; i < favArray.length; i++)
  	favGistList.appendChild(createListItem(favArray[i], i, true));
}

// Results from fetch are stored here
var fetchedGist = [];

// Gets list of GISTs from API
function fetchGist() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
  	throw 'Fetch request creation failed.'
  }

  fetchedGist = [];
  var pageSelect = document.getElementById('numPages');
  var numPages = pageSelect[pageSelect.selectedIndex].value;
  var url = 'https://api.github.com/gists/public?page=';

  httpRequest.onreadystatechange = function() {
  	if (httpRequest.readyState === 4) {
   	  fetchedGist = fetchedGist.concat(JSON.parse(this.responseText));

  	  if (currentRequest < numPages) {
  	    currentRequest++;
  	    httpRequest.open('GET', url + currentRequest);
  	    httpRequest.send();
   	  }
  	  else {
        removeFavsFetched();
        generateList();
  	  }
    }
  }

  var currentRequest = 1;

  httpRequest.open('GET', url + currentRequest);
  httpRequest.send();
}

// Loads favorite GISTs
window.onload = function() {
  favGistsStr = localStorage.getItem('favGists');

  if (favGistsStr === null) {
  	var favGists = {'favArray':[]};
    localStorage.setItem('favGists', JSON.stringify(favGists));
  }
  else
  	var favGists = JSON.parse(favGistsStr);

  generateFavorites(favGists.favArray);
}