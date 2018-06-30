// Import routes
import coreRoutes from '@/routes/core.route'
import configurations from '@/routes/configurations.route'
import testsRoutes from '@/routes/tests.route'
import sessionRoutes from '@/routes/sessions.route'
import usersRoutes from '@/routes/users.route'

// Register imported routes
let routes = [
    coreRoutes,
    configurations,
    testsRoutes,
    sessionRoutes,
    usersRoutes
]

/*** Do not modify below this line ***/

import Vue from 'vue'
import VueRouter from 'vue-router'
import _ from 'lodash'
import config from '@/core/config'

Vue.use(VueRouter)

var router = null

function bootRoutes () {
    var combinedRoutes = []

    let routerPrefix = config.get('app.router.prefix').toString()

    for (let i = 0; i < routes.length; i++) {
        if (process.env.NODE_ENV !== 'development' && routerPrefix) {
            _.map(routes[i], (value, key) => {
                if (value.path) {
                    value.path = '/' + routerPrefix + (value.path.startsWith('/') ? value.path : '/' + value.path)
                }
            })
        }

        combinedRoutes.push(...routes[i])
    }

    router = new VueRouter({
        mode: 'history',
        routes: combinedRoutes,
        linkActiveClass: 'active'
    })

    router.beforeEach((to, from, next) => {
        let path = to.path
        let routerPrefix = '/' + config.get('app.router.prefix').toString()

        if (process.env.NODE_ENV !== 'development' && routerPrefix) {
            if (!to.path.startsWith(routerPrefix)) {
                path = routerPrefix + to.path
                next(path)
            } else {
                next()
            }
        } else {
            next()
        }
    })
}

export {bootRoutes, router}
