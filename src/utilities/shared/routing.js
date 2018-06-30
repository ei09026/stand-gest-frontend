import config from '@/core/config'
import { router } from '@/routes'

export default {
    buildPath (path) {
        let prefix = config.get('app.router.prefix')

        if (config.get('app.app_env').toLowerCase() !== 'local' && prefix) {
            if (path.charAt(0) !== '/') {
                prefix += '/'
            }

            return '/' + prefix + path
        } else {
            return path
        }
    },

    normalizePath (path) {
        return path ? path.replace(/\/$/, '') : ''
    },

    pathsAreEqual (pathA, pathB) {
        return this.normalizePath(pathA) === this.normalizePath(pathB)
    },

    pathIsCurrent (path) {
        return this.pathsAreEqual(this.buildPath(path), router.currentRoute.path)
    }
}
