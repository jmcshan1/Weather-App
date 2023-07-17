var currentDate = dayjs().format('M/D/YYYY');
var searchButtonEl = $('#search-button');
var userCityEl = $('#user-city-name')

function getCityWeather(lat,lon){
    var weatherApi = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=cb47f49a6af87f2d9fee75b2e1c52c27';
    console.log(weatherApi);
    fetch(weatherApi)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

        })
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
            getCityWeather(latitude,longitude);
        })
    
        
}

searchButtonEl.on('click', function(event){
    event.preventDefault()
    var userCity = userCityEl.val();
    console.log(userCity);
    convertUserCity(userCity);

});