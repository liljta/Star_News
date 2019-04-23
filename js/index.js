window.addEventListener("load", Init);
var apiKey = "f441b039f5c7417da4f67f153424a972";
var weatherApiKey = "e059c6289e5be9872c87befc4f600f26";
var categories = ["sports", "entertainment", "health", "science", "technology"];
var callbackFunction = function (categoryIndex, data) {
    //console.log(categories[categoryIndex], data);
    var tabPanel = document.querySelector('.tab-content .tab-pane');
    tabPanel.innerHTML = '';
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.classList.add('row-eq-height');

    for (var i = 0; i < data.articles.length; i++) {
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
};

var callbackWeatherFunction = function (data) {
    //console.log(data);
    var currentTab = -1;
    var currentDate = '';
    //console.log(timestampToDate(1555599600));
    var tb;
    for (var i = 0; i < data.list.length; i++) {
        var date = timestampToDate(data.list[i].dt);
        if (currentDate != date) {
            currentDate = date;
            currentTab++;
            var tabLink = document.querySelector(`.nav-weather-${currentTab}`);
            if (!tabLink) {
                return;
            }
            tabLink.innerHTML = currentDate;

            tb = document.querySelector(`#w${currentTab} tbody`);
            tb.innerHTML = '';
        }
        var tr = document.createElement("tr");

        var tdTime = document.createElement("td");
        tdTime.innerHTML = timestampToHour(data.list[i].dt);
        tr.appendChild(tdTime);

        var tdTemp = document.createElement("td");
        tdTemp.innerHTML = Math.round(data.list[i].main.temp);
        tr.appendChild(tdTemp);

        var img = document.createElement("img");
        img.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" +
            data.list[i].weather[0].icon +
            ".png"
        );

        var tdOsadki = document.createElement("td");
        tdOsadki.appendChild(img);
        tr.appendChild(tdOsadki);
        var tdPressure = document.createElement("td");
        tdPressure.innerHTML = Math.round(data.list[i].main.pressure);
        tr.appendChild(tdPressure);
        tb.appendChild(tr);
    }
};

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function timestampToDate(ts) {
    var date = new Date(ts * 1000);
    return date.getDate() + ' ' + monthNames[date.getMonth()];
}

function timestampToHour(ts) {
    var hours = new Date(ts * 1000).getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    return hours;
}

function Init() {
    RequestNews(0, callbackFunction);
    RequestWeather(693581, callbackWeatherFunction);
    var cityWeather = document.querySelector('#city');
    cityWeather.addEventListener("change", function (e) {
        RequestWeather(this.value, callbackWeatherFunction);
    })
}


function RequestNews(categoryIndex, callback) {
    var url = `https://newsapi.org/v2/top-headlines?country=ua&category=${categories[categoryIndex]}&apiKey=${apiKey}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            var errStatus = xhr.status;
            var errText = xhr.statusText;
            //console.log(errStatus + ": " + errText);
        } else {
            var data = JSON.parse(xhr.responseText);
            //console.log(data);
            callback(categoryIndex, data);
        }
    };
}

function RequestWeather(cityId, callback) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${weatherApiKey}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            var errStatus = xhr.status;
            var errText = xhr.statusText;
            //console.log(errStatus + ": " + errText);
        } else {
            var data = JSON.parse(xhr.responseText);
            //console.log(data);
            callback(data);
        }
    };
}


$('.nav.nav-tabs.nav-news a').on('click', function (e) {
    e.preventDefault();
    var tabPanel = document.querySelector('.tab-content .tab-pane');
    tabPanel.innerHTML = 'Загрузка';
    RequestNews($(this).data('category'), callbackFunction);
});

$('.nav.nav-tabs.nav-weather a').on('click', function (e) {
    e.preventDefault();
    $(this).tab('show');
});

function PBRequest(card = false) {
    var xhr = new XMLHttpRequest();

    if (card) {
        var url = "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";
    } else {
        var url = "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";
    }

    xhr.open("GET", url, true);
    //xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            var errStatus = xhr.status;
            var errText = xhr.statusText;
            console.log(errStatus + ": " + errText);
        } else {
            var data = JSON.parse(xhr.responseText);
            ShowCurrencyTable(data, card);
            //var data = xhr.responseText;
            //console.log(data);
        }
    };
}

function ShowCurrencyTable(data, card) {
    if (card) {
        var currencyTbody = document.querySelector(".currency-exchange-card");
    } else {
        var currencyTbody = document.querySelector(".currency-exchange");
    }

    for (var i = 0; i < data.length; i++) {
        console.log(` ${data[i].ccy} / ${data[i].base_ccy} Buy ${data[i].buy} Sell ${data[i].sale} `);
        var tr = document.createElement('tr');
        var tdCurrencyName = document.createElement('td');
        tdCurrencyName.innerText = `${data[i].ccy} / ${data[i].base_ccy}`;
        tr.appendChild(tdCurrencyName);
        var tdCurrencyBid = document.createElement('td');
        tdCurrencyBid.innerText = data[i].buy;
        tr.appendChild(tdCurrencyBid);
        var tdCurrencyAsk = document.createElement('td');
        tdCurrencyAsk.innerText = data[i].sale;
        tr.appendChild(tdCurrencyAsk);
        currencyTbody.appendChild(tr);
    }
}

window.onload = function () {
    PBRequest();
    PBRequest(true);
};

function DayNight() {
    var page = document.querySelector(".page");
    if (page && page.classList) {
        page.classList.toggle("night");
    }
}

