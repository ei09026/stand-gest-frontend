import requestService from '@/services/shared/request.service'
import config from '@/core/config'

const API_V2_URL = config.get('app.api.endpoints.backend') + '/api/v2'

let smartFormsService = {
    retrieve (parameters) {
        return requestService.retrieve(API_V2_URL + '/smart-forms', parameters)
    },

    versions: {
        retrieve (parameters) {
            return requestService.retrieve(API_V2_URL + '/smart-forms/versions', parameters)
        },

        create (parameters) {
            return requestService.create(API_V2_URL + '/smart-forms/versions', parameters)
        },

        update (parameters) {
            return requestService.update(API_V2_URL + '/smart-forms/versions', parameters)
        }
    }
}

export default smartFormsService
