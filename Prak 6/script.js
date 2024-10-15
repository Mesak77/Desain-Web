// js/script.js

const apiKey = '1bbf392f3d574a7498f23111241510';  // API key yang Anda dapatkan
const city = 'Jakarta';

// URL untuk API WeatherAPI
const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7`;

// Function untuk menampilkan pesan error
function displayError(message) {
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('weather-forecast');

    currentWeatherDiv.innerHTML = `<p class="error">${message}</p>`;
    forecastDiv.innerHTML = `<p class="error">${message}</p>`;
}

// Function untuk memeriksa keberadaan data
function validateData(data) {
    if (!data.current || !data.forecast || !data.forecast.forecastday) {
        throw new Error('Data cuaca tidak lengkap.');
    }

    // Validasi untuk kondisi cuaca saat ini
    if (!data.current.condition || !data.current.condition.icon || !data.current.condition.text) {
        throw new Error('Data kondisi cuaca hari ini tidak lengkap.');
    }

    // Validasi untuk setiap hari dalam ramalan
    data.forecast.forecastday.forEach((day, index) => {
        if (!day.day || !day.day.condition) {
            throw new Error(`Data ramalan cuaca untuk hari ke-${index + 1} tidak lengkap.`);
        }
        if (!day.day.condition.icon || !day.day.condition.text) {
            throw new Error(`Data kondisi cuaca untuk hari ke-${index + 1} tidak lengkap.`);
        }
    });
}

// Fetch data dari WeatherAPI
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Kunci API tidak valid. Silakan periksa kembali.');
            } else if (response.status === 403) {
                throw new Error('Akses API dilarang. Mungkin Anda telah melebihi batas permintaan.');
            } else if (response.status === 404) {
                throw new Error('Kota tidak ditemukan. Silakan periksa nama kota.');
            } else {
                throw new Error(`Gagal mengambil data. Status: ${response.status} ${response.statusText}`);
            }
        }
        return response.json();
    })
    .then(data => {
        try {
            // Validasi struktur data
            validateData(data);

            // Menampilkan cuaca hari ini
            const currentWeatherDiv = document.getElementById('current-weather');
            const currentWeather = data.current;
            const condition = currentWeather.condition;
            currentWeatherDiv.innerHTML = `
                <h2>Cuaca Hari Ini</h2>
                <img src="https:${condition.icon}" alt="${condition.text}" />
                <p>Suhu: ${currentWeather.temp_c}°C</p>
                <p>Deskripsi: ${condition.text}</p>
                <p>Kecepatan Angin: ${currentWeather.wind_kph} km/h</p>
                <p>Kelembapan: ${currentWeather.humidity}%</p>
            `;

            // Menampilkan ramalan cuaca 7 hari ke depan
            const forecastDiv = document.getElementById('weather-forecast');
            let forecastHTML = '';
            data.forecast.forecastday.forEach((day) => {
                const date = new Date(day.date);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('id-ID', options);
                const dayCondition = day.day.condition;

                forecastHTML += `
                    <div class="day">
                        <h4>${formattedDate}</h4>
                        <img src="https:${dayCondition.icon}" alt="${dayCondition.text}" />
                        <p>Suhu Siang: ${day.day.maxtemp_c}°C</p>
                        <p>Suhu Malam: ${day.day.mintemp_c}°C</p>
                        <p>Cuaca: ${dayCondition.text}</p>
                    </div>
                `;
            });
            forecastDiv.innerHTML = forecastHTML;
        } catch (validationError) {
            console.error('Validation Error:', validationError);
            displayError(validationError.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayError(error.message || 'Terjadi kesalahan saat mengambil data cuaca. Silakan coba lagi nanti.');
    });
