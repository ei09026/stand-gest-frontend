import config from '@/core/config'
import authService from '@/services/shared/auth.service'

let authorizationMiddleware = {
    config: {
        runs: 'before',
        name: 'authorization'
    },

    handle (to, from, next, middlewareParams) {
        if (!checkAuthorization(middlewareParams.authorize)) {
            to.meta.stopPipeline = true

            next({
                path: config.get('app.url.unauthorized')
                // query: {redirect: to.fullPath}
            })
        }
    }
}

let checkAuthorization = (authorize) => {
    if (!authorize) {
        return true
    }

    let rolesOk = true
    let claimsOk = true

    for (let i = 0; i < authorize.length; i++) {
        if (authorize[i].hasOwnProperty('roles')) {
            rolesOk = authService.hasRole(authorize[i].roles)
        }

        if (authorize[i].hasOwnProperty('claims')) {
            claimsOk = authService.hasClaim(authorize[i].claims)
        }
    }

    return rolesOk && claimsOk
}

export default authorizationMiddleware
