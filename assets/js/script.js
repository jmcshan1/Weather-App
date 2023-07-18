var currentDate = dayjs().format('M/D/YYYY');
var searchButtonEl = $('#search-button');
var userCityEl = $('#user-city-name')
var weatherApiKey = 'cb47f49a6af87f2d9fee75b2e1c52c27';

function fetchCityWeatherData(lat,lon){
    var weatherApi = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid='+ weatherApiKey;
    console.log(weatherApi);
    fetch(weatherApi)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            console.log(data.list[0].main.temp);
            console.log(data.list[0].main.humidity);
            console.log(data.list[0].wind.speed);
            var currentTemp = (((data.list[0].main.temp - 273.15) * 9/5) + 32).toFixed(2);
            var currentWind = data.list[0].main.humidity;
            var currentHumidity = data.list[0].wind.speed;

            appendCurrentDate(currentTemp, currentWind, currentHumidity);
            for(var i = 0; i < data.list.length; i + 7){
                var tempF = (((data.list[i].main.temp - 273.15) * 9/5) + 32).toFixed(2);
                var temp = tempF.toFixed(2);
                var wind = data.list[i].main.humidity;
                var humidity = data.list[i].wind.speed;
                appendWeatherCard(temp,wind,humidity);
            }
            
        })
}

function appendCurrentDate(temp, wind,humidity){
    var tempEl = $('#temperature');
    var windEl = $('#wind-speeds');
    var humidityEl = $('#humidity');

    tempEl.text(temp + '°F');
    windEl.text(wind + " MPH");
    humidityEl.text(humidity + " %");
}

function appendWeatherCard(temp,wind,humidity){
    var cardTempEl = $('<p>' + temp + '°F</p>')
    var cardWindEl = $('<p>' +wind + ' MPH</p>')
    var cardHumidityEl = $('<p>' + humidity + ' %</p>')
}

function convertUserCity(city){
    var convertCityApi = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=cb47f49a6af87f2d9fee75b2e1c52c27'
    var latitude = '';
    var longitude = '';
    fetch(convertCityApi)
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function(data){
            console.log(data);
            latitude = data[0].lat;
            console.log(latitude);
            longitude = data[0].lon;
            console.log(longitude);
            fetchCityWeatherData(latitude,longitude);
        })
    
        
}

searchButtonEl.on('click', function(event){
    event.preventDefault()
    var userCity = userCityEl.val();
    console.log(userCity);
    convertUserCity(userCity);

});