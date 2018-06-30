import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let uxTableFieldsService = {
    retrieve (parameters) {
        return requestService.retrieve(API_URL + '/api/v2/ux-table-fields', parameters)
    },

    update (filter, parameters) {
        return requestService.update(API_URL + '/api/v2/ux-table-fields', parameters)
    }
}

export default uxTableFieldsService
