import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let extrasService = {
    create (parameters) {
        return requestService.post(API_URL + '/api/v1/extras', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/extras', parameters)
    },

    update (parameters) {
        return requestService.post(API_URL + '/api/v1/extras', parameters)
    }
}

export default extrasService
