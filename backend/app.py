from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)

# ✅ MUST be here
CORS(app)

API_KEY = "9ac3deca19f586380a4b726d64917ca4"

@app.route("/forecast")
def forecast():
    city = request.args.get("city")

    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)

    return jsonify(response.json())

@app.route("/weather")
def weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "city parameter is required"}), 400
@app.route("/")
def home():
    return "Weather API is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)