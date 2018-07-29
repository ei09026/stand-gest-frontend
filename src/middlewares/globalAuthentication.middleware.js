import config from '@/core/config'
import authService from '@/services/shared/auth.service'

let globalAuthenticationMiddleware = {
    config: {
        runs: 'before',
        name: 'globalAuthentication',
        global: true
    },

    handle (to, from, next, middlewareParams) {
        let isAuthenticated = localStorage.getItem('token')
        let matchesRequireAuth = to.matched.some(record => !record.meta || !(record.meta.allowGuest || record.meta.requireGuest))
        let matchesRequireGuest = to.matched.some(record => record.meta && record.meta.requireGuest)

        if (matchesRequireAuth && (!isAuthenticated)) {
                // (authService.revokePasswordCheck() && config.get('app.app_module') === 'WebFrontoffice'))) {

            to.meta.stopPipeline = true

            next({
                path: '/login'
            })
        } else if (matchesRequireGuest && isAuthenticated) {
            if (to.path !== '/') {
                to.meta.stopPipeline = true

                next({
                    path: '/'
                })
            }
        }
    }
}

export default globalAuthenticationMiddleware
