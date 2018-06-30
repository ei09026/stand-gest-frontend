import Login from '@/components/core/authentication/Login'
import Signup from '@/components/core/authentication/Signup'
import Unauthorized from '@/components/core/errors/401'
import NotFound from '@/components/core/errors/404'

import Dashboard from '@/components/home/Dashboard'

/*
    meta.requireGuest: needs to be unauthenticated
    meta.allowGuest: can visit when unauthenticated
    (default): always needs authentication
*/

let routes = [
    {
        path: '/',
        meta: {
            fullContent: false,
            pageClass: 'dashboard-page'
        },
        component: Dashboard
    },
    {
        path: '/login',
        meta: {
            requireGuest: true,
            fullContent: true,
            pageClass: 'landing login no-padding'
        },
        component: Login
    },
    {
        path: '/signup',
        meta: {
            requireGuest: true,
            fullContent: true
        },
        component: Signup
    },
    {
        path: '/401',
        meta: {
            allowGuest: true,
            fullContent: true
        },
        component: Unauthorized
    },
    {
        path: '/404',
        meta: {
            allowGuest: true,
            fullContent: true
        },
        component: NotFound
    }
]

export default routes
