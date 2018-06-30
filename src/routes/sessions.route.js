import Session from '@/components/sessions/Session'
import SessionDetails from '@/components/sessions/maintenance/SessionDetails'

let routes = [
    {
        path: '/sessions',
        component: Session,
        meta: {
            middleware: [
                {
                    name: 'authorization',
                    /*authorize: [
                        {
                            claims: [
                                'OPERATOR',
                                'SUPER_USER'
                            ]
                        }
                    ]*/
                }
            ]            
        }
    },
    {
        path: '/new-session',
        component: SessionDetails,
        meta: {
            bodyClass: 'immersive-red',
            middleware: [
                {
                    name: 'authorization',
                    /*authorize: [
                        {
                            claims: [
                                'OPERATOR',
                                'SUPER_USER'
                            ]
                        }
                    ]*/
                }
            ]            
        }
    },
    {
        path: '/edit-session/:id',
        component: SessionDetails,
        meta: {
            bodyClass: 'immersive-red',
            middleware: [
                {
                    name: 'authorization',
                    /*authorize: [
                        {
                            claims: [
                                'OPERATOR',
                                'SUPER_USER'
                            ]
                        }
                    ]*/
                }
            ]            
        }
    },
    {
    	path: '/sessions/:id',
        component: SessionDetails,
        meta: {
            bodyClass: 'immersive-red',
            middleware: [
                {
                    name: 'authorization'
                    /*authorize: [
                        {
                            claims: [
                                'OPERATOR',
                                'SUPER_USER'
                            ]
                        }
                    ]*/
                }
            ]
        }
    }
]

export default routes
