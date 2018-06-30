import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let updatesService = {
    checkForUpdates (parameters) {
        return new Promise((resolve, reject) => {
            return requestService.retrieve(API_URL + '/api/v1/updates', parameters).then(response => {
                let updatesAvailable = false

                if (response.data.status === 'success' && response.data.data.results.length > 0) {
                    let buildNumberKey = config.get('app.app_module') === 'WebFrontoffice' ? 'frontendBuildNumber' : 'backofficeBuildNumber'

                    updatesAvailable = response.data.data.results[0][buildNumberKey] > parameters.buildNumber
                }

                resolve(updatesAvailable)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

export default updatesService
