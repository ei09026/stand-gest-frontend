import Users from '@/components/users/Users'
import Overview from '@/components/users/Overview'
import UserDetails from '@/components/users/UserDetails'
import Tenants from '@/components/users/Tenants'
import Authorization from '@/components/users/Authorization'

let routes = [
    {
        path: '/users',
        component: Users,
        // meta: {
        //     middleware: [
        //         {
        //             name: 'authorization',
        //             authorize: [
        //                 {
        //                     claims: [
        //                         'BO_USERS'
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // }
    },
    {
        path: '/users/:id',
        component: Overview,
        // meta: {
        //     middleware: [
        //         {
        //             name: 'authorization',
        //             authorize: [
        //                 {
        //                     claims: [
        //                         'BO_USERS_OVERVIEW'
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // },
        children: [
            {
                path: '/',
                component: UserDetails
            },
            // {
            //     path: 'tenants',
            //     component: Tenants,
            //     // meta: {
            //     //     middleware: [
            //     //         {
            //     //             name: 'authorization',
            //     //             authorize: [
            //     //                 {
            //     //                     claims: [
            //     //                         'BO_USERS_AGENCIES'
            //     //                     ]
            //     //                 }
            //     //             ]
            //     //         }
            //     //     ]
            //     // }
            // },
            {
                path: 'authorization',
                component: Authorization,
                // meta: {
                //     middleware: [
                //         {
                //             name: 'authorization',
                //             authorize: [
                //                 {
                //                     claims: [
                //                         'BO_USERS_AUTHORIZATION'
                //                     ]
                //                 }
                //             ]
                //         }
                //     ]
                // }
            }
        ]
    }
]

export default routes
