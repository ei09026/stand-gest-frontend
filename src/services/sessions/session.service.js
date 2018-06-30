import config from '@/core/config'
import requestService from '@/services/shared/request.service'

const API_URL = config.get('app.api.endpoints.backend')

let sessionsService = {
    sessions: {
        states: {
            ONGOING: 'onGoing',
            REOPENED: 'reopened',
            FINALIZED: 'finalized'
        },

        getStates () {
            let states = []

            Object.entries(this.states).forEach((element, index) => {
                states.push(
                    {
                        id: index + 1,
                        state: element[1]
                    }
                )
            })

            return states
        },

        create (parameters) {
            return requestService.create(API_URL + '/api/v1/sessions', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/sessions', parameters)
        },

        completedChecklistItems (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions/completed-checklist-items', parameters)
        }
    },

    sessionTypes: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/sessions/types', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions/types', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/sessions/types', parameters)
        },

        defaultSessionType () {
            return 1
        }
    },

    details: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/sessions/details', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions/details', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/sessions/details', parameters)
        }
    },

    documents: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/sessions/documents', parameters)
        },

        retrieve (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions/documents', parameters)
        },

        delete (parameters) {
            return requestService.delete(API_URL + '/api/v1/sessions/documents', parameters)
        }
    },

    checklistItems: {
        create (parameters) {
            return requestService.create(API_URL + '/api/v1/sessions/checklist-items', parameters)
        },

        update (parameters) {
            return requestService.update(API_URL + '/api/v1/sessions/checklist-items', parameters)
        },

        delete (parameters) {
            return requestService.delete(API_URL + '/api/v1/sessions/checklist-items', parameters)
        },

        completedChecklistItems (parameters) {
            return requestService.retrieve(API_URL + '/api/v1/sessions/checklist-items/completed-items', parameters)
        }
    }
}

export default sessionsService
