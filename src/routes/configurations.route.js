import SessionTypes from '@/components/configurations/SessionTypes'
import Checklists from '@/components/configurations/Checklists'
import Brands from '@/components/configurations/Brands'

let routes = [
    {
        path: '/configurations/session-types',
        component: SessionTypes
    },
    {
        path: '/configurations/checklists',
        component: Checklists
    },
    {
        path: '/configurations/brands',
        component: Brands
    }
]

export default routes
