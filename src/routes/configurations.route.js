import SessionTypes from '@/components/configurations/SessionTypes'
import Checklists from '@/components/configurations/Checklists'
import Brands from '@/components/configurations/Brands'
import FuelTypes from '@/components/configurations/FuelTypes'
import Users from '@/components/configurations/Users'

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
        path: '/configurations/users',
        component: Users
    },
    {
        path: '/configurations/brands',
        component: Brands
    },
    {
        path: '/configurations/fuel-types',
        component: FuelTypes
    }
]

export default routes
