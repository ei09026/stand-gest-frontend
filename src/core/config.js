import * as configurations from '@/configs'

function getPath (object, keys) {
    let tmp = keys.split('.')
    let obj = object[tmp.shift()]

    while (obj && tmp.length) {
        obj = obj[tmp.shift()]
    }

    return obj
}

let get = (configuration, value) => {
    let tmp = configuration.split('.')
    let file = tmp.shift()
    let path = tmp.join('.')

    let configValue = getPath(configurations[file], path)

    if (typeof configValue === 'undefined') {
        configValue = value
    }

    return configValue
}

export default {get}