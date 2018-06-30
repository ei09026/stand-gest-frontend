import { i18n } from '@/bootstrap/app.bootstrap'

const toastr = window.toastr

const defaultOptions = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': true,
    'positionClass': 'toast-top-right',
    'preventDuplicates': true,
    'showDuration': '3000',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
}

function mergeOptions (options) {
    var finalOptions = {}

    Object.assign(finalOptions, defaultOptions, options)

    return finalOptions
}

function displayToastr (type, title, message, options) {
    toastr[type](title, message, mergeOptions(options))
}

let toastrService = {
    success (title, message, options) {
        displayToastr('success', message, title, options)
    },

    info (title, message, options) {
        displayToastr('info', message, title, options)
    },

    warning (title, message, options) {
        displayToastr('warning', message, title, options)
    },

    error (title, message, options) {
        displayToastr('error', message, title, options)
    },

    unexpectedError (options) {
        let title, message, messageDetail

        if (options) {
            title = options.title
            message = options.message
            messageDetail = options.messageDetail
        }

        let unexpectedErrorOptions = {
            'closeButton': true,
            'positionClass': 'toast-unexpected-error',
            'onclick': null,
            'timeOut': '0',
            'extendedTimeOut': '0'
        }

        title = title || i18n.t('general.error')
        message = message || '<br/>' + i18n.t('error.unexpected-error')

        if (messageDetail) {
            message = message + '<br/>(' + messageDetail + ')<br/><br/>'
        } else {
            message = message + '<br/><br/>'
        }

        displayToastr('error', message, title, unexpectedErrorOptions)
    }
}

export default toastrService
