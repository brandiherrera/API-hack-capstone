'use strict';

const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast"
const newsUrl = "https://newsapi.org/v2/everything"
const youtubeUrl = "https://www.googleapis.com/youtube/v3/search"

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        console.log("formatQueryParams complete");
        return queryItems.join('&');
}

function displayWeatherResults(responseJson) {
    console.log(responseJson);
  /*$(function(event) {*/
        for (let i=0; i<=41; i++) {
        console.log("forLoop working");
        if (responseJson.list[i].dt_txt.slice(11) === '12:00:00') {
        console.log(i);
        /*return i*/

    let cityName = $('option:selected').text().trim().replace(" , ", ", ");
    let kelvin = responseJson.list[i].main.temp;
    let fahrenheit = (kelvin * (9/5)) - 459.67
    let weatherIcon = responseJson.list[i].weather[0].icon;
    let wind = responseJson.list[i].wind.speed;
    let description = responseJson.list[i].weather[0].description;
    let rawDate = responseJson.list[i].dt_txt;
/*
    $(function() {
        $(rawDate).shift();
        console.log(rawDate);
    }
    $(rawDate).shift();
    console.log($(rawDate).shift());*/

    $('#weatherResults').append(
        `
        <div id="weather-container" role="text">
        <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather icon" class="weather-icon" />
        <h4>${rawDate}</h4>
        <p>${fahrenheit.toFixed(0)}°F</p>
        <p class="description">${description}</p>
        
        `
    )};
    };
}




function getWeather(cityName) {
    console.log(cityName);
    const params = {
        q: cityName,
        APPID: 'c894bfba04e757cc13b20cad7b39e4c6'
    };
    const queryString = formatQueryParams(params);
    const url = weatherUrl + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            if (response === 'city not found') {
                return $('#js-error-message-weather').text(`Something went wrong, please try again: ${err.message}`);
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeatherResults(responseJson))
        .catch(err => {
            /*$('#js-error-message-weather').text(`Something went wrong, please try again: ${err.message}`);*/
        });
        console.log("getWeather working");
}


function displayNewsResults(responseJson) {
    console.log(responseJson);
    
    for (let i=0; i<6; i++) {
    let articleTitle = responseJson.articles[i].title;

    $('#newsResults').append(
        `
        <div class="accordion" role="menu">${articleTitle}</div>
            <div class="panel" role="menuitem">
                <img src="${responseJson.articles[i].urlToImage}" />
                <p class="article-content">${responseJson.articles[i].content}</p>
                <a href="${responseJson.articles[i].url}" target="_blank"><button class="open">Read More</button></a>
            </div>
        `
    )};
    console.log("displayNewsResults working");
    $('.accordion').on('click', function() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        
        if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
    console.log("accordion click working");
        });
}

$('.accordion-landing').on('click', function() {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    
    if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
console.log("accordion click working");
    });

function getNews(cityName) {
    const strCityName = cityName;
    console.log(strCityName);
    const cityNameOnly = strCityName.split(",").shift();
    console.log(cityNameOnly);
    const params = {
        q: cityNameOnly,
        apiKey: '5358d981d8e94c6ca98e1b3831164df1'
    }
    const queryString = formatQueryParams(params);
    const url = newsUrl + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => {
            console.log(err.message);
            $('#js-error-message-news').text(`Something went wrong, please try again: ${err.message}`);
        });
        console.log("getNews working");
}

function displayWikiResults(responseJson) {
    console.log(responseJson);
    let pagesIdSearch = Object.keys(responseJson.query.pages);
    let wikiPagesId = responseJson.query.pages[pagesIdSearch].pageid;
    let wikiPic = responseJson.query.pages[wikiPagesId].thumbnail.source;
    $('#wikiResults').append(
        `
        <div id="wiki-container" role="text">
        <span><h3>${responseJson.query.pages[wikiPagesId].title}: ${responseJson.query.pages[wikiPagesId].description}</h3>
        <p class="extract"><img id="city-image" src="${wikiPic}" alt="" />${responseJson.query.pages[wikiPagesId].extract}</p></span>
        
        
        </div>
        `
    )
    console.log("getWikiResults working");
}

function getWiki(cityName) {
    const strCityName = cityName;
    const cityNameOnly = "'" + strCityName.split(",").shift() + "'"
    console.log(cityNameOnly);
    let url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages|images|info|description|extracts&piprop=thumbnail&pithumbsize=1020&explaintext&exsentences=4&exlimit=1&generator=search&gsrlimit=1&gsrsearch=" + encodeURIComponent(cityNameOnly);
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWikiResults(responseJson))
        .catch(err => {
            $('#js-error-message-wiki').text(`Something went wrong, please try again: ${err.message}`);
        });
        console.log("getWiki working");
}

function displayYoutubeResults(responseJson) {
    console.log(responseJson)
    for (let i=0; i<10; i++) {
    let video = responseJson.items[i];
    $('#youtubeResults').append(
        `
        <div id="video-container" role="text">
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><img controls class="videoThumbnail" src="${responseJson.items[i].snippet.thumbnails.medium.url}" /><a/>
        <h3>${responseJson.items[i].snippet.title}</h3>
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><button class="watch">Watch Video</button></a>
        </div>
        `
    )};
}

function getYoutube(cityName) {
    const strCityName = cityName;
    const cityNameOnly = "'" + strCityName.split(",").shift() + "'"
    const params = {
        q: 'travel&'+cityNameOnly,
        part: 'snippet',
        type: 'video',
        maxResults: '6',
        key: 'AIzaSyB4OGpiDb9zB3bKOfdUxRjPfVuoIrV7ewM'
    }
    const queryString = formatQueryParams(params);
    const url = youtubeUrl + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutubeResults(responseJson))
        .catch(err => {
            console.log(err.message);
            /*$('#js-error-message-youtube').text(`Something went wrong, please try again: ${err.message}`);*/
        });
        console.log("getYoutube working");
}

function getCityResults(cityName) {
    console.log("getCityResults working")
    getWeather(cityName);
}

function getMoreCityResults(cityName) {
    console.log("getMoreCityResults working")
    getNews(cityName);
    getWiki(cityName);
    getYoutube(cityName);
    $('#header').addClass('hidden');
    $('#js-features').removeClass('hidden');
    $('.nav').removeClass('hidden');
    $('.interactive').removeClass('hidden');
}

function startSearch() {
    $('form').submit(event => {
        event.preventDefault();
        const cityName = $('option:selected').text().trim().replace(" , ", ", ");
        console.log(cityName);
        getCityResults(cityName);
        console.log("getCityResults working");
        getMoreCityResults(cityName);
    });
}
/*
function hamburgerClick() {
    $('.hamburger').classList.toggle("show");
}
$('.hamburger').on('click', function(event) {
    event.preventDefault();

})*/

$('.restart').on('click', function(event) {
    event.preventDefault();
    location.reload();
    console.log("restartSearch working");
});

/*$('.footer').removeClass('hidden');*/

$(function() {
    console.log("app working"); 
    startSearch();
    /*$('.footer').removeClass('hidden');*/
})
