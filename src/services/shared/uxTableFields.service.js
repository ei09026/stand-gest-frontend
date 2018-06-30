import config from '@/core/config'
import requestService from '@/services/shared/request.service'
import _ from 'lodash'
import { i18n } from '@/bootstrap/app.bootstrap'

const API_URL = config.get('app.api.endpoints.backend')

let uxTableFieldsService = {
    retrieve (parameters) {
        return new Promise((resolve, reject) => {
            requestService.retrieve(API_URL + '/api/v2/ux-table-fields', parameters).then(response => {
                var computedFields = []

                _.forEach(response.data.data.results, function (field) {
                    computedFields.push(
                        {
                            id: field.id,
                            name: field.slug,
                            title: field.i18nCode.indexOf('|') > -1 ? i18n.tc(field.i18nCode.split('|')[0], field.i18nCode.split('|')[1]) : i18n.t(field.i18nCode),
                            visible: field.visible,
                            locked: field.locked,
                            draggable: field.draggable,
                            parentLocked: field.parentLocked
                        }
                    )
                })
                resolve(computedFields)
            })
        })
    },

    update (parameters) {
        return requestService.update(API_URL + '/api/v2/ux-table-fields', parameters)
    }
}

export default uxTableFieldsService
