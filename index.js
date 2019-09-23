'use strict';

const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast"
const newsUrl = "https://newsapi.org/v2/everything"
const youtubeUrl = "https://www.googleapis.com/youtube/v3/search"


function checkValue(inputValue) {
    let outputValue = inputValue;
    if (inputValue == "") {
        outputValue = 0;
    }
    if (inputValue == undefined) {
        outputValue = 0;
    }
    if (inputValue == null) {
        outputValue = 0;
    }
    return outputValue;
};

function checkText(inputText) {
    let outputText = inputText;
    if (inputText == undefined) {
        outputText = "";
    }
    if (inputText == null) {
        outputText = "";
    }
    return outputText;
}

function checkURL(inputURL) {
    let outputURL = inputURL;
    if (inputURL == undefined) {
        outputURL = "/";
    }
    if (inputURL == null) {
        outputURL = "/";
    }
    return outputURL;
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayWeatherResults(responseJson) {
    for (let i = 0; i < responseJson.list.length; i++) {
        checkValue(responseJson.list[i].dt_txt.slice(11))
        if (responseJson.list[i].dt_txt.slice(11) === '12:00:00') {
            let kelvin = checkValue(responseJson.list[i].main.temp);
            let fahrenheit = (kelvin * (9 / 5)) - 459.67
            let weatherIcon = checkURL(responseJson.list[i].weather[0].icon);
            let rawDate = checkText(responseJson.list[i].dt_txt);
            $('#weatherResults').append(
                `<div id="weather-container" role="text">
                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather icon" class="weather-icon" />
                <h4>${rawDate}</h4>
                <p>${fahrenheit.toFixed(0)}°F</p>`
            );
        }
    };
};


function getWeather(cityName) {
    const params = {
        q: cityName,
        APPID: 'c894bfba04e757cc13b20cad7b39e4c6'
    };
    const queryString = formatQueryParams(params);
    const url = weatherUrl + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeatherResults(responseJson))
        .catch(err => {
            $('#js-error-message-weather').html(`<p>Weather for this location is unavailable at this time, please try again later.</p>`);
        });
}


function displayNewsResults(responseJson) {
    for (let i = 0; i < 6; i++) {
        let articleTitle = checkText(responseJson.articles[i].title);
        $('#newsResults').append(
            `<div class="accordion" role="menu">${articleTitle}</div>
            <div class="panel" role="menuitem">
                <img src="${responseJson.articles[i].urlToImage}" />
                <p class="article-content">${responseJson.articles[i].content}</p>
                <a href="${responseJson.articles[i].url}" target="_blank"><button class="open">Read More</button></a>
            </div>`
        )
    };
    $('.accordion').on('click', function () {
        this.classList.toggle('active');
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

$('.accordion-landing').on('click', function () {
    this.classList.toggle('active');
    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
});

function getNews(cityName) {
    const strCityName = cityName;
    const cityNameOnly = strCityName.split(",").shift();
    const params = {
        q: cityNameOnly,
        apiKey: '5358d981d8e94c6ca98e1b3831164df1'
    }
    const queryString = formatQueryParams(params);
    const url = newsUrl + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => {
            $('#js-error-message-news').html(`<p>News for this location is unavailable at this time, please try again later.</p>`);
        });
}

function displayWikiResults(responseJson) {
    let pagesIdSearch = Object.keys(responseJson.query.pages);
    let wikiPagesId = checkValue(responseJson.query.pages[pagesIdSearch].pageid);
    let wikiPic = checkURL(responseJson.query.pages[wikiPagesId].thumbnail.source);
    $('#wikiResults').append(
        `<div id="wiki-container" role="text">
        <span><h3>${responseJson.query.pages[wikiPagesId].title}: ${responseJson.query.pages[wikiPagesId].description}</h3>
        <p class="extract"><img id="city-image" src="${wikiPic}" alt="" />${responseJson.query.pages[wikiPagesId].extract}</p></span>
        </div>`
    )
}

function getWiki(cityName) {
    const strCityName = cityName;
    const cityNameOnly = "'" + strCityName.split(",").shift() + "'"
    let url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages|images|info|description|extracts&piprop=thumbnail&pithumbsize=1020&explaintext&exsentences=4&exlimit=1&generator=search&gsrlimit=1&gsrsearch=" + encodeURIComponent(cityNameOnly);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWikiResults(responseJson))
        .catch(err => {
            $('#js-error-message-wiki').html(`<p>Wikipedia results for this location are unavailable at this time, please try again later.</p>`);
        });
}

function displayYoutubeResults(responseJson) {
    for (let i = 0; i < responseJson.items.length; i++) {
        checkText(responseJson.items[i].id.videoId);
        $('#youtubeResults').append(
            `<div id="video-container" role="text">
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><img controls class="videoThumbnail" src="${responseJson.items[i].snippet.thumbnails.medium.url}" /><a/>
        <h3>${responseJson.items[i].snippet.title}</h3>
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><button class="watch">Watch Video</button></a>
        </div>`
        )
    };
}

function getYoutube(cityName) {
    const strCityName = cityName;
    const cityNameOnly = "'" + strCityName.split(",").shift() + "'"
    const params = {
        q: 'travel&' + cityNameOnly,
        part: 'snippet',
        type: 'video',
        maxResults: '6',
        key: 'AIzaSyB4OGpiDb9zB3bKOfdUxRjPfVuoIrV7ewM'
    }
    const queryString = formatQueryParams(params);
    const url = youtubeUrl + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutubeResults(responseJson))
        .catch(err => {
            $('#js-error-message-youtube').html(`<p>YouTube results for this location are unavailable at this time, please try again later.</p>`);
        });
}

function getCityResults(cityName) {
    getWiki(cityName);
    getNews(cityName);
    getYoutube(cityName);
    getWeather(cityName);
    $('#header').addClass('hidden');
    $('#js-features').removeClass('hidden');
    $('.nav').removeClass('hidden');
    $('.interactive').removeClass('hidden');
}

function startSearch() {
    $('form').submit(event => {
        event.preventDefault();
        const cityName = $('option:selected').text();
        getCityResults(cityName);
    });
}

$('.restart').on('click', function (event) {
    event.preventDefault();
    location.reload();
});

$(function () {
    startSearch();
})
