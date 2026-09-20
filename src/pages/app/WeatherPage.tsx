import { useState, useEffect, useCallback } from 'react';
import {
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Sunrise,
  Sunset,
  Thermometer,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Radio,
} from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import { formatTemperature } from '../../utils/formatters';
import { weatherService } from '../../services/weatherService';
import { WeatherCondition, type RealWeatherData, type WeatherForecast } from '../../types';

const forecastEmojis: Record<string, string> = {
  [WeatherCondition.Sunny]: '☀️',
  [WeatherCondition.PartlyCloudy]: '⛅',
  [WeatherCondition.Cloudy]: '☁️',
  [WeatherCondition.Rainy]: '🌧️',
  [WeatherCondition.Stormy]: '⛈️',
  [WeatherCondition.Windy]: '💨',
  [WeatherCondition.Foggy]: '🌫️',
};

/**
 * Maps dynamic weather description strings to appropriate emoji
 */
function getWeatherEmoji(condition?: string): string {
  if (!condition) return '⛅';
  const lower = condition.toLowerCase();
  if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
  if (lower.includes('drizzle') || lower.includes('shower') || lower.includes('rain')) return '🌧️';
  if (lower.includes('snow') || lower.includes('sleet') || lower.includes('ice') || lower.includes('flurr')) return '❄️';
  if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
  if (lower.includes('few') || lower.includes('scatter') || lower.includes('partly')) return '⛅';
  if (lower.includes('cloud') || lower.includes('overcast')) return '☁️';
  if (lower.includes('wind') || lower.includes('breeze') || lower.includes('gale')) return '💨';
  if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze') || lower.includes('smoke')) return '🌫️';
  return '⛅';
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<RealWeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || 'Failed to load live weather data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Compute dynamic agricultural advice based on real backend metrics
  const getAgriculturalAdvice = (data: RealWeatherData) => {
    const isRainy = data.weather.toLowerCase().includes('rain') || data.weather.toLowerCase().includes('drizzle');
    const isHighHumidity = data.humidity >= 60;
    const isHighWind = data.wind_speed >= 5;
    const isWarm = data.temperature >= 30;

    return [
      {
        title: 'Irrigation Advisory',
        description: isRainy
          ? `Current weather indicates ${data.weather}. Delay outdoor irrigation to avoid waterlogging and conserve resources.`
          : isWarm
          ? `With temperatures reaching ${formatTemperature(data.temperature)}, schedule irrigation during early morning or evening to minimize evaporation.`
          : 'Moderate conditions. Maintain standard scheduled irrigation cycles.',
        icon: '💧',
      },
      {
        title: 'Pest & Disease Alert',
        description: isHighHumidity
          ? `Current humidity (${data.humidity}%) creates a favorable environment for fungal diseases. Monitor crops closely for leaf spot or mildew.`
          : `Current humidity (${data.humidity}%) is moderate, reducing immediate fungal growth risk. Continue standard scouting.`,
        icon: '🐛',
      },
      {
        title: 'Foliar Spray & Spraying Conditions',
        description: isHighWind
          ? `Wind speed is ${data.wind_speed} m/s. Avoid foliar pesticide or fertilizer spraying to prevent spray drift.`
          : `Wind speed is calm at ${data.wind_speed} m/s. Excellent conditions for foliar nutrient sprays and crop treatment.`,
        icon: '🌾',
      },
      {
        title: 'Thermal Stress & UV Protection',
        description: isWarm
          ? `Current temperature is ${formatTemperature(data.temperature)} (feels like ${formatTemperature(data.feels_like)}). Apply mulch to retain soil moisture and protect sensitive seedlings.`
          : `Thermal conditions are comfortable at ${formatTemperature(data.temperature)}. Optimal for crop metabolism and vegetative growth.`,
        icon: <Sun className="w-5 h-5 text-amber-500" />,
      },
    ];
  };

  // Full page error state when no cached data exists
  if (error && !weather) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Weather</h1>
          <p className="text-slate-500">Live Agricultural Meteorological Data</p>
        </div>
        <Card className="p-8">
          <ErrorState
            title="Unable to Load Live Weather"
            message={error}
            onRetry={() => loadWeatherData(false)}
          />
        </Card>
      </div>
    );
  }

  // Initial skeleton loader
  if (isLoading && !weather) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Weather</h1>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-1" />
          </div>
        </div>

        {/* Current Weather Skeleton */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500/80 via-cyan-500/80 to-teal-500/80 text-white animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-white/30 rounded-2xl" />
              <div className="h-10 w-32 bg-white/30 rounded" />
              <div className="h-5 w-24 bg-white/20 rounded" />
              <div className="h-4 w-28 bg-white/20 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-6 w-full sm:w-auto">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-14 bg-white/20 rounded" />
                    <div className="h-5 w-16 bg-white/30 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Skeleton */}
        <Card>
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-100 animate-pulse h-28" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Weather</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
            <span className="font-medium text-slate-700">{weather?.location || 'Pune'}</span>
            <span>·</span>
            <span>
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Updated just now'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
              Live AWS Backend
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadWeatherData(true)}
          disabled={isRefreshing}
          icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      {/* Non-blocking error alert if refresh failed while old data exists */}
      {error && weather && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => loadWeatherData(true)}>
            Retry
          </Button>
        </div>
      )}

      {/* Current Weather Card */}
      {weather && (
        <Card className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white !border-0 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-7xl mb-2">{getWeatherEmoji(weather.weather)}</div>
              <div className="text-5xl font-bold tracking-tight">
                {formatTemperature(weather.temperature)}
              </div>
              <div className="text-lg text-white/90 font-medium mt-1 capitalize">
                {weather.weather}
              </div>
              <div className="text-sm text-white/70 mt-0.5 flex items-center gap-1.5">
                <span>{weather.location}</span>
                {weather.message && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {weather.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-white/80" />
                <div>
                  <div className="text-xs text-white/70">Feels Like</div>
                  <div className="text-lg font-bold">{formatTemperature(weather.feels_like)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-white/80" />
                <div>
                  <div className="text-xs text-white/70">Humidity</div>
                  <div className="text-lg font-bold">{weather.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-white/80" />
                <div>
                  <div className="text-xs text-white/70">Wind Speed</div>
                  <div className="text-lg font-bold">{weather.wind_speed} m/s</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-white/80" />
                <div>
                  <div className="text-xs text-white/70">Condition</div>
                  <div className="text-lg font-bold capitalize truncate max-w-[110px]">
                    {weather.weather}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Station Status footer */}
          <div className="flex items-center justify-between gap-6 mt-6 pt-4 border-t border-white/20 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Station: AWS Lambda OpenWeather Service</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5" />
                <span>06:12 AM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5" />
                <span>06:34 PM</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 7-Day Forecast */}
      <Card>
        <CardTitle>7-Day Forecast</CardTitle>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-center transition-all ${
                i === 0
                  ? 'bg-emerald-50 border-2 border-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-xs font-semibold text-slate-600 mb-2">{day.day}</div>
              <div className="text-2xl mb-2">{forecastEmojis[day.condition] || '⛅'}</div>
              <div className="text-sm font-bold text-slate-800">
                {day.high}° / {day.low}°
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-500">
                <CloudRain className="w-3 h-3" />
                {day.rainProbability}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Agricultural Weather Advice derived from real metrics */}
      {weather && (
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-500" />
            Agricultural Weather Advice
          </CardTitle>
          <div className="mt-4 space-y-3">
            {getAgriculturalAdvice(weather).map((advice, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {typeof advice.icon === 'string' ? advice.icon : advice.icon}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{advice.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{advice.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
