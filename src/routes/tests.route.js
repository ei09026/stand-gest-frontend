import Tests from '@/components/tests/Tests'

let routes = [
    {
        path: '/tests',
        component: Tests,
        // meta: {
        //     middleware: [
        //         {
        //             name: 'authorization',
        //             authorize: [
        //                 {
        //                     claims: [
        //                         'APPRAISER',
        //                         'VALIDATOR'
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // }
    }
]

export default routes
