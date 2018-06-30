import _ from 'lodash'

const windowResizedListeners = []

const windowResized = _.debounce(() => {
    let size = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    for (let i = 0; i < windowResizedListeners.length; i++) {
        windowResizedListeners[i](size)
    }
}, 200)

export default {
    initialize () {
        window.addEventListener('resize', windowResized)
        windowResized()
    },

    onWindowResized (callback) {
        if (windowResizedListeners.indexOf(callback) < 0) {
            windowResizedListeners.push(callback)
        }
    },

    offWindowResized (callback) {
        var index = windowResizedListeners.indexOf(callback)

        if (index >= 0) {
            windowResizedListeners.splice(index, 1)
        }
    },

    closestVerticalEdge (el) {
        /* eslint-disable */
        return $(el).offset().top > (($(window).scrollTop() + $(window).height()) / 2)
            ? 'bottom'
            : 'top'
        /* eslint-enable */
    }
}
