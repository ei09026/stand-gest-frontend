import Clients from '@/components/clients/Clients'
import ClientDetails from '@/components/clients/ClientDetails'

let routes = [
    {
        path: '/clients',
        component: Clients
    },
    {
        path: '/clients/:id',
        component: ClientDetails
    }
]

export default routes
