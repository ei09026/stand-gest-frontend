<template>
    <div class="row users-tenants">
        <div class="col-lg-8 col-lg-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <button class="btn btn-success btn-circle btn-outline m-t-n-xs m-l-sm pull-right"
                        :class="{'disabled': (newRelation || !unrelatedTenants.length)}"
                        v-tooltip="{title: newRelationTooltip}"
                        @click="openNewRelation">

                        <i class="fa fa-plus"></i>
                    </button>

                    {{ $i18n.tc('users.tenants.related-tenants', 2) }}

                    <!--<check-all-items
                        v-model="checkedTenantRelations"
                        :original-set="tenants.map(tenant => tenant.id)">
                        {{ $tc('users.tenants.related-tenants', 2) }}
                    </check-all-items>-->
                </div>

                <loading
                    v-show="isLoadingTenants || isSavingRelations"></loading>

                <div class="list-group"
                    v-if="!isLoadingTenants && !isSavingRelations">

                    <div class="list-group-item flex new-relation"
                        v-if="newRelation">

                        <div class="flex flex-column new-relation-tenant">
                            <label class="m-b-none m-r-sm">
                                {{ $i18n.tc('tenants.general.tenant', 1) }}
                            </label>

                            <multiselect
                                v-model="newRelation.tenant"
                                :options="unrelatedTenants"
                                :searchable="true"
                                :close-on-select="true"
                                :placeholder="$i18n.tc('tenants.general.tenant', 1)"
                                :no-results-label="$i18n.t('general.no-results')"
                                :disabled="isLoadingCashDesks"
                                label="description"
                                track-by="id"></multiselect>
                        </div>

                        <div class="flex flex-column flex-justify-end m-l-md new-relation-cash-desk">
                            <template
                                v-if="isLoadingCashDesks">

                                <loading
                                    :height="40"></loading>
                            </template>

                            <template
                                v-if="!isLoadingCashDesks">

                                <label class="m-b-none m-r-sm">
                                    {{ $i18n.tc('cash-desks.general.cash-desk', 1) }}
                                </label>

                                <multiselect
                                    v-model="newRelation.cashDesk"
                                    :options="newRelation.cashDesks"
                                    :searchable="true"
                                    :close-on-select="true"
                                    :placeholder="$i18n.tc('cash-desks.general.cash-desk', 1)"
                                    :no-results-label="$i18n.t('general.no-results')"
                                    :disabled="!newRelation.cashDesks.length || isLoadingCashDesks"
                                    track-by="id"></multiselect>
                            </template>
                        </div>

                        <div class="flex flex-column flex-justify-end m-l-md new-relation-button">
                            <button class="btn btn-success btn-circle btn-outline"
                                :class="{'disabled': !isValidNewRelation}"
                                v-tooltip="{title: (isValidNewRelation ? $i18n.t('actions.save') : $i18n.t('validation.fill-all-fields'))}"
                                @click="saveNewRelation">

                                <i class="fa fa-save"></i>
                            </button>
                        </div>

                        <div class="flex flex-column flex-justify-end m-l-sm new-relation-button">
                            <button class="btn btn-danger btn-circle btn-outline"
                                v-tooltip="{title: $i18n.t('actions.cancel')}"
                                @click="closeNewRelation">

                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="list-group-item"
                        v-for="relation in orderedTenantRelations">

                        <div class="row">
                            <div class="col-xs-4"
                                v-text="relation.description"></div>

                            <div class="col-xs-3"
                                v-text="relation.metadata.AgentId"></div>

                            <div class="col-xs-3"
                                v-text="relation.metadata.CashDeskId"></div>

                            <div class="col-xs-2 text-right" style="height: 18px">
                                <button class="btn btn-danger btn-circle btn-outline m-t-n-xs m-l-sm"
                                    v-tooltip="{title: $i18n.t('actions.delete')}"
                                    @click="removeRelation(relation)">

                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="list-group-item text-muted font-italic"
                        v-if="!orderedTenantRelations.length"
                        v-text="$i18n.t('general.no-results')"></div>

                    <!--<check-item
                        v-for="relation in tenantRelations"
                        :key="relation.id"
                        v-model="checkedTenantRelations"
                        :val="relation.id"
                        :item-class="['list-group-item']"
                        :checkbox-container-class="['col-xs-1']">
                        <div class="row">
                            <div class="col-xs-3"
                                v-text="relation.description"></div>
                            <div class="col-xs-3">00000012312</div>
                            <div class="col-xs-3">003</div>
                            <div class="col-xs-2 text-right" style="height: 18px">
                                <button class="btn btn-danger btn-circle btn-outline m-t-n-xs m-l-sm"
                                    v-tooltip="{title: $t('actions.delete')}">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </check-item>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    // import toastrService from '@/services/shared/toastr.service'
    // import clientService from '@/services/client/client.service'
    import tenantsService from '@/services/tenants/tenants.service'
    import usersService from '@/services/users/users.service'
    // import cashDesksCatalogService from '@/services/catalogs/cash-desks.service'
    import {mapGetters, mapActions} from 'vuex'
    import tooltip from '@/directives/tooltip'
    import Toolbar from '@/components/shared/Toolbar'
    import Loading from '@/components/shared/Loading'
    import Multiselect from '@/components/shared/multi-select'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import CheckAllItems from '@/components/shared/check-items/CheckAllItems'
    import SwitchButton from '@/components/shared/input/SwitchButton'

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
            SwitchButton
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
                userTenants: [],

                tenantRelations: [],
                checkedTenantRelations: [],

                newRelation: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            isLoadingTenants () {
                return this.loadings.indexOf('user-tenants-fetching-tenants') >= 0 ||
                    this.loadings.indexOf('user-tenants-fetching-tenant-relations') >= 0
            },

            isLoadingCashDesks () {
                return this.loadings.indexOf('user-tenants-fetching-cash-desks') >= 0
            },

            isSavingRelations () {
                return this.loadings.indexOf('user-tenants-saving-new-relation') >= 0 ||
                    this.loadings.indexOf('user-tenants-removing-relation') >= 0
            },

            orderedTenantRelations () {
                return _.sortBy(this.tenantRelations, 'description')
            },

            unrelatedTenants () {
                return _.differenceBy(this.tenants, this.tenantRelations, 'id')
            },

            isValidNewRelation () {
                return this.newRelation &&
                    this.newRelation.tenant
                    //&& this.newRelation.cashDesk
            },

            newRelationTooltip () {
                return this.unrelatedTenants.length
                    ? this.$i18n.t('actions.add')
                    : this.$i18n.t('users.tenants.no-available-tenants')
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

            fetchTenants () {
                let self = this

                self.loadingAdd('user-tenants-fetching-tenants')

                return tenantsService.getAllTenants().then(response => {
                    let tenants = _.cloneDeep(response.data.data.Tenants)

                    for (let i = 0; i < tenants.length; i++) {
                        tenants[i].metadata = JSON.parse(tenants[i].metadata)
                    }

                    self.tenants = tenants

                    self.loadingRemove('user-tenants-fetching-tenants')
                })
            },

            fetchUserTenantMetadata (tenantId) {
                return usersService.getTenantMetadata(this.user.id, tenantId)
            },

            fetchTenantRelations () {
                let self = this

                self.loadingAdd('user-tenants-fetching-tenant-relations')

                return tenantsService.getTenants(self.user.id).then(response => {
                    self.tenantRelations = Object.assign(_.cloneDeep(response.data.data), {metadata: {}})
                }).then(() => {
                    let fetchMetadatas = []

                    for (let i = 0; i < self.tenantRelations.length; i++) {
                        fetchMetadatas.push(self.fetchUserTenantMetadata(self.tenantRelations[i].id))
                    }

                    return Promise.all(fetchMetadatas)
                }).then(responses => {
                    for (let i = 0; i < self.tenantRelations.length; i++) {
                        let metadata = responses[i].data.data
                            ? JSON.parse(responses[i].data.data)
                            : null

                        self.tenantRelations[i].metadata = metadata
                    }

                    self.loadingRemove('user-tenants-fetching-tenant-relations')
                })
            },

            // fetchCashDesks (erpTenantId) {
            //     return new Promise((resolve, reject) => {
            //         cashDesksCatalogService.getCashDesks(erpTenantId).then(response => {
            //             let cashDesks = response.data.data

            //             let filter = {
            //                 fields: ['CashDeskId'],
            //                 filter: [
            //                     {
            //                         path: 'AgentId',
            //                         condition: '=',
            //                         value: erpTenantId
            //                     }
            //                 ]
            //             }

            //             usersService.queryTenantMedatada(filter).then(response => {
            //                 let assignedCashDesks = _.uniqWith(response.data.data, _.isEqual)

            //                 let availableCashDesks = cashDesks.cashDeskId.filter(item => assignedCashDesks.indexOf(item) === -1)

            //                 resolve(availableCashDesks)
            //             })
            //         }).catch((response) => {
            //             if (response.status) {
            //                 reject(response)
            //             }
            //         })
            //     })
            // },

            openNewRelation () {
                if (this.newRelation || !this.unrelatedTenants.length) {
                    return
                }

                this.newRelation = {
                    tenant: null,
                    cashDesks: [],
                    cashDesk: null
                }
            },

            getNewRelationErpTenantId () {
                try {
                    return this.newRelation.tenant.metadata.integration.erp.tenantId
                } catch (e) {
                    return null
                }
            },

            newRelationTenantChanged () {
                if (!this.newRelation) {
                    return
                }

                this.newRelation.cashDesk = null

                this.newRelation.cashDesks = []

                if (!this.newRelation.tenant) {
                    return
                }

                let erpTenantId = this.getNewRelationErpTenantId()

                if (!erpTenantId) {
                    this.newRelation.cashDesks = []

                    return
                }

                let self = this

                self.loadingAdd('user-tenants-fetching-cash-desks')

                // self.fetchCashDesks(erpTenantId).then(response => {
                //     self.newRelation.cashDesks = response
                // })
                // .catch(ex => {})
                // .then(() => {
                //     self.loadingRemove('user-tenants-fetching-cash-desks')
                // })
            },

            closeNewRelation () {
                this.newRelation = null
            },

            saveNewRelation () {
                if (!this.isValidNewRelation) {
                    return
                }

                let erpTenantId = this.getNewRelationErpTenantId()

                if (!erpTenantId) {
                    return
                }

                let metadata = {
                    AgentId: erpTenantId
                    //CashDeskId: this.newRelation.cashDesk
                }

                if (this.newRelation.cashDesk) {
                    Object.assign(metadata, {CashDeskId: this.newRelation.cashDesk})
                }

                let self = this

                self.loadingAdd('user-tenants-saving-new-relation')

                usersService.addUserToTenant(this.user.id, this.newRelation.tenant.id, metadata).then(() => {
                    self.closeNewRelation()

                    self.loadingRemove('user-tenants-saving-new-relation')
                }).then(() => {
                    self.fetchTenantRelations()
                })
            },

            removeRelation (relation) {
                let self = this

                self.loadingAdd('user-tenants-removing-relation')

                usersService.removeUserFromTenant(this.user.id, relation.id).then(() => {
                    self.loadingRemove('user-tenants-removing-relation')
                }).then(self.fetchTenantRelations)
            }
        },

        watch: {
            'newRelation.tenant' () {
                this.newRelationTenantChanged()
            },
            'unrelatedTenants' () {
                if (!this.tenantRelations.length && this.unrelatedTenants.length) {
                    this.openNewRelation()
                }
            }
        },

        created () {
            this.fetchTenants()

            this.fetchTenantRelations()
        }
    }
</script>

<style>
    .users-tenants .new-relation {
        background-color: #fafafa;
    }

    .users-tenants .new-relation-tenant {
        flex-grow: 2;
    }

    .users-tenants .new-relation-cash-desk {
        flex-grow: 1;
    }

    .users-tenants .new-relation-button {
        margin-bottom: 2px;
    }
</style>
