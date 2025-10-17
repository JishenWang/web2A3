import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  getWeatherForecast(latitude: number, longitude: number): Observable<WeatherData> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'Australia/Sydney'
    };
    
    return this.http.get<WeatherData>(this.apiUrl, { params });
  }

  getWeatherDescription(weatherCode: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Light rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm'
    };
    
    return weatherCodes[weatherCode] || 'Unknown';
  }
}