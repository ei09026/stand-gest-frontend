import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let documentsService = {
    retrieve (parameters) {
        return requestService.retrieve(API_URL + '/api/v1/documents', parameters)
    },

    retrieveAsFile (parameters) {
        return requestService.retrieve(API_URL + '/api/v1/documents/as-file', parameters)
    }
}

export default documentsService
