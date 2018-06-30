import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueI18n from 'vue-i18n'
import VTooltip from 'v-tooltip'

import store from '@/vuex/store'
import App from '@/App'
import {bootInterceptors} from '@/interceptors'
import {bootRoutes, router} from '@/routes'
import {bootMiddlewares} from '@/middleware'
import configService from '@/services/shared/config.service'
import transService from '@/services/shared/trans.service'
import authService from '@/services/shared/auth.service'
import domService from '@/services/shared/dom.service'

// We want to apply VueAxios and VueI18n
// to our Vue instance
Vue.use(VueAxios, axios)
Vue.use(VueI18n)

var app = null
var i18n = new VueI18n()

function boot () {
    // Remove lodash from the global scope
    _.noConflict()

    // Boot all configured interceptors
    bootInterceptors()

    // Boot all configured routes
    bootRoutes()

    // Boot all configure middlewares
    bootMiddlewares()

    // Restore authentication from token and fetch configurations/translations
    return authService.restoreAuthentication().then(() => {
        return configService.fetchConfiguration()
    }).then(() => {
        return transService.loadTranslation()
    }).then((resolve) => {
        app = new Vue({
            store,
            router,
            i18n,
            ...App
        })

        domService.onWindowResized(size => {
            store.dispatch('setPageContentSize', size)
        })

        domService.initialize()
    })
}

export {boot, app, router, i18n}
