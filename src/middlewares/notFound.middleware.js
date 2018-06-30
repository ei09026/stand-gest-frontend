import config from '@/core/config'

let notFoundMiddleware = {
    config: {
        runs: 'before',
        name: 'notFound',
        global: true
    },
    handle (to, from, next, middlewareParams) {
        if (to.matched.length === 0) {
            to.meta.stopPipeline = true

            next({
                path: config.get('app.url.not_found')
            })
        }
    }
}

export default notFoundMiddleware
