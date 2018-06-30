import requestService from '@/services/shared/request.service'
import config from '@/core/config'

const API_URL = config.get('app.api.endpoints.backend') + '/api/v1/menus'

let sideMenuService = {
    retrieve (parameters) {
        return requestService.retrieve(API_URL, parameters)
    },

    create (parameters) {
        return requestService.create(API_URL, parameters)
    },

    update (parameters) {
        return requestService.update(API_URL, parameters)
    }
}

export default sideMenuService
