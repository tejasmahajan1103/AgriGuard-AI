// ============================================================
// AgriGuard AI — TypeScript Type Definitions
// ============================================================

// --- Constants used as "enums" ---
// Using const objects + union types because erasableSyntaxOnly is enabled

export const GrowthStage = {
  Seedling: 'Seedling',
  Vegetative: 'Vegetative',
  Flowering: 'Flowering',
  Fruiting: 'Fruiting',
  Harvest: 'Harvest',
} as const;
export type GrowthStage = (typeof GrowthStage)[keyof typeof GrowthStage];

export const HealthStatus = {
  Excellent: 'Excellent',
  Good: 'Good',
  Fair: 'Fair',
  Poor: 'Poor',
  Critical: 'Critical',
} as const;
export type HealthStatus = (typeof HealthStatus)[keyof typeof HealthStatus];

export const AlertSeverity = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
} as const;
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];

export const AlertType = {
  Disease: 'Disease',
  Pest: 'Pest',
  Weather: 'Weather',
  Irrigation: 'Irrigation',
  Nutrient: 'Nutrient',
  General: 'General',
} as const;
export type AlertType = (typeof AlertType)[keyof typeof AlertType];

export const WeatherCondition = {
  Sunny: 'Sunny',
  PartlyCloudy: 'Partly Cloudy',
  Cloudy: 'Cloudy',
  Rainy: 'Rainy',
  Stormy: 'Stormy',
  Windy: 'Windy',
  Foggy: 'Foggy',
} as const;
export type WeatherCondition = (typeof WeatherCondition)[keyof typeof WeatherCondition];

// --- Core Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  farmCount: number;
  cropCount: number;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: number; // in acres
  areaUnit: string;
  cropCount: number;
  healthStatus: HealthStatus;
  crops: string[]; // crop IDs
  createdAt: string;
  imageUrl?: string;
}

export interface Crop {
  id: string;
  name: string;
  farmId: string;
  farmName: string;
  plantingDate: string;
  growthStage: GrowthStage;
  healthStatus: HealthStatus;
  lastScanDate?: string;
  lastScanResult?: string;
  imageUrl?: string;
  variety?: string;
  expectedHarvestDate?: string;
}

export interface CropScan {
  id: string;
  cropId: string;
  cropName: string;
  farmName: string;
  imageUrl: string;
  scanDate: string;
  result: ScanResult;
}

export interface ScanResult {
  disease: string;
  confidence: number; // 0–100
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
  recommendations: string[];
  isHealthy: boolean;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  dateTime: string;
  isRead: boolean;
  cropId?: string;
  farmId?: string;
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  rainProbability: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  condition: WeatherCondition;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  location: string;
}

export interface RealWeatherData {
  message?: string;
  location: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  weather: string;
  wind_speed: number;
}


export interface WeatherForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  rainProbability: number;
  humidity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HealthRecord {
  date: string;
  healthScore: number; // 0–100
  status: HealthStatus;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

// --- Form Types ---

export interface AddFarmFormData {
  name: string;
  location: string;
  area: number;
  areaUnit: string;
}

export interface AddCropFormData {
  name: string;
  farmId: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// --- Navigation ---

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
