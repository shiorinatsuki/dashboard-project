const apiKey = "ee3aee50a7676039a77599f7bba83a61";
let weatherChart = null;

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("weatherResult").innerHTML = `<p class="text-red-600">Please enter a city name.</p>`;
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      // Display weather text
      const result = `
        <h2 class="text-2xl font-semibold">${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp} °C</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌤️ Weather: ${data.weather[0].description}</p>
      `;
      document.getElementById("weatherResult").innerHTML = result;

      // Data for chart
      const labels = ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'];
      const values = [data.main.temp, data.main.humidity, data.wind.speed];

      // Destroy previous chart if exists
      if (weatherChart !== null) {
        weatherChart.destroy();
      }

      const ctx = document.getElementById("weatherChart").getContext("2d");
      weatherChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Weather Data",
            data: values,
            backgroundColor: [
              "rgba(59, 130, 246, 0.6)",   // blue
              "rgba(34, 197, 94, 0.6)",    // green
              "rgba(234, 179, 8, 0.6)"     // yellow
            ],
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      document.getElementById("weatherResult").innerHTML = `<p class="text-red-600">City not found.</p>`;
      if (weatherChart !== null) {
        weatherChart.destroy();
        weatherChart = null;
      }
    }
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p class="text-red-600">Error fetching data.</p>`;
  }
}
