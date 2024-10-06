import { getWeeklyWeather } from './services/weather.js'
import { getLatLon } from './geolocation.js';
import { formatWeekList } from './utils/format-data.js';
import { createDOM } from './utils/dom.js';
import { createPeriodTime } from './period-time.js';
import draggable from './draggble.js';

function tabPanelTemplate(id) {
    return `<div class="tabPanel" tabindex="0" aria-labelledby="tab-${id}">
          <div class="dayWeather" id="dayWeather-${id}">
            <ul class="dayWeather-list" id="dayWeather-list-${id}">
            </ul>
          </div>
        </div>`
}

function createTabPanel(id) {
    const $panel = createDOM(tabPanelTemplate(id))
    if (id > 0) {
        $panel.hidden = true;
    }
    return $panel
}

function configWeeklyWeather(weekList) {
    const $container = document.querySelector('.tabs')
    weekList.forEach((day, tabPanelIndex) => {
        const $tabPanel = createTabPanel(tabPanelIndex)
        $container.append($tabPanel)

        const $listTabPanel = document.querySelector(`#dayWeather-list-${tabPanelIndex}`)

        day.forEach((weather, weatherIndex) => {
            const $periodTime = createPeriodTime(weather, tabPanelIndex, weatherIndex)
            $listTabPanel.append($periodTime)
        })
    })
}

export default async function weeklyWeather() {
    const $container = document.querySelector('.weeklyWeather')

    const { lat, lon, isError } = await getLatLon();
    if (isError) return console.log('Ha ocurrido un error');

    const { isError: weeklyWeatherError, data: weather } = await getWeeklyWeather(lat, lon);
    if (weeklyWeatherError) return console.log('Ha ocurrido un error obteniendo el pronostico del clima!')

    const weekList = formatWeekList(weather.list)
    configWeeklyWeather(weekList);
    draggable($container)

    const $dayWeatherList = document.querySelectorAll('.dayWeather-item');

    $dayWeatherList.forEach(($dayWeather, index) => {
        $dayWeather.addEventListener('click', handleSelectedDayWeatherClick)
    })

    function handleSelectedDayWeatherClick(event) {
        const $dayWeatherSelected = event.currentTarget
        const $parentTarget = $dayWeatherSelected.parentElement
        const $dayWeatherActive = $parentTarget.querySelector('.dayWeather-item.is-selected')

        const partialId = $dayWeatherSelected.dataset.weatheritem
        const $atmosphericVarSelected = document.getElementById(`atmosphericVar-${partialId}`)
        const $grandParentTarget = $parentTarget.parentElement
        const $atmosphericVarActive = $grandParentTarget.querySelector('.dayWeather-atmosphericVar:not(.is-hidden)')

        if ($dayWeatherActive !== $dayWeatherSelected) {
            $dayWeatherActive.classList.remove('is-selected');
            $dayWeatherSelected.classList.toggle('is-selected');

            $atmosphericVarSelected.classList.remove('is-hidden');
            $atmosphericVarActive.classList.toggle('is-hidden');
        }
    }
}