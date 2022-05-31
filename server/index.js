const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/dev.env') })
const express = require("express");
const cors = require('cors')
const axios = require('axios')

const port = process.env.PORT || 3001

const app = express()

app.use(cors())

app.use(express.static(path.resolve(__dirname, '../WeatherApp')))

app.get("/api", async (req, res) => {
  await axios.get('http://api.weatherapi.com/v1/current.json', {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: req.query.q
    }
  }).then(({ data }) => res.send(data))
  .catch((error) => {
    if(error.response) {
      res.send(error.response.data)
      console.log(error.response.data)
    }
  })
})

app.get('/api/forecast', async(req, res) => {
  await axios.get('http://api.weatherapi.com/v1/forecast.json', {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: req.query.q,
      days: 3
    }
  }).then(({ data }) => res.send(data))
  .catch((error) => {
    if(error.response) {
      console.log(error.response.data)
    }
  })
})

app.get('/api/search', async(req, res) => {
  await axios.get('http://api.weatherapi.com/v1/search.json', {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: req.query.q
    }
  }).then(({ data }) => res.send(data))
    .catch((error) => {
      if(error.response) {
        console.log(error.response.data)
      }
    })
})

app.listen(port, () => {console.log(`Server listening on ${port}`)})