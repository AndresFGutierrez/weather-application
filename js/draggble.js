const defaultConfig = {
    open: true,
    debug: true,
    animatable: true
}

export default function draggable($element, config = defaultConfig) {
    if (!($element instanceof HTMLElement)) {
        return console.warn(`elemento invalido se esperaba un HTMLElement y se recibio ${$element}`)
    }

    let isOpen = config.open
    let isDraggin = false
    const elementReact = $element.getBoundingClientRect()
    const ELEMENT_BLOCK_SIZE = elementReact.height

    const $marker = $element.querySelector('[data-marker]')
    const MARKER_BLOCK_SIZE = $marker.getBoundingClientRect().height

    const VISIBLE_Y_POSITION = 0
    const HIDDEN_Y_POSITION = ELEMENT_BLOCK_SIZE - MARKER_BLOCK_SIZE
    let widgetPosition = VISIBLE_Y_POSITION

    isOpen ? open() : close()
    let startY = 0

    $marker.addEventListener('click', handleClick)
    $marker.addEventListener('pointerdown', handlePointerDown)
    $marker.addEventListener('pointerup', handlePointerUp)
    $marker.addEventListener('pointerout', handlePointerOut)
    $marker.addEventListener('pointercancel', handlePointerCancel)
    $marker.addEventListener('pointermove', handlePointerMove)

    if (config.animatable) {
        setAnimations()
    }

    function handlePointerUp() {
        logger('Pointer UP')
        dragEnd()
    }
    function handlePointerOut() {
        logger('Pointer OUT')
        dragEnd()
    }
    function handlePointerCancel() {
        logger('Pointer Cancel')
        dragEnd()
    }
    function handlePointerDown(event) {
        logger('Pointer Down')
        startDrag(event)
    }
    function handleClick(event) {
        logger('CLICK')
        toggle()
    }
    function handlePointerMove(event) {
        logger('Pointer MOVE')
        drag(event)
    }

    function pageY(event) {
        return event.pageY || event.touches[0].pageY
    }

    function startDrag(event) {
        isDraggin = true
        startY = pageY(event)
    }

    function toggle() {
        if (!isDraggin) {
            if (!isOpen) {
                return open()
            }
            return close()
        }
    }

    function setAnimations() {
        $element.style.transition = 'margin-bottom .3s'
    }

    function bounce() {
        if (widgetPosition < ELEMENT_BLOCK_SIZE / 2) {
            return open()
        }
        return close()
    }

    function dragEnd() {
        logger('DRAG END')
        isDraggin = false
        bounce()
    }

    function logger(message) {
        if (config.debug) {
            console.info(message)
        }
    }

    function open() {
        logger('Abrir Widget')
        isOpen = true
        widgetPosition = VISIBLE_Y_POSITION
        setWidgetPosition(widgetPosition)
    }

    function close() {
        logger('Cerrar Widget')
        isOpen = false
        widgetPosition = HIDDEN_Y_POSITION
        setWidgetPosition(widgetPosition)
    }

    function setWidgetPosition(value) {
        $element.style.marginBottom = `-${value}px`
    }

    function drag(event) {
        const cursorY = pageY(event)
        const movementY = cursorY - startY
        widgetPosition = widgetPosition + movementY
        logger(movementY)
        startY = cursorY
        if (widgetPosition > HIDDEN_Y_POSITION) {
            return false
        }
        setWidgetPosition(widgetPosition)
    }
}

