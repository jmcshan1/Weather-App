var currentDate = dayjs().format('M/D/YYYY');
var searchButtonEl = $('#search-button');
var userCityEl = $('#user-city-name');
var weatherApiKey = 'cb47f49a6af87f2d9fee75b2e1c52c27';
var fiveDayForecast = $('#5-day-forecast');
var cityNameEl = $('#city-name');
var searchBarEl = $('#search-bar');

var userSearchHistory = [];

function fetchCityWeatherData(lat,lon){
    var weatherApi = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid='+ weatherApiKey;
    fetch(weatherApi)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var currentTemp = (((data.list[0].main.temp - 273.15) * 9/5) + 32).toFixed(2);
            var currentWind = data.list[0].main.humidity;
            var currentHumidity = data.list[0].wind.speed;
            var currentDate = data.list[0].dt_txt.slice(0,10);
            console.log(currentDate);
            var city = data.city.name;
            if(userSearchHistory.length === 0){
                appendUserSearch(city);
                storeUserSearch(city);
            }else{
                if(!userSearchHistory.includes(city)){
                    appendUserSearch(city);
                    storeUserSearch(city);
                }
            }

            appendCurrentDate(currentTemp, currentWind, currentHumidity,currentDate, city);

            for(var i = 7; i < data.list.length; i = i + 8){
                var date = data.list[i].dt_txt.slice(0,10);
                var tempF = (((data.list[i].main.temp - 273.15) * 9/5) + 32)
                var temp = tempF.toFixed(2);
                var wind = data.list[i].main.humidity;
                var humidity = data.list[i].wind.speed;
                var conditionIcon = data.list[i].weather[0].icon;

                appendWeatherCard(temp,wind,humidity,date,conditionIcon);
                
            }
        })
}

function init(){
    var storedSearchHistory = JSON.parse(localStorage.getItem('userSearchHistory'));
    
    if(storedSearchHistory !==null){
        console.log(userSearchHistory);
        for(var i = 0; i < storedSearchHistory.length; i++){
            userSearchHistory[i] = storedSearchHistory[i];
            appendUserSearch(storedSearchHistory[i]);
        }
    }
}

function appendUserSearch(city){
    console.log(userSearchHistory);
    var searchedCityEl = $('<button>' + city + '</button>');
    searchedCityEl.attr('class','searched-city btn btn-secondary w-100 mb-3');
    searchedCityEl.attr('id','city');
    searchBarEl.append(searchedCityEl);
}

function storeUserSearch(city){
    userSearchHistory.push(city);
    localStorage.setItem('userSearchHistory', JSON.stringify(userSearchHistory));
}

function appendCurrentDate(temp, wind,humidity,date,city){
    var dateFormatted = dayjs(date).format('M/D/YYYY');

    var cityDate = $('#city-name');
    var tempEl = $('#temperature');
    var windEl = $('#wind-speeds');
    var humidityEl = $('#humidity');

    cityDate.text(city + ' (' + dateFormatted + ')');
    tempEl.text(temp + '°F');
    windEl.text(wind + " MPH");
    humidityEl.text(humidity + " %");
}

function appendWeatherCard(temp,wind,humidity,date,condition){
    var weatherCardDivEl = $('<div></div>')
    weatherCardDivEl.attr('class','card col bg-primary-subtle')
    fiveDayForecast.append(weatherCardDivEl);
    
    var weatherIconEl = $('<img>')
    weatherIconEl.attr('src','https://openweathermap.org/img/wn/'+ condition +'@2x.png')
    var dateFormatted = dayjs(date).format('M/D/YYYY');
    var dateEl = $('<h4>'+dateFormatted + '</h4>');
    var cardTempEl = $('<p>Temp: ' + temp + '°F</p>')
    var cardWindEl = $('<p>Wind: ' +wind + ' MPH</p>')
    var cardHumidityEl = $('<p>Humidity: ' + humidity + ' %</p>')

    
    weatherCardDivEl.append(dateEl);
    weatherCardDivEl.append(weatherIconEl);
    weatherCardDivEl.append(cardTempEl);
    weatherCardDivEl.append(cardWindEl);
    weatherCardDivEl.append(cardHumidityEl);
}

function convertUserCity(city){
    var convertCityApi = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=cb47f49a6af87f2d9fee75b2e1c52c27'
    var latitude = '';
    var longitude = '';
    fetch(convertCityApi)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            latitude = data[0].lat;
            longitude = data[0].lon;
            fetchCityWeatherData(latitude,longitude);
        })
}

searchButtonEl.on('click', function(event){
    event.preventDefault()
    fiveDayForecast.empty();
    var userCity = userCityEl.val();
    convertUserCity(userCity);

});

searchBarEl.on('click', '.searched-city', function(event){
    fiveDayForecast.empty();
    var userCity = event.target.textContent;
    convertUserCity(userCity);
});

init();