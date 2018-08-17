import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let colorsService = {
    create (parameters) {
        return requestService.post(API_URL + '/api/v1/colors', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/colors', parameters)
    },

    update (parameters) {
        return requestService.post(API_URL + '/api/v1/colors', parameters)
    }
}

export default colorsService
