import Vue from 'vue'
import env from '@/core/env'
import configService from '@/services/shared/config.service'
import {i18n} from '@/bootstrap/app.bootstrap'
import routingUtility from '@/utilities/shared/routing'

let transService = {
    loadTranslation () {
        return new Promise((resolve, reject) => {
            var localeConfig = configService.configuration.locale

            if (!localeConfig.current) {
                reject(new Error(false))
            }

            if (localeConfig.mode === 'file') {
                var localeFile = localeConfig.current + '.' + env.get('build_hash') + '.json'

                return Vue.axios.get(routingUtility.buildPath('/static/lang/' + localeFile)).then(response => {
                    i18n.locale = localeConfig.current

                    i18n.setLocaleMessage(localeConfig.current, response.data)
                    i18n.locale = localeConfig.current

                    resolve(true)
                })
            }

            resolve(true)
        })
    }
}

export default transService
