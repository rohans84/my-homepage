const weatherIcons = {
    '01d': 'fa-solid fa-sun',                    // clear sky (day)
    '01n': 'fa-solid fa-moon',                   // clear sky (night)
    '02d': 'fa-solid fa-cloud-sun',              // few clouds (day)
    '02n': 'fa-solid fa-cloud-moon',             // few clouds (night)
    '03d': 'fa-solid fa-cloud',                  // scattered clouds
    '03n': 'fa-solid fa-cloud',
    '04d': 'fa-solid fa-cloud',                  // broken clouds
    '04n': 'fa-solid fa-cloud',
    '09d': 'fa-solid fa-cloud-showers-heavy',    // shower rain
    '09n': 'fa-solid fa-cloud-showers-heavy',
    '10d': 'fa-solid fa-cloud-sun-rain',         // rain (day)
    '10n': 'fa-solid fa-cloud-moon-rain',        // rain (night)
    '11d': 'fa-solid fa-bolt',                   // thunderstorm
    '11n': 'fa-solid fa-bolt',
    '13d': 'fa-solid fa-snowflake',             // snow
    '13n': 'fa-solid fa-snowflake',
    '50d': 'fa-solid fa-smog',                  // mist
    '50n': 'fa-solid fa-smog'
};

async function updateWeather() {
    // Set a default icon while loading
    const weatherIcon = document.querySelector('.weather-icon i');
    weatherIcon.className = 'fa-solid fa-spinner fa-spin';
    console.log('Weather: Loading...');
    
    try {
        const [config, secrets] = await Promise.all([
            fetch('config/config.json').then(res => res.json()),
            fetch('config/secrets.json').then(res => res.json())
        ]);
        const { location } = config.weather;
        const { weatherApiKey } = secrets;
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=imperial`
        );
        const data = await response.json();
        
        console.log('Weather API Response:', {
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        });
        
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        
        // Update weather icon
        const iconCode = data.weather[0].icon;
        const iconClass = weatherIcons[iconCode] || 'fa-solid fa-cloud';
        console.log('Weather Icon:', { iconCode, iconClass });
        weatherIcon.className = iconClass;
        
        document.querySelector('.weather-temp').textContent = `${Math.round(data.main.temp)}°F`;
        document.querySelector('.weather-condition').textContent = data.weather[0].description;
        document.querySelector('.weather-location').textContent = data.name;
    } catch (error) {
        console.error('Weather Error:', error);
        document.querySelector('.weather-temp').textContent = 'Error';
        document.querySelector('.weather-condition').textContent = 'Could not load weather';
        document.querySelector('.weather-location').textContent = '';
        weatherIcon.className = 'fa-solid fa-exclamation-circle';
    }
}

// Initial call to updateWeather
updateWeather();

// Update weather every 30 minutes
setInterval(updateWeather, 30 * 60 * 1000); 