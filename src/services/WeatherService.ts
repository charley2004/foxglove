// WeatherService.ts — OpenWeather API integration
// The weather condition feeds into the audio engine to adapt layers.
// V2: Could also adapt UI gradients based on weather.

import axios from 'axios';

const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  condition: string;    // 'Rain', 'Clear', 'Clouds', etc.
  description: string;
  temp: number;
  city: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
    });
    return {
      condition: res.data.weather[0].main,
      description: res.data.weather[0].description,
      temp: Math.round(res.data.main.temp),
      city: res.data.name,
    };
  } catch (err) {
    console.warn('[WeatherService] Failed to fetch weather:', err);
    return null;
  }
}