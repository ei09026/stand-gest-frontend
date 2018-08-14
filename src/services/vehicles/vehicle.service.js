import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let vehicleService = {
    create (parameters) {
        return requestService.post(API_URL + '/api/v1/vehicles', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/vehicles', parameters)
    },

    update (parameters) {
        return requestService.post(API_URL + '/api/v1/vehicles', parameters)
    }
}

export default vehicleService
