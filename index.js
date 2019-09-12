
const weatherUrl = "https://api.openweathermap.org/data/2.5/find"


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
    $('.weather').append(
        `<p>"${responseJson.list[0].main.temp}"</p>`
    )
    $('.main').removeClass('hidden')
}

function getWeather(citySearch) {
    const params = {
        q: citySearch,
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
            $('#js-error-message').text(`Something went wrong, please try again.`);
        });
        console.log("getWeather working");
}

function getCityResults(citySearch) {
    console.log("getCityResults working")
    getWeather(citySearch);

}

function startSearch() {
    $('form').submit(event => {
        event.preventDefault();
        const citySearch = $('#js-city-search').val();
        console.log(citySearch);
        
        getCityResults(citySearch);
        console.log("getCityResults working");
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
