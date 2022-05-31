const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

export async function fetchData(searchTerm) {
  const { data } = 
  await axios.get('https://tommy-ling-weatherapp.herokuapp.com/api', {
    params: {q: searchTerm}
  })
  return data
}

export async function fetchCurrentData(locationData) {
  const data = locationData
  const dataList = [
    data.current.condition.text,
    data.current.feelslike_c,
    data.current.temp_c,
    data.current.wind_kph,
    data.current.precip_mm
  ]
  const localTime = data.location.localtime
  const date = new Date(localTime)
  const day = weekday[date.getDay()]

  document.querySelector('.timebar h1').innerHTML = data.location.name
  document.querySelector('.timebar h3').innerHTML = `${localTime} ${day}`
  document.querySelector('.timebar img').src = data.current.condition.icon

  const currentList = document.querySelectorAll('.current ul li h4')
  for(let i = 0; i < currentList.length; i++) {
    currentList[i].innerHTML = dataList[i]
  }
}

export async function fetchForecastData(searchTerm) {
  const { data } = 
  await axios.get('https://tommy-ling-weatherapp.herokuapp.com/api/forecast', {
    params: {
      q: searchTerm
    }
  })
  return data
}

export async function fetchHourlyData(locationData, day, hr) {
  const data = locationData
  let dataList = [
    data.forecast.forecastday[day].hour[hr].time.slice(-11),
    data.forecast.forecastday[day].hour[hr].condition.icon,
    data.forecast.forecastday[day].hour[hr].temp_c,
    data.forecast.forecastday[day].hour[hr].feelslike_c,
    data.forecast.forecastday[day].hour[hr].wind_kph,
    data.forecast.forecastday[day].hour[hr].cloud,
    data.forecast.forecastday[day].hour[hr].chance_of_rain,
    data.forecast.forecastday[day].hour[hr].chance_of_snow,
  ]

  if(data.forecast.forecastday[day].hour[hr].chance_of_rain && 
  !data.forecast.forecastday[day].hour[hr].chance_of_snow) {
    dataList.splice(7, 1)
  } else if (!data.forecast.forecastday[day].hour[hr].chance_of_rain && 
  data.forecast.forecastday[day].hour[hr].chance_of_snow) {
    dataList.splice(6, 1)
  } else if (!data.forecast.forecastday[day].hour[hr].chance_of_rain && 
  !data.forecast.forecastday[day].hour[hr].chance_of_snow) {
    dataList.splice(7, 1)
  }
  return dataList
}

export async function hoursList (locationData, locationHourlyData) {
  const data = locationData
  const hour = parseInt(data.location.localtime.split(' ')[1].split(':')[0])
  
  let forecastHoursList = []
  for(let i = hour +1; i <= 23; i += 4) {
    forecastHoursList.push(await fetchHourlyData(locationHourlyData, 0, i))
  }

  let listLength = forecastHoursList.length
  if(listLength > 5) {
    forecastHoursList = forecastHoursList.slice(0,5)
  } else if(listLength < 5) {
    let rest = 5 - listLength
    let lastHour = parseInt(forecastHoursList[forecastHoursList.length-1][0].split(' ')[1].split(':')[0])
    for(let i = lastHour+4-24; i<= (4*rest)-(24-lastHour); i += 4) {
      forecastHoursList.push(await fetchHourlyData(locationHourlyData, 1, i))
    }
  } else {
    forecastHoursList = forecastHoursList
  }
  return forecastHoursList
}

export async function fetchDailyData(locationData, day) {
  const data = locationData
  let dataList = [
    data.forecast.forecastday[day].date,
    data.forecast.forecastday[day].day.condition.icon,
    data.forecast.forecastday[day].day.maxtemp_c,
    data.forecast.forecastday[day].day.mintemp_c,
    data.forecast.forecastday[day].day.daily_chance_of_rain,
    data.forecast.forecastday[day].day.daily_chance_of_snow
  ]
  if(data.forecast.forecastday[day].day.daily_chance_of_rain && 
    !data.forecast.forecastday[day].day.daily_chance_of_snow) {
      dataList.splice(5, 1)
    } else if (!data.forecast.forecastday[day].day.daily_chance_of_rain && 
    data.forecast.forecastday[day].day.daily_chance_of_snow) {
      dataList.splice(4, 1)
    } else if (!data.forecast.forecastday[day].day.daily_chance_of_rain && 
    !data.forecast.forecastday[day].day.daily_chance_of_snow) {
      dataList.splice(5, 1)
    }
    return dataList
}

export async function dailyList (locationData) {  
  let forecastDailyList = []
  for(let i = 0; i <= 2; i ++) {
    forecastDailyList.push(await fetchDailyData(locationData, i))
  }
  return forecastDailyList  
}

export const renderHourlyForecast = (forecastHoursList) => {
  const renderedForecastList = forecastHoursList.map((el) => {
    return `
    <div>
      <li>
        <ul>
          <li><h4>${el[0]}</h4></li>
          <li><img src="${el[1]}"></li>
          <li><span class="toggle" style="float: left">Temp °C</span><span class="hidden" style="float: left">Temp °F</span><h4 class="temp">${el[2]}</h4></li>
          <li><span class="toggle" style="float: left">Feels °C</span><span class="hidden" style="float: left">Feels °F</span><h4 class="temp">${el[3]}</h4></li>
          <li><span class="toggle" style="float: left">Wind kph</span><span class="hidden" style="float: left">Wind mph</span><h4 class="windspeed">${el[4]}</h4></li>
          <li><em style="float: left">Cloud cover</em><h4>${el[5]}%</h4></li>
          <li><em style="float: left">Precip chance</em><h4>${el[6]}%</h4></li>
        </ul>
      </li>
    </div>
    `
  }).join('')
  return renderedForecastList
}

export const renderDailyForecast = (forecastDailyList) => {
  const renderedForecastList = forecastDailyList.map((el) => {
    return `
    <div>
      <li>
        <ul>
          <li><h4>${el[0]}</h4></li>
          <li><img src="${el[1]}"></li>
          <li><span class="toggle" style="float: left">Max °C</span><span class="hidden" style="float: left">Max °F</span><h4 class="temp">${el[2]}</h4></li>
          <li><span class="toggle" style="float: left">Min °C</span><span class="hidden" style="float: left">Min °F</span><h4 class="temp">${el[3]}</h4></li>
          <li><em style="float: left">Precip chance</em><h4>${el[4]}%</h4></li>
        </ul>
      </li>
    </div>
    `
  }).join('')
  return renderedForecastList
}