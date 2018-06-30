import {boot, app} from '@/bootstrap/app.bootstrap'

// bootstrap the app
boot().then(() => {
    app.$mount('#app')
})
