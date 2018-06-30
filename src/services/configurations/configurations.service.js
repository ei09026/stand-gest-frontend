import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let configurationsService = {
    retrieve (parameters) {
        return requestService.retrieve(API_URL + '/api/v1/configurations', parameters)
    },

    update (parameters) {
        return requestService.update(API_URL + '/api/v1/configurations', parameters)
    }
}

export default configurationsService
