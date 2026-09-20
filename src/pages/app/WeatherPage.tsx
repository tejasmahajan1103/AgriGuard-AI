import { Droplets, Wind, Sun, CloudRain, Eye, Sunrise, Sunset, Thermometer } from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';
import { mockWeather, mockForecast } from '../../data/mockData';
import { formatTemperature } from '../../utils/formatters';
import { WeatherCondition } from '../../types';

const weatherEmojis: Record<string, string> = {
  [WeatherCondition.Sunny]: '☀️',
  [WeatherCondition.PartlyCloudy]: '⛅',
  [WeatherCondition.Cloudy]: '☁️',
  [WeatherCondition.Rainy]: '🌧️',
  [WeatherCondition.Stormy]: '⛈️',
  [WeatherCondition.Windy]: '💨',
  [WeatherCondition.Foggy]: '🌫️',
};

export default function WeatherPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Weather</h1>
        <p className="text-slate-500">{mockWeather.location} · Updated just now</p>
      </div>

      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white !border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-7xl mb-2">{weatherEmojis[mockWeather.condition]}</div>
            <div className="text-5xl font-bold">{formatTemperature(mockWeather.temperature)}</div>
            <div className="text-lg text-white/80 mt-1">{mockWeather.condition}</div>
            <div className="text-sm text-white/60 mt-0.5">{mockWeather.location}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-white/70" />
              <div>
                <div className="text-xs text-white/60">Humidity</div>
                <div className="text-lg font-bold">{mockWeather.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-white/70" />
              <div>
                <div className="text-xs text-white/60">Rain</div>
                <div className="text-lg font-bold">{mockWeather.rainProbability}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-white/70" />
              <div>
                <div className="text-xs text-white/60">Wind</div>
                <div className="text-lg font-bold">{mockWeather.windSpeed} km/h {mockWeather.windDirection}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-white/70" />
              <div>
                <div className="text-xs text-white/60">UV Index</div>
                <div className="text-lg font-bold">{mockWeather.uvIndex}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Sunrise className="w-4 h-4" />
            Sunrise: {mockWeather.sunrise}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Sunset className="w-4 h-4" />
            Sunset: {mockWeather.sunset}
          </div>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardTitle>7-Day Forecast</CardTitle>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {mockForecast.map((day, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-center transition-all ${
                i === 0
                  ? 'bg-emerald-50 border-2 border-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-xs font-semibold text-slate-600 mb-2">{day.day}</div>
              <div className="text-2xl mb-2">{weatherEmojis[day.condition]}</div>
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

      {/* Agricultural Weather Advice */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-500" />
          Agricultural Weather Advice
        </CardTitle>
        <div className="mt-4 space-y-3">
          {[
            {
              title: 'Irrigation Advisory',
              description: 'With rain expected tomorrow (80% probability), consider delaying irrigation for outdoor crops to avoid waterlogging.',
              icon: '💧',
            },
            {
              title: 'Pest Alert',
              description: 'Current humidity (72%) is favorable for fungal growth. Monitor crops closely for signs of disease.',
              icon: '🐛',
            },
            {
              title: 'Harvesting Conditions',
              description: 'Today\'s conditions are suitable for harvesting. Plan outdoor activities before the rain arrives.',
              icon: '🌾',
            },
            {
              title: 'UV Protection',
              description: `UV index is ${mockWeather.uvIndex} (moderate). Apply mulch to protect sensitive seedlings from direct sunlight.`,
              icon: <Sun className="w-5 h-5 text-amber-500" />,
            },
          ].map((advice, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-xl flex-shrink-0 mt-0.5">
                {typeof advice.icon === 'string' ? advice.icon : advice.icon}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{advice.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{advice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
