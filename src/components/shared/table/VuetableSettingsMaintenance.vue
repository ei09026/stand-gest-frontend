<template>
    <modal
        :show="show"
        :title="title"
        :large="true"
        :footer="true"
        :ok-text="$i18n.t('actions.save')"
        @ok="save"
        @cancel="cancel"
        @close="close">
        <loading
            v-show="loadingUxtableFields"></loading>

        <template
            v-if="!loadingUxtableFields">
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <loading
                            v-show="loadingUxtableFields"></loading>

                        <div
                            v-if="!uxTableFields.length"
                            class="alert alert-info m-t text-center">
                            Não existem colunas
                        </div>

                        <div class="list-group claim-list"
                            v-if="!loadingUxtableFields">
                            <draggable v-model="uxTableFields" class="dragArea" @update="onUpdate">
                                <div class="list-group-item"
                                    :class="{'draggable': uxTableField.draggable, 'non-draggable': !uxTableField.draggable}"
                                    :key="uxTableField.id"
                                    v-for="uxTableField in uxTableFields">
                                    <div class="row">
                                        <div class="col-xs-6"
                                            v-text="uxTableField.title"></div>

                                        <div class="col-xs-2">
                                            <check-item
                                                v-model="uxTableField.visible"
                                                :disabled="uxTableField.locked">
                                                Visível
                                            </check-item>
                                        </div>

                                        <div class="col-xs-2">
                                            <!-- <check-item
                                                v-model="uxTableField.draggable"
                                                :disabled="true">
                                                Arrastável
                                            </check-item> -->

                                            <i v-if="uxTableField.draggable" class="fa fa-arrows-alt"></i>

                                        </div>

                                        <div v-if="uxTableField.locked" class="col-xs-2">
                                            <span class="label label-danger">Bloqueado</span>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
    import uxTableFieldsService from '@/services/shared/uxTableFields.service'
    import {mapGetters, mapActions} from 'vuex'
    import Loading from '@/components/shared/Loading'
    import Modal from '@/components/shared/Modal'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import draggable from 'vuedraggable'
    import _ from 'lodash'

    export default {
        components: {
            Loading,
            Modal,
            CheckItem,
            draggable
        },

        props: {
            tableSlug: {
                type: String,
                required: true
            },

            show: {
                type: Boolean,
                required: true
            }
        },

        data () {
            return {
                title: 'Configuração',

                uxTableFields: [],

                options: {
                    draggable: '.item'
                },

                nonDraggableFields: []
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            loadingUxtableFields () {
                return this.loadings.indexOf('fetching-ux-table-fields') >= 0
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            fetchUxTableFields () {
                var self = this

                if (!self.tableSlug) {
                    return
                }

                self.loadingAdd('fetching-ux-table-fields')

                let parameters = {
                    filter: {
                        slug: self.tableSlug,
                        type: 'user'
                    }
                }

                uxTableFieldsService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.uxTableFields = response

                        self.nonDraggableFields = []

                        _.each(self.uxTableFields, (field, index) => {
                            if (!field.draggable) {
                                field.rank = index
                                self.nonDraggableFields.push(field)
                            }
                        })

                        self.loadingRemove('fetching-ux-table-fields')
                    }
                }).catch((response) => {
                    if (response.status) {
                        // ERRO
                    }
                })
            },

            save () {
                let self = this

                self.loadingAdd('saving-changes')

                let parameters = {
                    filter: {
                        type: 'user'
                    },

                    data: this.uxTableFields
                }

                uxTableFieldsService.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.fetchUxTableFields()
                        self.$emit('saved', this.uxTableFields)
                        self.loadingRemove('saving-changes')
                    }
                }).catch((response) => {
                    if (response.status) {
                        // ERRO
                    }
                })
            },

            cancel () {
                this.$emit('canceled')
            },

            close () {
                this.$emit('close')
            },

            onUpdate () {
                var cleanFields = _.remove(this.uxTableFields, (field) => {
                    return field.draggable
                })

                _.each(this.nonDraggableFields, (field) => {
                    cleanFields.splice(field.rank, 0, field)
                })

                this.uxTableFields = cleanFields
            }
        },

        created () {
            this.fetchUxTableFields()
        }
    }
</script>
<style>
    .draggable {
        cursor: move;
    }

    .non-draggable {
        background-color: rgba(209, 218, 222, 0.38);
        cursor: auto;
    }

    .fa-arrows-alt {
        color: #c4c4c4
    }
</style>
