window.addEventListener("load", Init);
var apiKey = "f441b039f5c7417da4f67f153424a972";
var categories = ["sports", "entertainment", "health", "science", "technology"];
var callbackFunction = function (categoryIndex, data) {
    console.log(categories[categoryIndex], data);
    var tabPanel = document.querySelector('.tab-content .tab-pane');
    tabPanel.innerHTML = '';
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.classList.add('row-eq-height');

    for(var i = 0; i < data.articles.length; i++){
        //console.log(` ${data.articles[i]}`);
        var colDiv = document.createElement('div');
        colDiv.classList.add('col-6');

        var shadowDiv = document.createElement('div');
        shadowDiv.classList.add('shadow');

        var article = document.createElement('article');

        var img = document.createElement('img');
        img.setAttribute('src', data.articles[i].urlToImage);
        article.appendChild(img);

        var h2 = document.createElement('h2');
        var link = document.createElement('a');
        link.setAttribute('href', data.articles[i].url);
        link.setAttribute('target', '_blank');
        link.innerHTML = data.articles[i].title;
        h2.appendChild(link);
        article.appendChild(h2);

        var p = document.createElement('p');
        p.innerHTML = data.articles[i].description;
        article.appendChild(p);
        var author = document.createElement('p');
        author.innerHTML = `Источник: ${data.articles[i].author}`;
        article.appendChild(author);

        shadowDiv.appendChild(article);
        colDiv.appendChild(shadowDiv);
        rowDiv.appendChild(colDiv);
    }
    tabPanel.appendChild(rowDiv);
}

function Init() {
    Request(0, callbackFunction);
}


function Request(categoryIndex, callback) {
    var url = `https://newsapi.org/v2/top-headlines?country=ua&category=${categories[categoryIndex]}&apiKey=${apiKey}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            var errStatus = xhr.status;
            var errText = xhr.statusText;
            console.log(errStatus + ": " + errText);
        } else {
            var data = JSON.parse(xhr.responseText);
            //console.log(data);
            callback(categoryIndex, data);
        }
    };
}

$('.nav.nav-tabs a').on('click', function (e) {
    e.preventDefault();
    var tabPanel = document.querySelector('.tab-content .tab-pane');
    tabPanel.innerHTML = 'Загрузка';
    Request($(this).data('category'), callbackFunction);
});
