import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let usersService = {
    create (parameters) {
        return requestService.post(API_URL + '/api/v1/users', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/users', parameters)
    },

    update (parameters) {
        return requestService.post(API_URL + '/api/v1/users', parameters)
    }
}

export default usersService
