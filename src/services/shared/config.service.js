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
    
        var response = {
            "status":"success",
            "message":"",
            "error_code":"",
            "data":{
                "availableLocales":{
                    "pt-PT":"Português",
                    "en-US":"English U.S."
                },
                "defaultLocale":"pt-PT",
                "translationMode":"file",
                "configurations":{
                    "itemsPerPage":20,
                    "page":1,
                    "totalItems":0,
                    "results":[]
                }
            }
        }
            
        self.configuration.locale.available = response.data.availableLocales

        let localeConfiguration = _.find(response.data.configurations.results, {slug: 'LOCALE'})

        self.configuration.locale.current = localeConfiguration ? localeConfiguration.details : response.data.defaultLocale

        self.configuration.locale.mode = response.data.translationMode            
    },

    setLocale (locale) {
        this.configuration.locale.current = locale

        // TODO: persist the new locale
        //requestService.update(API_URL + '/api/v1/configurations', ...)
    }
}

export default configService
