const mockGetWeatherCondition = jest.fn();

jest.mock('../utils', () => ({
  getWeatherCondition: mockGetWeatherCondition,
}));

import { weatherService } from './weather-service';

describe('weatherService', () => {
  const mockGeocodingResponse = {
    results: [
      {
        latitude: 10,
        longitude: 20,
        name: 'Test Location',
      },
    ],
  };

  const mockWeatherResponse = {
    current: {
      time: '2025-07-24T12:00',
      temperature_2m: 25,
      apparent_temperature: 26,
      relative_humidity_2m: 70,
      wind_speed_10m: 10,
      wind_gusts_10m: 15,
      weather_code: 0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetWeatherCondition.mockReturnValue('Clear sky');
  });

  it('should return weather data for a valid location', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockGeocodingResponse),
      } as Response)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWeatherResponse),
      } as Response);

    const weatherData = await weatherService.getWeather('Test Location');

    expect(weatherData).toEqual({
      temperature: 25,
      feelsLike: 26,
      humidity: 70,
      windSpeed: 10,
      windGust: 15,
      conditions: 'Clear sky',
      location: 'Test Location',
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=Test%20Location&count=1',
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=10&longitude=20&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code',
    );
    expect(mockGetWeatherCondition).toHaveBeenCalledWith(0);
  });

  it('should throw an error if location is not found', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({ results: [] }),
    } as Response);

    await expect(weatherService.getWeather('Unknown Location')).rejects.toThrow(
      "Location 'Unknown Location' not found",
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if geocoding fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(weatherService.getWeather('Test Location')).rejects.toThrow(
      'Network error',
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if weather fetch fails', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockGeocodingResponse),
      } as Response)
      .mockRejectedValueOnce(new Error('Weather API error'));

    await expect(weatherService.getWeather('Test Location')).rejects.toThrow(
      'Weather API error',
    );
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
