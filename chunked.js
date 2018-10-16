// thanks to https://stackoverflow.com/a/7719185/4070143

//this function will work cross-browser for loading scripts asynchronously
function loadScript(src, callback)
{
  var s,
    r,
    t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
}


var searchengine = undefined;

// scroll to the first <a> linking to a chapter
function scrollChapter(element, chapter) {
  for(var i=0; i < element.children.length; i++) {
    if(element.children[i].nodeName == "A" && element.children[i].href.indexOf(chapter) >= 0) {
      element.children[i].scrollIntoView(true);
      return true;
    }

    if(scrollChapter(element.children[i], chapter))
      return true;
  }

  return false;
}

var results = undefined;
var searchbox = undefined;
var searchTimeout = undefined;

function clearSearch() {
  while(results.children.length > 0) {
    results.removeChild(results.children[0]);
  }

  document.getElementById("resultsdiv").classList.remove("results");
}

function doSearch() {
  clearSearch();

  var searchtext = searchbox.value;

  if(searchtext == '')
    return;

  if(searchtext.indexOf(' ') == -1 && searchtext.indexOf('\t') == -1 && searchtext.indexOf('"') == -1)
    searchtext = searchtext + ' ' + searchtext + '*';

  searchtext = searchtext.replace(/"/g, '')

  var searchresults = searchengine.search(searchtext);

  if(searchresults.length == 0) {
    var r = document.createElement('LI');
    r.innerHTML = 'No results';

    results.appendChild(r);
  }

  document.getElementById("resultsdiv").classList.add("results");

  for(var i=0; i < 10 && i < searchresults.length; i++) {
    var a = document.createElement('A');
    a.setAttribute('href', searchresults[i].ref);
    a.innerHTML = searchlookup[searchresults[i].ref];

    var r = document.createElement('LI');
    r.appendChild(a);

    results.appendChild(r);
  }
}

function searchInput(e) {
  if(searchTimeout !== undefined)
    clearTimeout(searchTimeout);

  searchTimeout = setTimeout(doSearch, 50);
}

function searchKeyDown(e) {
  if(e.keyCode == 27) {
    // escape
    if(searchTimeout !== undefined)
      clearTimeout(searchTimeout);

    searchbox.value = '';

    clearSearch();
  } else if(e.keyCode == 10 || e.keyCode == 13) {
    // enter/return
    doSearch();
  } else if(e.keyCode == 8) {
    clearSearch();

    searchInput(e);
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  // get the chapter name from the current URL
  var chap = window.location.pathname.replace(/.*\//, '');

  var toc = document.getElementById("toc");

  // Scroll the sidebar to the appropriate chapter
  if(chap != "") {
    scrollChapter(toc, chap);
    toc.scrollTop -= 96;
  }

  // add anchor links
  ["h2","h3","h4","h5","h6"].forEach(function(hX) {
    var headers = document.getElementsByTagName(hX);

    for(var i=0; i < headers.length; i++) {
      var header = headers[i];
      if(header.id.length > 0) {
        header.innerHTML += ' <a class="headerlink" href="#' + header.id + '\">\u00B6</a>';
      }
    }
  });

  var blocks = document.getElementsByClassName("listingblock")

  for(var i=0; i < blocks.length; i++) {
    if(blocks[i].id.length > 0) {
      var a = document.createElement("A");
      a.innerHTML = '\u00B6';
      a.setAttribute('class', 'link');
      a.setAttribute('href', '#' + blocks[i].id);

      blocks[i].insertBefore(a, blocks[i].childNodes[0]);
    }
  }

  results = document.getElementById('results');
  searchbox = document.getElementById('searchbox');

  loadScript("lunr.js", function() {
    loadScript(searchindexurl, function() {
      searchengine = lunr.Index.load(searchindex);

      searchbox.value = '';
      searchbox.disabled = false;
      searchbox.addEventListener('keydown', searchKeyDown, false);
      searchbox.addEventListener('input', searchInput, false);
    });
  });
});
