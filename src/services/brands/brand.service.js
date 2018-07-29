import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let brandService = {
    create (parameters) {
        return requestService.create(API_URL + '/api/v1/brands', parameters)
    },

    retrieve (parameters) {
        return requestService.post(API_URL + '/api/v1/brands', parameters)
    },

    update (parameters) {
        return requestService.update(API_URL + '/api/v1/brands', parameters)
    },

    items: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/brands/models', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/brands/models', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/brands/models', parameters)
        }
    }
}

export default brandService
