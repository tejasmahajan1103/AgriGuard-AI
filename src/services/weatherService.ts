// ============================================================
// AgriGuard AI — Weather Service
// Connected to AWS API Gateway + OpenWeather Backend
// ============================================================

import { WEATHER_API_URL } from '../config/weather';
import { cognitoAuth } from './cognitoAuth';
import { mockForecast } from '../data/mockData';
import type { RealWeatherData, WeatherForecast } from '../types';

/**
 * Retrieve the active Cognito idToken, refreshing if expired
 */
async function getValidIdToken(): Promise<string> {
  const tokens = cognitoAuth.getStoredTokens();

  if (!tokens || !tokens.idToken) {
    throw new Error('Authentication required. Please sign in to view live weather data.');
  }

  // If token is expired or about to expire in 30s, attempt refresh
  if (tokens.expiresAt && tokens.expiresAt - Date.now() < 30_000) {
    if (tokens.refreshToken) {
      try {
        const refreshed = await cognitoAuth.refreshSession(tokens.refreshToken);
        return refreshed.idToken;
      } catch {
        cognitoAuth.clearStoredTokens();
        throw new Error('Your session has expired. Please sign in again.');
      }
    } else {
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  return tokens.idToken;
}

export const weatherService = {
  /**
   * Fetch live weather data from AWS API Gateway using Cognito JWT ID Token
   */
  async getCurrentWeather(): Promise<RealWeatherData> {
    const idToken = await getValidIdToken();

    let response: Response;
    try {
      response = await fetch(WEATHER_API_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch {
      throw new Error('Unable to connect to the weather service. Please check your network connection.');
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized. Your session may be invalid or expired. Please sign in again.');
      }

      let errorMessage = 'Failed to retrieve weather data from server.';
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // use default error message
      }

      throw new Error(errorMessage);
    }

    const data: RealWeatherData = await response.json();

    if (!data || typeof data.temperature === 'undefined') {
      throw new Error('Invalid weather data received from server.');
    }

    return data;
  },

  /**
   * Get 7-day weather forecast
   */
  async getForecast(): Promise<WeatherForecast[]> {
    return mockForecast;
  },
};
