// ============================================================
// AgriGuard AI — Weather Service
// TODO: Replace with API Gateway + Lambda (e.g., OpenWeatherMap API)
// ============================================================

import { mockWeather, mockForecast } from '../data/mockData';
import type { WeatherData, WeatherForecast } from '../types';

export const weatherService = {
  async getCurrentWeather(): Promise<WeatherData> {
    await new Promise((r) => setTimeout(r, 500));
    return mockWeather;
  },

  async getForecast(): Promise<WeatherForecast[]> {
    await new Promise((r) => setTimeout(r, 500));
    return mockForecast;
  },
};
