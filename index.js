'use strict';

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather"
const newsUrl = "https://newsapi.org/v2/everything"

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        console.log("formatQueryParams complete");
        return queryItems.join('&');
}

function displayWeatherResults(responseJson) {
    console.log(responseJson);
    /*$('#js-results').empty();
    console.log("empty working");*/
    let kelvin = responseJson.main.temp 
    let fahrenheit = (kelvin * (9/5)) - 459.67
    $('.weather').append(
        `<p>Temperature: ${fahrenheit.toFixed(0)}°F</p>`
    )
    $('.main').removeClass('hidden')
}

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

function displayNewsResults(responseJson) {
    console.log(responseJson);
    
    for (let i=0; i<10; i++) {
    let articleTitle = responseJson.articles[i].title;
    console.log(articleTitle);
    $('.news').append(
        `<p>${articleTitle}</p>
        `
    )};
    console.log("displayNewsResults working");
}


function getNews(cityName) {
    const strCityName = cityName;
    console.log(strCityName);
    const query = strCityName.split(",").shift();
    console.log(query);
    const params = {
        q: query,
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
            $('#js-error-message').text(`Something went wrong, please try again.`);
        });
        console.log("getNews working");
}


function getCityResults(cityId) {
    console.log("getCityResults working")
    getWeather(cityId);
}

function getMoreCityResults(cityName) {
    console.log("getMoreCityResults working")
    getNews(cityName);
}

function startSearch() {
    $('form').submit(event => {
        event.preventDefault();
        const cityId = $('#js-city-search').val();
        const cityName = $('option').text();
        console.log(cityId);
        console.log(cityName);
        getCityResults(cityId);
        console.log("getCityResults working");
        getMoreCityResults(cityName) 
    });
}



/*
function anotherSearch() {
    $('#footer').on('click', '#js-another-city', function(event) {
        document.getElementById('form').reset();
        $('.js-city-search').emtpy();
        console.log("anotherSearch working");
    });
}
*/

$(function() {
    console.log("app working"); 
    startSearch();
})
