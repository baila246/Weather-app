import { WiDaySunny, WiCloud, WiRain, WiThunderstorm } from "react-icons/wi";
import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWeatherIcon = (desc) => {
    if (!desc) return <WiDaySunny />;

    desc = desc.toLowerCase();

    if (desc.includes("rain")) return <WiRain size={60} />;
    if (desc.includes("cloud")) return <WiCloud size={60} />;
    if (desc.includes("thunder")) return <WiThunderstorm size={60} />;

    return <WiDaySunny size={60} />;
  };

  const getWeather = async () => {

    if (!city) return alert("Enter a city");

    setLoading(true);

    try {

      // CURRENT WEATHER
      const res = await axios.get("https://weather-app-production-5b2e.up.railway.app/weather", {
        params: { city }
      });

      setWeather(res.data);

      // FORECAST
      const res2 = await axios.get("https://weather-app-production-5b2e.up.railway.app/forecast", {
        params: { city }
      });

      setForecast(res2.data.list.slice(0, 5));

    } catch (err) {

      alert("Error fetching weather");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="app">

      <div className="container">

        <h1 className="title">🌤 Weather Dashboard</h1>

        {/* SEARCH */}
        <div className="searchBox">

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city (e.g. Lahore)"
          />

          <button onClick={getWeather}>
            Search
          </button>

        </div>

        {loading && <p className="loading">Loading...</p>}

        {/* WEATHER CARD */}
        {weather && weather.main && (

          <div className="card">

            <h2>{weather.name}</h2>

            <div style={{ fontSize: "60px" }}>
              {getWeatherIcon(weather.weather[0].description)}
            </div>

            <h1>{weather.main.temp}°C</h1>

            <p className="desc">
              {weather.weather[0].description}
            </p>

            <div className="grid">

              <div className="box">
                <p>Humidity</p>
                <h3>{weather.main.humidity}%</h3>
              </div>

              <div className="box">
                <p>Wind</p>
                <h3>{weather.wind.speed} m/s</h3>
              </div>

              <div className="box">
                <p>Pressure</p>
                <h3>{weather.main.pressure}</h3>
              </div>

              <div className="box">
                <p>Feels Like</p>
                <h3>{weather.main.feels_like}°C</h3>
              </div>

            </div>

          </div>
        )}

        {/* FORECAST */}
        {forecast.length > 0 && (

          <div className="forecast">

            <h3>5-Day Forecast</h3>

            <div className="forecastGrid">

              {forecast.map((item, index) => (

                <div key={index} className="forecastCard">

                  <p>{item.dt_txt.split(" ")[0]}</p>

                  <h3>{item.main.temp}°C</h3>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;