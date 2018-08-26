import Negotiations from '@/components/negotiations/Negotiations'
import NegotiationDetails from '@/components/negotiations/NegotiationDetails'
import CreateNegotiation from '@/components/negotiations/CreateNegotiation'

let routes = [
    {
        path: '/negotiations',
        component: Negotiations
    },
    {
        path: '/negotiations/create',
        component: CreateNegotiation
    },
    {
        path: '/negotiations/:id',
        component: NegotiationDetails
    }
]

export default routes
