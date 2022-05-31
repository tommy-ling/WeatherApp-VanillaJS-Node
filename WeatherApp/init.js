import { weatherBackground } from './background.js'
import { 
    fetchData,
    fetchCurrentData, 
    fetchForecastData,
    hoursList, 
    renderHourlyForecast, 
    dailyList, 
    renderDailyForecast } from './fetch.js'

export async function init (name) {
  const data = await fetchData(name)
  const forecastData = await fetchForecastData(name)

  await fetchCurrentData(data)
  await weatherBackground(data)

  const forecast = document.querySelector('.forecast ul')
  const future = document.querySelector('.future ul')

  const forecastHoursList =  await hoursList(data, forecastData)
  forecast.innerHTML = ''
  forecast.insertAdjacentHTML('afterbegin', renderHourlyForecast(forecastHoursList))

  const forecastDailyList =  await dailyList(forecastData)
  future.innerHTML = ''
  future.insertAdjacentHTML('afterbegin', renderDailyForecast(forecastDailyList))
}