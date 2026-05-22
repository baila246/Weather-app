import { WiDaySunny, WiCloud, WiRain, WiThunderstorm } from "react-icons/wi";
import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  const API = "https://weather-app-production-5b2e.up.railway.app";

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

      const res = await axios.get(`${API}/weather`, {
        params: { city }
      });

      const res2 = await axios.get(`${API}/forecast`, {
        params: { city }
      });

      setWeather(res.data);

      const filtered = res2.data.list.slice(0, 5);
      setForecast(filtered);

      // chart data
      const chart = res2.data.list.slice(0, 8).map(item => ({
        time: item.dt_txt.split(" ")[0],
        temp: item.main.temp
      }));

      setChartData(chart);

    } catch (err) {
      alert("Error fetching weather");
    }

    setLoading(false);
  };

  return (
    <div className={dark ? "app dark" : "app light"}>

      <div className="container">

        {/* HEADER */}
        <div className="topBar">
          <h1>Weather Pro</h1>

          <button onClick={() => setDark(!dark)}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* SEARCH */}
        <div className="searchBox">

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
          />

          <button onClick={getWeather}>
            Search
          </button>

        </div>

        {loading && <p>Loading...</p>}

        {/* WEATHER CARD */}
        {weather && weather.main && (

          <div className="card">

            <h2>{weather.name}</h2>

            <div className="icon">
              {getWeatherIcon(weather.weather[0].description)}
            </div>

            <h1>{Math.round(weather.main.temp)}°C</h1>

            <p>{weather.weather[0].description}</p>

            <div className="grid">

              <div className="box">Humidity {weather.main.humidity}%</div>
              <div className="box">Wind {weather.wind.speed}</div>
              <div className="box">Pressure {weather.main.pressure}</div>
              <div className="box">Feels {weather.main.feels_like}°C</div>

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

                  <h3>{Math.round(item.main.temp)}°C</h3>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* CHART */}
        {chartData.length > 0 && (

          <div className="chartBox">

            <h3>Temperature Trend</h3>

            <ResponsiveContainer width="100%" height={250}>

              <LineChart data={chartData}>

                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;