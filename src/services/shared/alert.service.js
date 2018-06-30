// This service uses the SweetAlert2 library
// For documentation and updates, head over to:
// https://github.com/limonte/sweetalert2

import swal from 'sweetalert2'
import { i18n } from '@/bootstrap/app.bootstrap'

let getDefaultOptions = () => ({
    confirmButtonText: i18n.t('actions.ok'),
    cancelButtonText: i18n.t('actions.cancel'),
    confirmButtonClass: 'btn btn-primary btn-lg m-l-xs m-r-xs',
    cancelButtonClass: 'btn btn-default btn-lg m-l-xs m-r-xs',
    buttonsStyling: false,
    useRejections: true // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
})

function mergeOptions (original, override) {
    if (!override) {
        return original
    }

    var final = {}

    Object.assign(final, original, override)

    return final
}

function displayAlert (options) {
    return swal(mergeOptions(getDefaultOptions(), options))
}

let alertService = {
    swal,
    
    noop () { },

    isCancel (exception) {
        return ['cancel', 'overlay', 'close', 'timer'].indexOf(exception) >= 0
    },

    advanced (options) {
        return displayAlert(options)
    },

    basic (text, title, type = 'info') {
        return displayAlert({ text, title, type })
    },

    info (text) {
        return this.basic(text, i18n.t('general.information'))
    },

    success (text) {
        return this.basic(text, i18n.t('general.success'), 'success')
    },

    warning (text) {
        return this.basic(text, i18n.t('general.warning'), 'warning')
    },

    error (text) {
        return this.basic(text, i18n.t('general.error'), 'error')
    }
}

export default alertService
