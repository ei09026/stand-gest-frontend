import registeredMiddleware from '@/core/registeredMiddlewareContainer'
import baseRouteMiddleware from '@/core/route.middleware'

import notFound from '@/middlewares/notFound.middleware'
import authorization from '@/middlewares/authorization.middleware'
import globalAuthentication from '@/middlewares/globalAuthentication.middleware'
import clearLoadings from '@/middlewares/clearLoadings.middleware'
import clearModal from '@/middlewares/clearModal.middleware'

const middlewares = [
    notFound,
    authorization,
    globalAuthentication,
    clearLoadings,
    clearModal
]

function bootMiddlewares () {
    for (let i = 0; i < middlewares.length; i++) {
        let middleware = middlewares[i]

        if (middleware.config.global) {
            let global = registeredMiddleware.get('global')

            global.push({[middleware.config.name]: middleware})
        } else {
            registeredMiddleware.set(middleware.config.name, middleware)
        }
    }

    baseRouteMiddleware.boot()
}

export {bootMiddlewares}
