import _ from 'lodash'
import config from '@/core/config'
import authService from '@/services/shared/auth.service'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let configService = {
    configuration: {
        locale: {
            available: {},
            current: null,
            mode: null
        }
    },

    fetchConfiguration () {
        var self = this

        return requestService.retrieve(API_URL + '/api/v1/configurations').then(response => {
            self.configuration.locale.available = response.data.data.availableLocales

            let localeConfiguration = _.find(response.data.data.configurations.results, {slug: 'LOCALE'})

            self.configuration.locale.current = localeConfiguration ? localeConfiguration.details : response.data.data.defaultLocale

            self.configuration.locale.mode = response.data.data.translationMode
        })
    },

    setLocale (locale) {
        this.configuration.locale.current = locale

        // TODO: persist the new locale
        //requestService.update(API_URL + '/api/v1/configurations', ...)
    }
}

export default configService
