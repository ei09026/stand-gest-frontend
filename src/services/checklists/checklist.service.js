import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let checklistService = {
    create (parameters) {
        return requestService.create(API_URL + '/api/v1/checklists', parameters)
    },

    retrieve (parameters) {
        return requestService.retrieve(API_URL + '/api/v1/checklists', parameters)
    },

    update (parameters) {
        return requestService.update(API_URL + '/api/v1/checklists', parameters)
    },

    items: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/checklists/items', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/checklists/items', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/checklists/items', parameters)
        }
    }
}

export default checklistService
