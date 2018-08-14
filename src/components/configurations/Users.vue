<template>
    <div class="checklists">
         <page-header
            :active-title="title"></page-header>

        <idt-table
            use-ordering
            clickable-rows
            use-filter
            use-search
            search-debounce
            :table-min-height="tableMinHeight"
            :columns="columns"
            column-key="name"
            column-label="title"
            :rows="users"
            row-key="id"
            :search="filter.name"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingUsers"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openUserManagement"
            @filter="fetchUsers"
            @filter-clear="clearFilter"
            @refresh="fetchUsers"
            @page-changed="pageChanged">

            <template slot="filter">
                <div class="row">
                    <div class="col-lg-4 m-b-sm">
                        <label>Nome</label>

                        <div>
                            <input class="form-control"
                                v-model="filter.name"
                                placeholder="Nome">
                        </div>
                    </div>

                    <div class="col-lg-4 m-b-sm">
                        <label>Email</label>

                        <div>
                            <input class="form-control"
                                v-model="filter.email"
                                placeholder="Email">
                        </div>
                    </div>

                    <div class="col-lg-4 m-b-sm">
                        <label>Utilizador</label>

                        <div>
                            <input class="form-control"
                                v-model="filter.username"
                                placeholder="Utilizador">
                        </div>
                    </div>
                </div>
                
                <div class="row m-t-sm">
                    <div class="col-lg-4">
                        <label>{{$i18n.tc('general.active', 2)}}</label>

                        <div>
                            <div class="btn-group">
                                <radio-item
                                    button
                                    :val="null"
                                    v-model="filter.active">

                                    {{ $i18n.t('general.all') }}
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="true"
                                    v-model="filter.active">

                                    <i class="fas fa-check"></i>

                                    {{ $i18n.tc('general.active', 2) }}
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="false"
                                    v-model="filter.active">

                                    <i class="fas fa-ban"></i>

                                    {{ $i18n.tc('general.inactive', 2) }}
                                </radio-item>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template
                slot="cell"
                slot-scope="props">

                <i class="fa"
                    v-if="props.column.name === 'deleted_at'"
                    :class="{
                        'fa-check text-success': !props.cell,
                        'fa-ban text-danger': props.cell
                    }"></i>

                <img v-else-if="props.column.name === 'picture'" 
                    alt="image" 
                    class="img-circle img-width"  
                    :src="pictureSource(props)"></img>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>
        </idt-table>

        <modal xl
            :show="showUserManagementModal"
            :title="userManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isUserManagementValid"
            @ok="save"
            @close="closeUserManagement">

            <template
                v-if="userDto">

                <div class="row">
                    <div v-if="!userDto.picture" class="col-lg-6">
                        <div class="form-group">
                            <label>Foto</label>

                             <input type="file" 
                                class="hidden-input"
                                ref="uploadPicture"
                                @change="uploadPicture" />                          
                        </div>
                    </div>

                    <div v-if="userDto.picture" class="col-lg-6">
                        <div class="col-lg-2">
                            <img :src="userDto.picture" class="img-circle img-width-md"></img>
                        </div>
                        <div class="col-lg-10">
                            <div class="form-group">
                                <label>Foto</label>

                                <input type="file" 
                                    class="hidden-input"
                                    ref="uploadPicture"
                                    @change="uploadPicture" />                          
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Nome</label>

                            <input class="form-control"
                                v-model="userDto.name"
                                placeholder="Nome">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Email</label>

                            <input class="form-control"
                                v-model="userDto.email"
                                placeholder="Email">
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Utilizador</label>

                            <input class="form-control"
                                v-model="userDto.username"
                                placeholder="Utilizador">
                        </div>
                    </div>                                       
                </div>

                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Password</label>

                            <input class="form-control"
                                type="password"
                                v-model="userDto.password"
                                placeholder="Password">
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Confirmação password</label>

                             <input class="form-control"
                                type="password"
                                v-model="userDto.passwordConfirmation"
                                placeholder="Confirmação password">                         
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-1 col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="userDto.active">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openUserManagement()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import requestService from '@/services/shared/request.service'
    import toastrService from '@/services/shared/toastr.service'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import RadioItem from '@/components/shared/input/RadioItem'
    import Multiselect from '@/components/shared/multi-select'
    import usersService from '@/services/users/users.service'
    import PageHeader from '@/components/layout/PageHeader'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Modal from '@/components/shared/Modal'
    import tooltip from '@/directives/tooltip'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            ButtonBar,
            Modal,
            IdtTable,
            CheckItem,
            Multiselect,
            RadioItem
        },

        data () {
            return {
                title: 'Utilizadores',

                users: [],

                filter: {
                    name: '',
                    email: '',
                    username: '',
                    active: null
                },

                pagination: {
                    itemsPerPage: 10,
                    page: 1,
                    totalItems: 0
                },

                orderBy: {
                    column: 'name',
                    direction: 'asc'
                },

                columns: [
                    {
                        name: 'picture',
                        title: '',
                        useOrdering: false
                    },
                    {
                        name: 'name',
                        title: 'Nome'
                    },
                    {
                        name: 'email',
                        title: 'Email'
                    },
                    {
                        name: 'username',
                        title: 'Utilizador'
                    },
                    {
                        name: 'deleted_at',
                        title: 'Activo'
                    }
                ],

                showUserManagementModal: false,

                userDto: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingUsers () {
                return this.loadings.indexOf('configurations-fetching-users') >= 0
            },

            hasFilteredResults () {
                return !!(this.filter.name || this.filter.email !== null || this.filter.username !== null || this.filter.active !== null)
            },

            searchPlaceholder () {
                let placeholder = [
                    'Nome'
                ].join(', ')

                return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).toLowerCase()
            },

            isUserManagementValid () {
                return !!(this.userDto &&
                    this.userDto.name &&
                    this.userDto.email &&
                    this.userDto.username && 
                    this.userDto.password && 
                    this.userDto.passwordConfirmation) || 
                    (this.userDto && (this.userDto.password !== 
                    this.userDto.passwordConfirmation))
            },

            userManagementModalTitle () {
                if (!this.userDto) {
                    return null
                }

                return this.userDto.id
                    ? 'Editar utilizador'
                    : 'Novo utilizador'
            },

            tableMinHeight () {
                return this.pageContentSize.height - 455
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            pageChanged (page) {
                this.pagination.page = page
                this.fetchUsers();
            },

            fetchUsers () {
                let self = this

                self.loadingAdd('configurations-fetching-users')

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy,
                    method: 'retrieve'
                }

                return usersService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.users = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-users')
                }).catch(exception => {
                    throw exception
                })
            },

            uploadPicture () {
                var self = this
                
                let files = self.$refs.uploadPicture.files

                if (!files.length) {
                    return
                }

                if (files[0].type !== 'image/png' && files[0].type !== 'image/jpg' && files[0].type !== 'image/jpeg') {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        'O ficheiro deve estar em formato PNG ou JPEG.',
                        {positionClass: 'login-toast-top-right'})

                    return
                }

                if(files[0].size / (1024 * 1024) > 4) {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        'O ficheiro deverá ter menos de 4mb.',
                        {positionClass: 'login-toast-top-right'})

                    return
                }

                // Get base64
                let reader = new FileReader()

                reader.readAsDataURL(files[0])

                reader.onload = () => {                    
                    self.userDto.picture = reader.result
                }
            },

            pictureSource (user) {
                return user.row.picture
            },

            search (value) {
                this.filter.name = value

                this.fetchUsers()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchUsers()
            },

            clearFilter () {
                this.filter.name = ''

                this.fetchUsers()
            },

            openUserManagement (user) {
                let userDto = {
                    id: null,
                    name: '',
                    email: '',
                    username: '',
                    picture: '',
                    active: true,
                    password: '',
                    passwordConfirmation: ''
                }

                // Edit
                if (user) {
                    Object.assign(userDto, user)

                    userDto.passwordConfirmation = userDto.password

                    if (user.deleted_at) {
                        userDto.active = false
                    }
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                } else {
                }

                this.userDto = userDto
                this.showUserManagementModal = true
            },

            closeUserManagement () {
                this.showUserManagementModal = false
                this.userDto = null
                this.newItem = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-user')

                let parameters = {}
                let request = null
                
                if (self.userDto.id) { // Edit
                    parameters = {
                        data: {
                            name: self.userDto.name,
                            email: self.userDto.email,
                            username: self.userDto.username,
                            picture: self.userDto.picture,
                            active: self.userDto.active,
                            password: self.userDto.password,
                            passwordConfirmation: self.userDto.passwordConfirmation
                        },
                        filter: {
                            id: self.userDto.id
                        },
                        method: 'update'
                    }

                    request = usersService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            name: self.userDto.name,
                            email: self.userDto.email,
                            username: self.userDto.username,
                            picture: self.userDto.picture,
                            active: self.userDto.active,
                            password: self.userDto.password,
                            passwordConfirmation: self.userDto.passwordConfirmation
                        },
                        method: 'create'
                    }

                    request = usersService.create(parameters)
                };

                return request.then(response => {
                    debugger;
                    if (response.data.status === 'success') {
                        toastrService.success(
                            self.$i18n.t('general.success'),
                            self.$i18n.t('general.success-save'),
                            {positionClass: 'login-toast-top-right'}
                        )

                        self.fetchUsers()
                    } else {
                        //TODO
                        toastrService.error(
                        self.$i18n.t('general.error'),
                        response.data.error.message[0],
                        {positionClass: 'login-toast-top-right'})
                    }

                    self.loadingRemove('configurations-saving-user')
                }).catch((error) => {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        self.$i18n.t('general.error'),
                        {positionClass: 'login-toast-top-right'})
                }).finally(() => {
                    self.closeUserManagement()
                    self.loadingRemove('configurations-saving-user')
                })
            }
        },

        watch: {
            'filter.active' () {
                this.fetchUsers()
            }
        },

        created () {
            this.fetchUsers()
        }
    }

</script>

<style>
    .editing {
        background-color: ghostwhite !important;
    }

    .img-width {
        width: 28px;
        height: 28px;
    }

    .img-width-md {
        width: 65px;
        height: 65px;
    }
</style>
