import SessionTypes from '@/components/configurations/SessionTypes'
import Checklists from '@/components/configurations/Checklists'
import Brands from '@/components/configurations/Brands'
import FuelTypes from '@/components/configurations/FuelTypes'
import Users from '@/components/configurations/Users'
import Extras from '@/components/configurations/Extras'

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
    },
    {
        path: '/configurations/extras',
        component: Extras
    }
]

export default routes
