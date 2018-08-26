import Vehicles from '@/components/vehicles/Vehicles'
import VehicleDetails from '@/components/vehicles/VehicleDetails'

let routes = [
    {
        path: '/vehicles',
        component: Vehicles
    },
    {
        path: '/vehicles/:id',
        component: VehicleDetails
    }
]

export default routes
