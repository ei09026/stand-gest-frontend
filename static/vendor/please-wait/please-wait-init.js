setTimeout(loadingScreen, 2500)

function loadingScreen () {
    if (!window.abortLoadingScreen) {
        window.loadingScreenActive = true

        window.loadingScreen = window.pleaseWait({
            logo: '/static/assets/manufacturer-logo.png',
            backgroundColor: '#f3f3f4',
            loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
        })
    }
}
