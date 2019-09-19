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

function getDay(responseJson) {
for (let i=0; i<responseJson.length; i++) {
    if (i===0 || i%8===0) {
        return
};
};}

function displayWeatherResults(responseJson) {
    console.log(responseJson);
    for (let i=0; i<=41; i++) 
        /*if (i===0 || i%8===0) {*/
        if (responseJson.list[i].dt_txt.slice(11) === '12:00:00') {
        console.log(i);
    let cityName = $('option:selected').text().trim().replace(" , ", ", ");
    let kelvin = responseJson.list[i].main.temp;
    let fahrenheit = (kelvin * (9/5)) - 459.67
    let weatherIcon = responseJson.list[i].weather[0].icon;
    let wind = responseJson.list[i].wind.speed;
    let description = responseJson.list[i].weather[0].description;
    let rawDate = responseJson.list[i].dt_txt;

    $('#weatherResults').append(
        `
        <div id="weather-container"><h4>${rawDate}</h4>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" />
        <p>${fahrenheit.toFixed(0)}°F</p>
        <p>${description}</p>
        <p>Wind: ${wind} m/h</p></div>
        `
    )};
}
    /*
    $('#weatherResults').append(
        `<span><div class="weather-container">
        <p>Weather for ${cityName}</p>
        <img src="http://openweathermap.org/img/wn/${responseJson.weather[0].icon}@2x.png" />
        <p>${fahrenheit.toFixed(0)}°F</p>
        <p>Wind: ${responseJson.wind.speed} m/h ${responseJson.weather[0].description}</p>
        </div></span>
        `
    );
    */
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
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeatherResults(responseJson))
        .catch(err => {
            $('#js-error-message-weather').text(`Something went wrong, please try again: ${err.message}`);
        });
        console.log("getWeather working");
}
/*
q={city name},{country code}
function getWeather(cityId) {
    const params = {
        id: cityId,
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
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeatherResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong, please try again.`);
        });
        console.log("getWeather working");
}
*/


function displayNewsResults(responseJson) {
    console.log(responseJson);
    
    for (let i=0; i<6; i++) {
    let articleTitle = responseJson.articles[i].title;

    $('#newsResults').append(
        `
        <div class="accordion">${articleTitle}</div>
            <div class="panel">
                <img src="${responseJson.articles[i].urlToImage}" />
                <p class="article-content">${responseJson.articles[i].content}</p>
                <a href="${responseJson.articles[i].url}" target="_blank"><button class="open">read more</button></a>
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

/*<p>By ${responseJson.articles[i].author}, ${responseJson.articles[i].source.name}</p>*/



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
        `<h3>${responseJson.query.pages[wikiPagesId].title}: ${responseJson.query.pages[wikiPagesId].description}</h3>
        <p>${responseJson.query.pages[wikiPagesId].extract}</p>
        <img id="city-image" src="${wikiPic}" />
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
        <div id="video-container">
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><img controls class="videoThumbnail" src="${responseJson.items[i].snippet.thumbnails.medium.url}" /><a/>
        <h3>${responseJson.items[i].snippet.title}</h3>
        <p>${responseJson.items[i].snippet.description}</p>
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><button class="watch">watch video</button>
        </div>
        `
    )};
}

function getYoutube(cityName) {
    const strCityName = cityName;
    const cityNameOnly = "'" + strCityName.split(",").shift() + "'"
    const params = {
        part: 'snippet',
        /*fields: 'items',*/
        type: 'video',
        q: 'travel&'+cityNameOnly,
        maxResults: '4',
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
            $('#js-error-message-youtube').text(`Something went wrong, please try again: ${err.message}`);
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
    /*getYoutube(cityName);*/
    $('#header').addClass('hidden');
    $('.main').removeClass('hidden');
}

function startSearch() {
    $('form').submit(event => {
        event.preventDefault();
        /*const cityId = $('#js-city-search').val();*/
        const cityName = $('option:selected').text().trim().replace(" , ", ", ");
        /*console.log(cityId);*/
        console.log(cityName);
        getCityResults(cityName);
        console.log("getCityResults working");
        getMoreCityResults(cityName);
    });
}

$('.restart').on('click', function(event) {
    event.preventDefault();
    location.reload();
    console.log("restartSearch working");
});

$(function() {
    console.log("app working"); 
    startSearch();
})
