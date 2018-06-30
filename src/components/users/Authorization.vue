<template>
    <div class="row users-authorization">
        <div class="col-xs-12"
            v-show="isSettingsBusy">

            <loading></loading>
        </div>

        <div class="col-lg-8 col-lg-offset-2 m-t-md alert alert-info"
            v-show="!isSettingsBusy && !tenants.length"
            v-text="$i18n.t('users.authorization.user-has-no-related-tenants')"></div>

        <div class="col-xs-12"
            v-if="!isSettingsBusy && tenants.length">

            <div class="row">
                <div class="col-lg-4">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <!-- <div class="pull-right btn-group">
                                <button class="btn btn-sm m-t-n-xs btn-primary"
                                    :class="{
                                        'btn-outline': selectedTenantType === 'backoffice',
                                        'disabled': !frontOfficeTenants.length
                                    }"
                                    v-tooltip="frontOfficeTenantButtonTooltip"
                                    @click="selectFrontOfficeTenant">

                                    Front-office
                                </button>

                                <button class="btn btn-sm m-t-n-xs btn-primary"
                                    :class="{
                                        'btn-outline': selectedTenantType === 'frontoffice'
                                    }"
                                    @click="selectBackOfficeTenant">

                                    Back-office
                                </button>
                            </div> -->

                            <check-all-items
                                v-model="checkedRoles"
                                :original-set="roles.map(role => role.id)">

                                {{ $i18n.tc('users.authorization.role', 2) }}
                            </check-all-items>
                        </div>

                        <loading
                            v-show="isLoadingRoles"></loading>

                        <div class="list-group"
                            v-if="!isLoadingRoles">

                            <check-item
                                class="list-group-item"
                                v-for="role in roles"
                                :key="role.id"
                                v-model="checkedRoles"
                                :val="role.id">

                                {{ role.description }}

                                <span class="font-italic"
                                    v-if="!role.description"
                                    v-text="role.slug"></span>
                            </check-item>

                            <div class="list-group-item">
                                {{ $i18n.t('users.authorization.no-roles') }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="panel panel-default">
                        <div class="panel-heading"
                            v-text="$i18n.tc('users.authorization.claim', 2)"></div>

                        <loading
                            v-show="isLoadingClaims"></loading>

                        <div class="list-group claim-list"
                            v-if="!isLoadingClaims">

                            <div class="list-group-item status-group-header active-group">
                                <span class="pull-right font-italic">
                                    {{ $i18n.t('users.authorization.override-roles') }}
                                </span>

                                <span class="title">
                                    {{ $i18n.tc('general.active', 2) }}
                                </span>
                            </div>

                            <template
                                v-for="group in groupedClaims.activeClaims">

                                <template
                                    v-if="group.claims.length">

                                    <div class="list-group-item claim-group-header"
                                        v-text="group.description"
                                        :key="'header-' + group.id"></div>

                                    <div class="list-group-item"
                                        v-for="claim in group.claims"
                                        :key="'item-' + group.id + '-' + claim.id"
                                        v-tooltip="{title: activeClaimTooltip(claim), html: true, placement: 'left'}">

                                        <switch-button class="pull-right"
                                            type="red-off-green"
                                            :tooltip-off="switchButtonTooltipOff"
                                            :value="claim.allow"
                                            @input="claimStateChanged(claim, $event)"></switch-button>

                                        <span class="label m-r-sm"
                                            :class="{
                                                'label-success': isActiveClaimAllowed(claim),
                                                'label-danger': !isActiveClaimAllowed(claim)
                                            }">
                                            <i class="fa fa-fw"
                                                :class="{
                                                    'fa-check': isActiveClaimAllowed(claim),
                                                    'fa-times': !isActiveClaimAllowed(claim)
                                                }"></i>

                                            {{ isActiveClaimAllowed(claim) ? $i18n.t('state.allow') : $i18n.t('state.deny') }}
                                        </span>

                                        {{ claim.description }}

                                        <span class="font-italic"
                                            v-if="!claim.description"
                                            v-text="claim.slug"></span>
                                    </div>
                                </template>
                            </template>

                            <div class="list-group-item"
                                v-show="!activeClaims.length">

                                {{ $i18n.t('users.authorization.no-active-claims') }}
                            </div>

                            <div class="list-group-item status-group-header inactive-group">
                                <span class="pull-right font-italic">
                                    {{ $i18n.t('users.authorization.override-roles') }}
                                </span>

                                <span class="title">
                                    {{ $i18n.tc('general.inactive', 2) }}
                                </span>
                            </div>

                            <template
                                v-for="group in groupedClaims.inactiveClaims">

                                <template
                                    v-if="group.claims.length">

                                    <div class="list-group-item claim-group-header"
                                        v-text="group.description"
                                        :key="'header-' + group.id"></div>

                                    <div class="list-group-item"
                                        v-for="claim in group.claims"
                                        :key="'item-' + group.id + '-' + claim.id">

                                        <switch-button class="pull-right"
                                            type="red-off-green"
                                            :tooltip-off="switchButtonTooltipOff"
                                            :value="claim.allow"
                                            @input="claimStateChanged(claim, $event)"></switch-button>

                                        {{ claim.description }}

                                        <span class="font-italic"
                                            v-if="!claim.description"
                                            v-text="claim.slug"></span>
                                    </div>
                                </template>
                            </template>

                            <div class="list-group-item"
                                v-show="!inactiveClaims.length">

                                {{ $i18n.t('users.authorization.no-inactive-claims') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button-bar>
            <button class="btn btn-warning btn-circle btn-outline m-l-sm"
                v-if="hasUnsavedChanges"
                v-tooltip="{title: $i18n.t('actions.discard-changes')}"
                @click="discardChanges">
                <i class="fa fa-recycle"></i>
            </button>

            <button class="btn btn-success btn-circle btn-outline m-l-sm"
                v-if="hasUnsavedChanges"
                v-tooltip="{title: $i18n.t('actions.save-changes')}"
                @click="saveChanges">
                <i class="fa fa-save"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import toastrService from '@/services/shared/toastr.service'
    import clientService from '@/services/client/client.service'
    import tenantsService from '@/services/tenants/tenants.service'
    import usersService from '@/services/users/users.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters, mapActions} from 'vuex'
    import tooltip from '@/directives/tooltip'
    import Toolbar from '@/components/shared/Toolbar'
    import Loading from '@/components/shared/Loading'
    import Multiselect from '@/components/shared/multi-select'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import CheckAllItems from '@/components/shared/check-items/CheckAllItems'
    import SwitchButton from '@/components/shared/input/SwitchButton'
    import ButtonBar from '@/components/shared/ButtonBar'

    export default {
        directives: {
            tooltip
        },

        components: {
            Loading,
            Toolbar,
            Multiselect,
            CheckItem,
            CheckAllItems,
            SwitchButton,
            ButtonBar
        },

        props: {
            user: {
                type: Object,
                required: true
            }
        },

        data () {
            return {
                tenants: [],
                selectedTenant: null,

                originalData: {
                    userClaims: []
                },

                roles: [],
                claims: [],
                claimGroups: [],
                tenantRoles: [],
                userRoles: [], // this is never changed. only checkedRoles change
                userClaims: [],

                checkedRoles: []
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            orderedTenants () {
                return _.sortBy(this.tenants, ['system', 'description'])
            },

            frontOfficeTenants () {
                return this.tenants.filter(tenant => tenant.id !== 1)
            },

            frontOfficeTenantButtonTooltip () {
                return {
                    title: this.frontOfficeTenants.length ? '' : this.$i18n.t('authorization.general.there-are-no-tenants'),
                    placement: 'top'
                }
            },

            selectedTenantType () {
                if (!this.selectedTenant) {
                    return null
                }

                return this.selectedTenant.id === 1 ? 'backoffice' : 'frontoffice'
            },

            allowedClaimGroupSystemSlug () {
                if (this.selectedTenant && this.selectedTenant.id === 1) {
                    return 'backoffice'
                }

                return null
            },

            allowedClaimGroups () {
                let self = this

                if (!self.selectedTenant) {
                    return []
                }

                return self.claimGroups.filter(group => group.systemSlug === self.allowedClaimGroupSystemSlug)
            },

            // Claims allowed for this tenant - use this computed instead of this.claims
            allowedClaims () {
                if (!this.selectedTenant) {
                    return []
                }

                let allowedClaimGroupIds = this.allowedClaimGroups.map(group => group.id)

                if (this.allowedClaimGroupSystemSlug === null) {
                    allowedClaimGroupIds.push(null)
                }

                return this.claims.filter(claim => {
                    return allowedClaimGroupIds.indexOf(claim.claimGroupId) >= 0
                })
            },

            activeClaimsFromRoles () {
                let self = this

                let intersectedRoles = this.tenantRoles.filter(role => {
                    return self.checkedRoles.indexOf(role.id) >= 0
                })

                let claimsFromRoles = []

                let addRoleToClaim = (claim, role) => {
                    let index = _.findIndex(claimsFromRoles, { id: claim.id })

                    if (index < 0) {
                        index = claimsFromRoles.push(Object.assign({}, claim, { roles: [] })) - 1
                    }

                    let roleClean = Object.assign({}, role)
                    delete roleClean.claims

                    claimsFromRoles[index].roles.push(Object.assign({}, roleClean))
                }

                for (let i=0; i<intersectedRoles.length; i++) {
                    for (let j=0; j<intersectedRoles[i].claims.length; j++) {
                        addRoleToClaim(intersectedRoles[i].claims[j], intersectedRoles[i])
                    }
                }

                return claimsFromRoles
            },

            activeClaims () {
                let activeClaims = this.activeClaimsFromRoles.map(claim => {
                    return {
                        ...claim,
                        allow: null
                    }
                })

                for (let i=0; i<this.userClaims.length; i++) {
                    let index = _.findIndex(activeClaims, claim => claim.id === this.userClaims[i].id)

                    // If the user claim was already inherited from a role, set its override toggle
                    if (index >= 0) {
                        activeClaims[index].allow = this.userClaims[i].allow
                    // Otherwise, just add it directly
                    } else {
                        activeClaims.push(Object.assign({}, this.userClaims[i], { roles: [] }))
                    }
                }

                return _.sortBy(activeClaims, item => {
                    return item.description ? item.description : item.slug
                })
            },

            inactiveClaims () {
                return _.sortBy(_.differenceBy(this.allowedClaims, this.activeClaims, 'id'), item => {
                    return item.description ? item.description : item.slug
                })
            },

            // For presentation only
            groupedClaims () {
                let self = this

                let groupedClaims = [
                    {
                        id: null,
                        description: self.$i18n.t('authorization.general.ungrouped')
                    },
                    ..._.sortBy(self.allowedClaimGroups, 'description')
                ]

                return {
                    activeClaims: groupedClaims.map(group => {
                        let claims = self.activeClaims.filter(claim => claim.claimGroupId === group.id)

                        return Object.assign({}, group, {claims})
                    }),

                    inactiveClaims: groupedClaims.map(group => {
                        let claims = self.inactiveClaims.filter(claim => claim.claimGroupId === group.id)

                        return Object.assign({}, group, {claims})
                    })
                }
            },

            isUserRolesChanged () {
                return !!_.xorBy(this.userRoles, this.checkedRoles.map(id => {
                    return {id}
                }), 'id').length
            },

            isUserClaimsChanged () {
                let mapper = claim => {
                    return {
                        id: claim.id,
                        allow: claim.allow
                    }
                }

                let original = _.sortBy(this.originalData.userClaims, 'id').map(mapper)
                let current = _.sortBy(this.userClaims, 'id').map(mapper)

                return !_.isEqual(original, current)
            },

            hasUnsavedChanges () {
                return this.isUserRolesChanged || this.isUserClaimsChanged
            },

            isLoadingRoles () {
                return this.isLoading('fetching-roles') ||
                    this.isLoading('fetching-tenant-roles') ||
                    this.isLoading('fetching-user-roles')
            },

            isLoadingClaims () {
                return this.isLoadingRoles ||
                    this.isLoading('fetching-claims') ||
                    this.isLoading('fetching-user-claims') ||
                    this.isLoading('fetching-claim-groups')
            },

            isSettingsBusy () {
                return this.isLoading('fetching-tenants') || this.isLoading('saving-changes')
            },

            switchButtonTooltipOff () {
                return this.$i18n.t('users.authorization.off-dont-override-roles')
            },

            finalUserRoles () {
                let self = this

                return self.roles.filter(role => self.checkedRoles.indexOf(role.id) >= 0).map(role => {
                    return {
                        id: role.id
                    }
                })
            },

            finalUserClaims () {
                return this.userClaims.map(claim => {
                    return {
                        id: claim.id,
                        allow: claim.allow,
                        slug: claim.slug
                    }
                })
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            isLoading (key) {
                return this.loadings.indexOf(key) >= 0
            },

            fetchRoles () {
                this.loadingAdd('fetching-roles')

                let self = this

                return clientService.authorization.getRoles().then(response => {
                    self.roles = response.data.data
                    self.loadingRemove('fetching-roles')
                })
            },

            fetchClaims () {
                let self = this

                self.loadingAdd('fetching-claims')

                return clientService.authorization.getClaims().then(response => {
                    self.claims = response.data.data
                    self.loadingRemove('fetching-claims')
                })
            },

            fetchClaimGroups () {
                let self = this

                self.loadingAdd('fetching-claim-groups')

                return clientService.authorization.getClaimGroups().then(response => {
                    self.claimGroups = response.data.data

                    self.loadingRemove('fetching-claim-groups')
                })
            },

            fetchTenants () {
                let self = this

                self.loadingAdd('fetching-tenants')

                return tenantsService.getTenants(self.user.id).then(response => {
                    self.tenants = [
                        ...response.data.data,
                        {
                            system: 0,
                            id: 1,
                            description: 'Backoffice'
                        }
                    ]

                    self.loadingRemove('fetching-tenants')
                })
            },

            fetchTenantRoles () {
                if (!this.selectedTenant) {
                    return
                }

                this.loadingAdd('fetching-tenant-roles')

                let self = this

                return clientService.authorization.getTenantRoles(self.selectedTenant.id).then(response => {
                    self.tenantRoles = response.data.data
                    self.loadingRemove('fetching-tenant-roles')
                })
            },

            fetchUserRoles () {
                if (!this.selectedTenant) {
                    return
                }

                this.loadingAdd('fetching-user-roles')

                let self = this

                return usersService.authorization.getRoles(self.user.id, self.selectedTenant.id).then(response => {
                    self.userRoles = _.cloneDeep(response.data.data)
                    self.loadingRemove('fetching-user-roles')
                })
            },

            fetchUserClaims () {
                let self = this

                self.loadingAdd('fetching-user-claims')

                return usersService.authorization.getClaims(self.user.id, self.selectedTenant.id).then(response => {
                    self.originalData.userClaims = _.cloneDeep(response.data.data)
                    self.userClaims = _.cloneDeep(response.data.data)
                    self.loadingRemove('fetching-user-claims')
                })
            },

            selectBackOfficeTenant () {
                this.selectedTenant = _.find(this.tenants, {id: 1}) || null
            },

            selectFrontOfficeTenant () {
                if (!this.frontOfficeTenants.length) {
                    return
                }

                this.selectedTenant = this.frontOfficeTenants[0]
            },

            isActiveClaimAllowed (claim) {
                return claim.allow === null || claim.allow === true
            },

            activeClaimTooltip (claim) {
                if (!claim.roles.length) {
                    return ''
                }

                let rolesList = claim.roles.map(role => {
                    let spanClass = role.description ? '' : 'font-italic'
                    let spanText = role.description ? role.description : role.slug

                    return '<span class="' + spanClass + '">' + spanText + '</span>'
                }).join('<br>')

                return '<h4>' + this.$i18n.t('users.authorization.claim-obtained-from-these-roles') + '</h4>'
                    + rolesList
            },

            claimStateChanged (claim, state) {                
                let self = this

                let otherSlugs

                if (state === true) {
                    otherSlugs = authService.resolveClaimDependenciesRecursively(claim.slug)
                } else {
                    otherSlugs = authService.resolveDependableClaims(claim.slug)
                }

                let affectedSlugs = _.uniq([claim.slug, ...otherSlugs])

                for (let i = 0; i < affectedSlugs.length; i++) {
                    let associationIndex = _.findIndex(self.userClaims, item => item.slug === affectedSlugs[i])

                    if (state === null) { // Detach affected claims from the user
                        if (associationIndex >= 0) {
                            self.userClaims.splice(associationIndex, 1)
                        }
                    } else {
                        if (associationIndex >= 0) { // Already associated with the user
                            self.userClaims[associationIndex].allow = state
                        } else { // Not yet associated with the user
                            let newClaim = Object.assign({allow: state}, _.find(self.allowedClaims, item => item.slug === affectedSlugs[i]))

                            self.userClaims.push(newClaim)
                        }
                    }
                }
            },           

            saveChanges () {
                let self = this

                self.loadingAdd('saving-changes')

                return Promise.all([
                    usersService.authorization.saveRoles(self.user.id, self.selectedTenant.id, self.finalUserRoles),
                    usersService.authorization.saveClaims(self.user.id, self.selectedTenant.id, self.finalUserClaims)
                ]).then(() => {
                    return Promise.all([
                        self.fetchUserRoles(),
                        self.fetchUserClaims()
                    ])
                }).then(() => {
                    toastrService.success(self.$i18n.t('general.success'), self.$i18n.t('actions.all-changes-have-been-saved'))
                    self.loadingRemove('saving-changes')
                })
            },

            discardChanges () {
                if (!this.hasUnsavedChanges) {
                    return
                }

                this.checkedRoles = this.userRoles.map(role => role.id)
                this.userClaims = _.cloneDeep(this.originalData.userClaims)
            }
        },

        watch: {
            tenants (tenants) {
                if (tenants.length === 1) {
                    this.selectedTenant = tenants[0]
                }
            },

            selectedTenant () {
                if (!this.selectedTenant) {
                    this.tenantRoles = []
                    this.userRoles = []
                    this.originalData.userClaims = []
                    this.userClaims = []
                    return
                }

                this.fetchTenantRoles()
                this.fetchUserRoles()
                this.fetchUserClaims()
            },

            userRoles () {
                this.checkedRoles = this.userRoles.map(role => role.id)
            }
        },

        created () {
            let self = this

            self.fetchTenants().then(() => {
                return Promise.all([
                    self.fetchRoles(),
                    self.fetchClaims(),
                    self.fetchClaimGroups()
                ])
            }).then(() => {
                if (self.frontOfficeTenants.length) {
                    self.selectFrontOfficeTenant()
                } else {
                    self.selectBackOfficeTenant()
                }
            })
        }
    }
</script>

<style>
    .users-authorization .claim-list>.list-group-item .switch-button {
        margin-top: -7px;
    }

    .users-authorization .claim-list>.list-group-item.status-group-header {
        border-bottom-width: 2px;
    }

    .users-authorization .claim-list>.list-group-item.status-group-header.active-group {
        background: rgba(28, 132, 198, 0.1);
    }

    .users-authorization .claim-list>.list-group-item.status-group-header.inactive-group {
        background: rgba(248, 172, 89, 0.1);
    }

    .users-authorization .claim-list>.list-group-item.status-group-header .title {
        font-weight: 600;
        text-transform: uppercase;
    }

    .users-authorization .claim-list>.list-group-item.claim-group-header {
            text-transform: uppercase;
            font-size: 11px;
            font-weight: 600;
            padding-left: 17px;
    }

    .users-authorization .toolbar-columns>div {
        height: 34px;
    }
</style>