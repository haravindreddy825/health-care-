/**
 * WeatherService.js
 * Live ambient weather telemetry and weather-aware wellness insights
 * using Open-Meteo free API (no API key required) with browser geolocation and offline fallback.
 */

export class WeatherService {
  constructor() {
    this.weatherData = {
      temperature: 24,
      humidity: 55,
      weatherCode: 1,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      windSpeed: 12,
      location: 'Local Region',
      wellnessTip: 'Pleasant atmospheric conditions. Stay hydrated throughout your daily tasks.',
      lastUpdated: null
    }
  }

  async fetchLiveWeather() {
    try {
      let lat = 17.3850 // Default
      let lon = 78.4867
      let locationName = 'Local Region'

      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3500 })
          })
          lat = pos.coords.latitude
          lon = pos.coords.longitude
          locationName = 'Your Location'
        } catch (geoErr) {
          // fallback to default coordinates
        }
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      )

      if (!res.ok) throw new Error('Weather API unreachable')

      const data = await res.json()
      const current = data.current

      const temp = Math.round(current.temperature_2m)
      const humidity = Math.round(current.relative_humidity_2m)
      const windSpeed = Math.round(current.wind_speed_10m)
      const code = current.weather_code

      const { condition, icon, tip } = this.interpretWmoCode(code, temp, humidity)

      this.weatherData = {
        temperature: temp,
        humidity,
        weatherCode: code,
        condition,
        icon,
        windSpeed,
        location: locationName,
        wellnessTip: tip,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      return this.weatherData
    } catch (e) {
      console.log('Using ambient weather fallback:', e)
      this.weatherData.lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return this.weatherData
    }
  }

  interpretWmoCode(code, temp, humidity) {
    let condition = 'Clear Sky'
    let icon = 'Sun'
    let tip = 'Bright, sunny conditions. Maintain regular hydration and protect your eyes outdoors.'

    if (code === 0) {
      condition = 'Clear Sky'
      icon = 'Sun'
    } else if (code >= 1 && code <= 3) {
      condition = 'Partly Cloudy'
      icon = 'CloudSun'
      tip = 'Pleasant ambient climate. Ideal for maintaining a consistent work-rest routine.'
    } else if (code >= 45 && code <= 48) {
      condition = 'Foggy / Overcast'
      icon = 'Cloud'
      tip = 'Misty conditions. Ensure adequate indoor ambient lighting to minimize eye strain.'
    } else if (code >= 51 && code <= 67) {
      condition = 'Rain & Drizzle'
      icon = 'CloudRain'
      tip = 'Rainy weather. Maintain indoor warmth and engage in light indoor stretches.'
    } else if (code >= 71 && code <= 77) {
      condition = 'Snow / Cold'
      icon = 'Snowflake'
      tip = 'Cold ambient temperature. Keep warm and hydrate with warm herbal beverages.'
    } else if (code >= 80 && code <= 82) {
      condition = 'Rain Showers'
      icon = 'CloudRain'
    } else if (code >= 95) {
      condition = 'Thunderstorm'
      icon = 'CloudLightning'
      tip = 'Storm activity. Stay safely indoors and take periodic screen rest intervals.'
    }

    if (temp > 32) {
      tip = 'High ambient heat index. Increase fluid intake and avoid prolonged direct sun exposure.'
    } else if (temp < 15) {
      tip = 'Cool ambient climate. Keep your posture relaxed to prevent involuntary shoulder tensing.'
    }

    return { condition, icon, tip }
  }
}

export const weatherService = new WeatherService()
