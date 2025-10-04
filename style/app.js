
const _city = document.querySelector('.city');
const _temp = document.querySelector('.temp');
const _humidity = document.querySelector('.humidity');
const _wind = document.querySelector('.wind');
const _inp = document.querySelector('.inp');
const _btn = document.querySelector('.btn');
const _weatherImg = document.querySelector('.weather_img');
const weatherInfoDiv = document.querySelector('.weatherInfo');
const _audioPlay = document.getElementById('audioPlay')

const weatherIcons = {
  Clear: "img/clear-day.svg",
  Clouds: "img/overcast-day.svg",
  Mist: "img/fog.svg",
  Rain: "img/11.gif",
  Dust: "img/dust.png",
  Snow: "img/snow.svg",
  Drizzle: "img/drizzle.svg"
};

const apikey = "18b3d49f58d3e2dd8afb45a56c9fb235";
const apiurl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

function getDateString(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
}

async function checkWeather(cityName) {
  try {
    const res = await fetch(`${apiurl}${cityName}&appid=${apikey}`);
    if (!res.ok) throw new Error("❌ شهر پیدا نشد یا مشکل در سرور");
    const data = await res.json();

    /////////////// وضعیت فعلی///////////////////////////////////////////
    const current = data.list[0];
    _city.innerText = data.city.name;
    _temp.innerText = Math.round(current.main.temp) + '°C';
    _humidity.innerText = current.main.humidity + '%';
    _wind.innerText = (current.wind.speed * 3.6).toFixed(1) + ' km/h';
    _weatherImg.src = weatherIcons[current.weather[0].main] || "img/default.png";
    ///////////////////////////بکگروند وصدای زمینه//////////////////////////////////////
    const body = document.body;
    const weatherMain = current.weather[0].main;
    switch (weatherMain) {
      case "Mist":
        body.style.backgroundImage = "url('img/mistgif.gif')";
        _audioPlay.src = "audio/wind-sound-301491.mp3";
        break;
      case "Rain":
        body.style.backgroundImage = "url('audio/rain-gif.gif')";
        _audioPlay.src = "audio/chill-rain-patreon-sample-364447.mp3";
        break;
      case "Clouds":
        body.style.backgroundImage = "url('img/U8cAor.gif')";
        _audioPlay.src = "audio/forest-beach-63843.mp3";
        break;
      case "Clear":
        body.style.backgroundImage = "url('img/افتابی صاف.webp')";
        _audioPlay.src = "audio/nature-sounds-240504.mp3";
        break;
      case "Snow":
        body.style.backgroundImage = "url('img/snowgif.gif')";
        _audioPlay.src = "audio/sound-of-falling-snow-211055.mp3";
        break;
      case "Drizzle":
        body.style.backgroundImage = "url('img/rain-dezi.gif')";
        _audioPlay.src = "audio/drizzle-4perspectives-23254.mp3";
        break;
      default:
        body.style.backgroundImage = "";
        _audioPlay.src = "";
    }


    ///////////////////////پیش‌بینی روزهای آینده////////////////////////
    weatherInfoDiv.innerHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
      const day = data.list[i];
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';
      dayDiv.innerHTML = `
  <strong>${getDateString(day.dt_txt)}</strong>
  <img src="${weatherIcons[day.weather[0].main] || "img/default.png"}" alt="">
  <div>🌡 ${Math.round(day.main.temp)}°C</div>
  <div>💧 ${day.main.humidity}%</div>
  <div>💨 ${(day.wind.speed * 3.6).toFixed(1)} km/h</div>
  <div>${day.weather[0].main}</div>
`;

      weatherInfoDiv.appendChild(dayDiv);
    }
  } catch (err) {
    _city.innerText = err.message;
    _temp.innerText = _humidity.innerText = _wind.innerText = "--";
    _weatherImg.src = "";
  }
}

_btn.addEventListener('click', () => {
  checkWeather(_inp.value);
  _weatherImg.style.display = 'block'
});
