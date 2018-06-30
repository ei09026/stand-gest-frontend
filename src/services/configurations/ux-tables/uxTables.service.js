import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let uxTablesService = {
    retrieve (parameters) {
        return requestService.retrieve(API_URL + '/api/v1/ux-tables', parameters)
    }
}

export default uxTablesService
