// import Vue from 'vue'
import config from '@/core/config'
import _ from 'lodash'

/*eslint-disable */
const idt2auth = new Idt2Auth({
    endpoint: config.get('app.api.endpoints.auth'),
    domainId: config.get('app.api.idt2auth_domain_id'),
    clientId: config.get('app.api.idt2auth_client_id')
})
/*eslint-enable */

const claimDependencies = config.get('app.claim_dependencies')
const tokenIntegrity = config.get('app.token_integrity')

let authService = {
    authUser: null,
    tenant: {},

    check () {
        return !!this.authUser
    },

    revokePasswordCheck () {
        return !!this.authUser.revokePassword
    },

    saveSession (token, authUser) {
        localStorage.setItem('token', token)

        this.authUser = authUser
    },

    refreshToken () {
        let self = this

        idt2auth.refreshToken({token: self.getToken()}, response => {
            if (response.status === 'success' && !response.revokePassword) {
                self.saveSession(response.accessToken, self.authUser)
            } else {
                self.removeSession()
            }
        })
    },

    removeSession () {
        var self = this
        var token = self.getToken()

        localStorage.removeItem('token')

        self.authUser = null

        if (token) {
            idt2auth.logout({ token: token })
            idt2auth.clearToken()
        }
    },

    getToken () {
        return localStorage.getItem('token')
    },

    identityPreflight (login) {
        return new Promise((resolve, reject) => {
            idt2auth.IdentityPreflight(login, (error, user) => {
                if (error) {
                    reject(error)
                    return
                }

                resolve(user)
            })
        })
    },

    setTenant (tenantId) {
        return idt2auth.setTenant(tenantId)
    },

    getTenant () {
        return idt2auth.getTenant()
    },

    hasRole (role) {
        return idt2auth.hasRole(role)
    },

    hasClaim (claim) {
        return idt2auth.hasClaim(claim)
    },

    tenantMetadata () {
        return this.authUser.tenantMetadata
    },

    tenantInfo () {
        return this.tenant || {}
    },

    authenticate (credentials) {
        return new Promise((resolve, reject) => {
            idt2auth.authenticate(credentials, (response) => {
                if (response.status === 'success' && response.accessToken) {
                    resolve(true)
                } else {
                    reject(new Error(false))
                }
            })
        })
    },

    login (credentials, claims = null) {
        let self = this

        return new Promise((resolve, reject) => {
            idt2auth.authenticate(credentials, (response) => {
                if (response.status === 'success') {
                    var token = response.accessToken

                    if (claims != null) {
                        if (!this.hasClaim(claims)) {
                            idt2auth.clearToken()
                            reject(new Error(false))
                            return
                        }
                    }

                    idt2auth.getUserProfile((error, user) => {
                        if (error) {
                            reject(new Error(false))
                        } else {
                            idt2auth.getUserTenantMetadata((error, data) => {
                                if (error) {
                                    reject(new Error(false))
                                    return
                                }

                                user.tenantMetadata = JSON.parse(data)
                                self.saveSession(token, user)

                                idt2auth.getTenantMetadata((error, data) => {
                                    if (error) {
                                        reject(new Error(false))
                                        return
                                    }

                                    self.tenant.metadata = data.metadata
                                    resolve(user)
                                })
                            })
                        }
                    })
                } else {
                    let loginError = new Error()
                    loginError.name = response.error_code
                    loginError.message = response.message

                    reject(loginError)
                }
            })
        })
    },

    restoreAuthentication (claims = null) {
        var self = this

        return new Promise((resolve, reject) => {
            var token = self.getToken()

            if (token) {
                idt2auth.refreshToken({ token: token }, (response) => {
                    if (response.status === 'success' && !response.revokePassword) {
                        var token = response.accessToken

                        if (self.checkTokenIntegrity() === false) {
                            self.removeSession()
                            resolve(true)
                            return
                        }

                        if (claims != null) {
                            if (!this.hasClaim(claims)) {
                                idt2auth.clearToken()
                                resolve(true)
                                return
                            }
                        }

                        idt2auth.getUserProfile((error, user) => {
                            if (error) {
                                self.removeSession()
                                resolve(true)
                            } else {
                                idt2auth.getUserTenantMetadata((error, data) => {
                                    if (error) {
                                        reject(new Error(false))
                                    }

                                    user.tenantMetadata = JSON.parse(data)

                                    idt2auth.getTenantMetadata((error, data) => {
                                        if (error) {
                                            reject(new Error(false))
                                            return
                                        }

                                        self.tenant.metadata = data.metadata
                                        self.saveSession(token, user)
                                        resolve(true)
                                    })
                                })
                            }
                        })
                    } else {
                        self.removeSession()
                        resolve(true)
                    }
                })
            } else {
                resolve(true)
            }
        })
    },

    changePassword (payload) {
        return new Promise((resolve) => {
            idt2auth.changePassword(payload.fields.currentPassword, payload.fields.newPassword, (error, response) => {
                resolve(error || response)
            })
        })
    },

    logout () {
        this.removeSession()
    },

    // Resolve all dependencies of a claim
    // claim: The claim's slug
    resolveClaimDependenciesRecursively (claim) {
        if (!claimDependencies) {
            return []
        }

        let resolvedDependencies = []

        let dependencies = claimDependencies[claim]

        if (dependencies && dependencies.length) {
            for (let i = 0; i < dependencies.length; i++) {
                resolvedDependencies.push(dependencies[i])

                resolvedDependencies.push(...this.resolveClaimDependenciesRecursively(dependencies[i]))
            }
        }

        return resolvedDependencies
    },

    // Resolve all the claims that have a specific claim as a dependency
    // claim: The claim's slug
    resolveDependableClaims (claim) {
        if (!claimDependencies) {
            return []
        }

        let self = this

        let dependableClaims = []

        _.forEach(claimDependencies, (dependencies, dependableClaim) => {
            let dependableClaimDependencies = self.resolveClaimDependenciesRecursively(dependableClaim)

            if (dependableClaimDependencies.indexOf(claim) >= 0) {
                dependableClaims.push(dependableClaim)
            }
        })

        return dependableClaims
    },

    checkTokenIntegrity () {
        let self = this

        if (tokenIntegrity && tokenIntegrity.requireTenant) {
            // on multi-tenant apps, logout if token doesn't have any
            // TODO: get from 2Auth if client is multi-tenant or not
            if (self.getTenant().literalId <= 1) {
                return false
            }
        }
    }
}

export default authService
