import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let fuelTypesService = {
    create (parameters) {
        return requestService.post(API_URL + '/api/v1/fuel-types', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/fuel-types', parameters)
    },

    update (parameters) {
        return requestService.post(API_URL + '/api/v1/fuel-types', parameters)
    }
}

export default fuelTypesService
