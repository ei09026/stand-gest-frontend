import {router} from '@/routes'
import authService from '@/services/shared/auth.service'
// import config from '@/core/config'

let jwtAuthInterceptor = {
    type: 'response',

    process (response) {
        let token = localStorage.getItem('token')    

        if (response.status > 0 &&
            (response.data.error_code === 'AuthenticationFailedException' ||
            (token && response.data.error_code === 'UnauthorizedException'))) {
            authService.logout()

            router.push('/login')
        }

        return response
    },

    exception (error) {
        return Promise.reject(error)
    }
}

export {jwtAuthInterceptor}
