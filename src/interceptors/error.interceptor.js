// import {router} from '@/routes'
// import config from '@/core/config'
import toastrService from '@/services/shared/toastr.service'
import {i18n} from '@/bootstrap/app.bootstrap'

let errorInterceptor = {
    type: 'response',

    process (response) {
        return response
    },

    exception (error) {
        if (error.message === 'Network Error') {
            toastrService.unexpectedError({messageDetail: i18n.t('error.server-communication-error')})
        }

        if (error.response) {
            if ([500, 404, 401].indexOf(error.response.status) !== -1) {
                toastrService.unexpectedError()
            }
        }

        return Promise.reject(error)
    }
}

export {errorInterceptor}
