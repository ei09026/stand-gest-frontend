import registeredMiddleware from '@/core/registeredMiddlewareContainer'
import {router} from '@/routes'

function runsBefore () {
    router.beforeEach((to, from, next) => {
        to.meta.stopPipeline = false

        dispatchGlobalMiddleware(to, from, next, 'before').then(() => {
            if (!to.meta.stopPipeline) {
                dispatchMiddleware(to, from, next, 'before')
            }
        })
    })
}

function runsAfter () {
    router.afterEach((to, from, next) => {
        to.meta.stopPipeline = false
        
        dispatchGlobalMiddleware(to, from, next, 'after').then(() => {
            if (!to.meta.stopPipeline) {
                dispatchMiddleware(to, from, next, 'after')
            }
        })
    })
}

function getMiddleware (to) {
    // Collect all middleware from base route
    var middleware = []

    if (to.matched) {
        for (let i = 0; i < to.matched.length; i++) {
            if (to.matched[i].meta) {
                if (to.matched[i].meta.hasOwnProperty('middleware')) {
                    for (let n = 0; n < to.matched[i].meta.middleware.length; n++) {
                        middleware.push(to.matched[i].meta.middleware[n])
                    }
                }
            }
        }
    }

    return middleware
}

function dispatchGlobalMiddleware (to, from, next, runs) {
    return new Promise((resolve, reject) => {
        var global = registeredMiddleware.get('global')

        for (let i = 0; i < global.length; i++) {
            let mw = global[i][Object.keys(global[i])]

            if (mw.config.runs === runs) {
                mw.handle(to, from, next)

                if (to.meta.stopPipeline) {
                    // next(false)
                    break
                }
            }
        }

        resolve(true)
    })
}

function dispatchMiddleware (to, from, next, runs) {
    var middleware = getMiddleware(to)

    if (middleware.length > 0) {
        for (let i = 0; i < middleware.length; i++) {
            let mw = registeredMiddleware.get(middleware[i].name)

            if (mw.config.runs === runs) {
                mw.handle(to, from, next, middleware[i])

                if (to.meta.stopPipeline) {
                    // next(false)
                    break
                }
            }
        }
        if (!to.meta.stopPipeline) {
            if (runs === 'before') {
                next()
            }
        }
    } else {
        if (runs === 'before') {
            next()
        }
    }
}

function boot () {
    runsBefore()
    runsAfter()
}

export default {boot}
