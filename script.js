// got this api id from "https://www.openweathermap.org" after creating my own account
const api= '1a5bee9b39c08491cc5d6b8c3161c1ce';
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

const input_city = document.querySelector('.input_city');
const button = document.querySelector('.button');
const lon = document.querySelector('.lon');
const lat = document.querySelector('.lat');

const currentWeatherItems = document.getElementById("current-weather-items");
const timezoneEl = document.getElementById("location");
const countryEl = document.getElementById("country");
const futureForecastEl = document.getElementById("future-forecast");
const currentTempEl = document.getElementById("info_tab");


function time_info(timezone)
{
    let tz = timezone;
    setTimeout(()=>
    {
        timeEl.innerHTML = new Date().toLocaleString("en-US", {
            timeZone: tz,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit"
        });

        dateEl.innerHTML = new Date().toLocaleString("en-US", {
            timeZone: tz,
            weekday: "long",
            day: "numeric",
            month: "short"
        });

    }, 1000);
}

button.addEventListener('click', function()
{
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input_city.value + '&appid=' + api)
        .then(response => response.json())
        .then(data =>
        {
            console.log(data);
            timezoneEl.innerHTML = data.name;
            countryEl.innerHTML = data.sys.country;

            let longitude = data['coord']['lon'];
            let latitude = data['coord']['lat'];

            lon.innerHTML = longitude + " E)";
            lat.innerHTML = "(" + latitude + " N -";

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon='
                + longitude + '&exclude=hourly,minutely&units=metric&appid=' + api)
                .then(r => r.json())
                .then(data =>
                {
                    console.log(data);
                    showData(data);
                });
        })

        .catch(err => alert("Wrong city name!"));
})

function showData (data)
{
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    let tz = data.timezone;
    time_info(tz);

    currentWeatherItems.innerHTML =
        `<div class="weather-item">
                <p>Humidity:</p>
                <p>${humidity}%</p>
            </div>
            <div class="weather-item">
                <p>Pressure:</p>
                <p>${pressure} hPa</p>
            </div>
            <div class="weather-item">
                <p>Wind Speed:</p>
                <p>${wind_speed} m/s</p>
            </div>
            <div class="weather-item">
                <p>Sunrise:</p>
                <p>${window.moment(sunrise * 1000).format('HH:mm')}</p>
            </div>
            <div class="weather-item">
                <p>Sunset:</p>
                <p>${window.moment(sunset * 1000).format('HH:mm')}</p>
            </div>`;

    let nextDay = '';
    data.daily.forEach((day, i) =>
    {
        if(i === 0)
        {
            currentTempEl.innerHTML =
                `<div class="img_box">
        <img class="img_desc" src="./IconPack/${day.weather[0].icon}.png" alt="weather icon">
    </div>
    <div class="description">${day.weather[0].description}</div>
    <div class="temp">${data.current.temp}&#176;C</div>
    <div class="range">
        <div class="min">${day.temp.min}&#176;C -</div>
        <div class="max">&nbsp;${day.temp.max}&#176;C</div>`;
        }
        else
        {
            nextDay += `
            <div class="future-forecast-box">
                <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="w_icon_box">
                    <img src="./IconPack/${day.weather[0].icon}.png" class="w_icon" alt="weather icon">
                </div>
                <div class="min-temp">${day.temp.min}&#176;C</div>
                <div class="max-temp">${day.temp.max}&#176;C</div>
            </div>
            `
        }
    })
    futureForecastEl.innerHTML = nextDay;
}
