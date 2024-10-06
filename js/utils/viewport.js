export function setViewportSize($elemento) {
    const vieportBlockSize = getViewport()
    $elemento.style.blockSize = `${vieportBlockSize}px`
}

export function getViewport() {
    return window.innerHeight
}

export function onViewportResize(callback) {
    window.addEventListener('resize', callback)
}

export function offViewportResize(callback) {
    window.removeEventListener('resize', callback)
}

export function viewportSize($elemento) {
    setViewportSize($elemento)

    onViewportResize(() => setViewportSize($elemento))
}