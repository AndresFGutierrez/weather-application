// import weather from "../data/current-weather.js"
import { formatDate, formatTemp } from './utils/format-data.js'
import { weatherConditionsCodes } from './constants.js'
import { getLatLon } from './geolocation.js';
import { getCurrentWeather } from "./services/weather.js";

// configurar ciudad
function setCurrentCity($elemento, city) {
    $elemento.textContent = city
}

// fecha actual formateada en el estilo necesario y español
function setCurrentDate($elemento) {
    const date = new Date()
    const formattedDate = formatDate(date)
    $elemento.textContent = formattedDate
}

// setear temperatura actual
function setCurrentTemp($elemento, temp) {
    $elemento.textContent = formatTemp(temp)
}

// decir si es noche o dia
function solarStatus(sunriseTime, sunsetTime) {
    const currentHours = new Date().getHours()
    const sunsetHours = sunsetTime.getHours()
    const sunriseHours = sunriseTime.getHours()

    if (currentHours > sunsetHours || currentHours < sunriseHours) {
        return 'night'
    }
    return 'morning'
}

// cambiar imagen actual
function setBackground($elemento, conditionCode, solarStatus) {
    const weatherType = weatherConditionsCodes[conditionCode] //sacar cual es la condicion del clima segun el numero
    const size = window.matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches ? '@2x' : ''
    $elemento.style.backgroundImage = `url(./images/${solarStatus}-${weatherType}${size}.jpg)`
}

//Pantalla de carga
function showCurrentWeather($app, $loader) {
    $app.hidden = false
    $loader.hidden = true
}


// cambiar en el documento
function configCurrentWeather(weather) {
    //loader //fecha //ciudad //temperat //clima

    const $app = document.querySelector('#app')
    const $loading = document.querySelector('#loading')

    //loader 
    showCurrentWeather($app, $loading)

    //date
    const $currentWeatherDate = document.querySelector('#current-weather-date')
    setCurrentDate($currentWeatherDate)

    //city
    const $currentWeatherCity = document.querySelector('#current-weather-city')
    const city = weather.name
    setCurrentCity($currentWeatherCity, city)

    //temp 
    const $currentWeatherTemp = document.querySelector('#current-weather-temp')
    const temp = weather.main.temp
    setCurrentTemp($currentWeatherTemp, temp)

    //background
    const sunriseTime = new Date(weather.sys.sunrise * 1000) //pasar a milisegundos
    const sunsetTime = new Date(weather.sys.sunset * 1000)
    const conditionCode = String(weather.weather[0].id).charAt(0) //extrar el id de la condicion del clima
    setBackground($app, conditionCode, solarStatus(sunriseTime, sunsetTime))
}

export default async function currentWeather() {
    // GEOloca // API - weather // Config

    const { lat, lon, isError } = await getLatLon()
    if (isError) return console.log('Error en la ubicacion')
    // console.log(lat, lon)

    // getCurrentPosition()
    //     .then((data) => {
    //         console.log(data)
    //     })
    //     .catch((message) => {
    //         console.log(message)
    //     })
    const { isError: currentWeatherError, data: weather } = await getCurrentWeather(lat, lon)
    if (currentWeatherError) return console.log('oh! a ocurrido un error trayendo los datos del clima')
    configCurrentWeather(weather)
    // console.log(weather)
}