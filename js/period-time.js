import { createDOM } from "./utils/dom.js"
import { formatDate, formatTemp, formatHumidity, formatSpeedWind } from "./utils/format-data.js"

export function periodTimeTemplate(config, tabPanelIndex, weatherIndex) {
    const $tabPanel = document.getElementById(`dayWeather-${tabPanelIndex}`)
    const $atmosphericVar = createDOM(atmosphericVarTemplate(config, tabPanelIndex, weatherIndex))
    $tabPanel.append($atmosphericVar)

    return `
    <li class="dayWeather-item ${weatherIndex === 0 ? 'is-selected' : ''} " data-weatherItem="tp${tabPanelIndex}-w${weatherIndex}">
        <span class="dayWeather-time">${config.date}</span>
        <img class="dayWeather-icon" height="48" width="48" src="https://openweathermap.org/img/wn/${config.icon}@2x.png" alt="${config.description}" rain="">
        <span class="dayWeather-temp">${config.temp}</span>
    </li>`
}

export function atmosphericVarTemplate(config, tabPanelIndex, weatherIndex) {

    return `
    <div id="atmosphericVar-tp${tabPanelIndex}-w${weatherIndex}" class="dayWeather-atmosphericVar ${weatherIndex !== 0 ? 'is-hidden' : ''} ">
        <div class="atmosphericVar">
            <span>Máx: <strong id="atmosphericVarMax-${tabPanelIndex}">${config.maxTemp}</strong></span>
            <span>Mín: <strong id="atmosphericVarMin-${tabPanelIndex}">${config.minTemp}</strong></span>
        </div>
        <div class="atmosphericVar">
            <span>Viento: <strong id="atmosphericVarSpeedWind-${tabPanelIndex}">${config.wind}</strong></span>
            <span>Humedad: <strong id="atmosphericVarHumidity-${tabPanelIndex}">${config.humidity}</strong></span>
        </div>
    </div>`
}

export function createPeriodTime(weather, tabPanelIndex, weatherIndex) {
    const dateOptions = {
        hour: 'numeric',
        hour12: true,
    };
    const temp = formatTemp(weather.main.temp);
    const date = formatDate(new Date(weather.dt * 1000), dateOptions);
    const maxTemp = formatTemp(weather.main.temp_max) // Temperatura máxima
    const minTemp = formatTemp(weather.main.temp_min) // Temperatura mínima
    const wind = formatSpeedWind(weather.wind.speed); // Velocidad del viento
    const humidity = formatHumidity(weather.main.humidity); // Humedad

    const config = {
        temp,
        date,
        icon: weather.weather[0].icon,
        description: weather.weather[0].description,
        maxTemp,
        minTemp,
        wind,
        humidity,
    };
    return createDOM(periodTimeTemplate(config, tabPanelIndex, weatherIndex))
}
