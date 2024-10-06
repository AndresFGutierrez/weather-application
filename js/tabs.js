const $tabContainer = document.querySelector('#tabs')
const $tabList = $tabContainer.querySelectorAll('.tab')

const today = new Date()
let weekday = today.getDay()

const week = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado'
]

function nextDay(day) {
    if (day === 6) {
        return 0
    }
    return day + 1
}

$tabList.forEach(($tab, index) => {
    $tab.addEventListener('click', handleSelectTabClick)
    // para que el dia de hoy no salga con nombre sino hoy
    if (index === 0) {
        $tab.textContent = 'Hoy'
        weekday = nextDay(weekday)
        return false
    }
    // para cambiar los dias
    $tab.textContent = week[weekday]
    weekday = nextDay(weekday)
})

function handleSelectTabClick(event) {
    const $tabSelected = event.target
    const $tabActive = document.querySelector('.tab[aria-selected="true"]')
    $tabActive.removeAttribute('aria-selected');
    $tabSelected.setAttribute('aria-selected', true);

    const id = $tabSelected.id;
    const $tabPanel = document.querySelector(`[aria-labelledby=${id}]`)
    const $tabPanelCurrentSelected = document.querySelector('.tabPanel:not([hidden])')
    $tabPanel.hidden = false
    $tabPanelCurrentSelected.hidden = true
}
