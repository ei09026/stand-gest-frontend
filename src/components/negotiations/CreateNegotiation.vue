<template>
    <div class="checklists">
         <page-header
            :active-title="title"
            :breadcrumbs="breadcrumbs"></page-header>

        <div class="row">
            <div class="col-md-8">

                <div class="ibox">
                    <div class="ibox-title">
                        <span class="pull-right">(<strong>1</strong>) item</span>
                        <h5>Veículo</h5>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-lg-4 m-b-sm">
                                <label>Matrícula (AA-AA-AA)</label>

                                <div>
                                    <the-mask v-model="vehicle.plate" class="plate" mask="FF-FF-FF" :tokens="hexTokens" />

                                     <div class="btn-group m-l-sm">
                                        <button class="btn btn-circle btn-default m-r-md">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:none;" class="table-responsive">
                            <table class="table shoping-cart-table">
                                <tbody>
                                    <tr>
                                        <td width="20%">
                                            <img class="img-style"
                                                :src="vehicle.picture"
                                                lazy="loaded"
                                                style="height: 100px; width: 100px;">
                                        </td>

                                        <td width="40%" class="desc">
                                            <h3>
                                            <a href="#" class="text-navy">
                                                {{ vehicle.plate }}
                                            </a>
                                            </h3>
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <dl class="small m-b-none">
                                                        <dt>Marca</dt>
                                                        <dd>{{ vehicle.brand.description }}</dd>
                                                    </dl>
                                                </div>
                                                <div class="col-lg-4">
                                                    <dl class="small m-b-none">
                                                        <dt>Modelo</dt>
                                                        <dd>{{ vehicle.brand.model.description }}</dd>
                                                    </dl>
                                                </div>
                                                <div class="col-lg-4">
                                                    <dl class="small m-b-none">
                                                        <dt>Mês/Ano</dt>
                                                        <dd>{{ vehicle.month }}/{{ vehicle.year }} </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                            <div class="row m-t-sm">
                                                <div class="col-lg-4">
                                                    <dl class="small m-b-none">
                                                        <dt>Combustível</dt>
                                                        <dd>{{ vehicle.fuel.description }}</dd>
                                                    </dl>
                                                </div>
                                                <div class="col-lg-4">
                                                    <dl class="small m-b-none">
                                                        <dt>Cor</dt>
                                                        <dd>{{ vehicle.color.description }}</dd>
                                                    </dl>
                                                </div>
                                            </div>

                                            <div class="m-t-md">
                                                <a href="#" class="text-muted"><i class="fa fa-car"></i> Adicionar retoma</a>
                                                |
                                                <a href="#" class="text-muted"><i class="fa fa-trash"></i> Remover veículo</a>
                                            </div>
                                        </td>

                                        <td width="25%">
                                            <div class="row">

                                                <div class="col-lg-12 m-t-md">
                                                    <dl class="small m-b-prices">
                                                        <dt>Preço venda</dt>
                                                        <dd>
                                                            <span class="small" :class="{ 'line-through': hasDiscount(vehicle) }">
                                                                <currency
                                                                    :value="vehicle.sale_price"
                                                                    symbol="€">
                                                                </currency>
                                                            </span>
                                                        </dd>
                                                    </dl>
                                                </div>

                                                <div class="col-lg-12">
                                                    <dl class="small m-b-none">
                                                        <dt>Desconto</dt>
                                                        <dd>
                                                            <div class="row">
                                                                <div class="col-lg-12">
                                                                    <money v-model="vehicle.discount" class="align-text-right" v-bind="money"></money>
                                                                </div>
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </td>

                                        <td width="15%">
                                            <h4 class="total-margin">
                                                {{ calculateTotal(vehicle) }}
                                            </h4>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            <div class="col-md-4">               
                <div class="ibox">
                    <div class="ibox-title">
                        <h5>Cliente</h5>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-lg-12 m-b-sm">
                                <label>NIF</label>

                                <div>
                                    <the-mask class="plate" mask="FFF FFF FFF" :tokens="hexTokens" />
                                    <div class="btn-group m-l-sm">
                                        <button class="btn btn-circle btn-default m-r-md">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:none">
                            <h2 class="font-bold">
                                Nelson Matos
                            </h2>
                            <hr/>
                            <div class="row">
                                <div class="col-lg-6">
                                    <dl class="small m-b-none">
                                        <dt>NIF</dt>
                                        <dd>218165820</dd>
                                    </dl>
                                </div>
                                <div class="col-lg-6">
                                    <dl class="small m-b-none">
                                        <dt>Documento identificação</dt>
                                        <dd>123456789</dd>
                                    </dl>
                                </div>
                            </div>
                            <div class="row m-t-sm">
                                <div class="col-lg-6">
                                    <dl class="small m-b-none">
                                        <dt>Telemóvel</dt>
                                        <dd>968906700</dd>
                                    </dl>
                                </div>
                                <div class="col-lg-6">
                                    <dl class="small m-b-none">
                                        <dt>Email</dt>
                                        <dd>nelson-matos@hotmail.com</dd>
                                    </dl>
                                </div>
                            </div>
                            <div class="row m-t-sm">
                                <div class="col-lg-12">
                                    <dl class="small m-b-none">
                                        <dt>Morada</dt>
                                        <dd>Cortegaça - Subportela, 4905-631, Viana do Castelo</dd>
                                    </dl>
                                </div>
                            </div>

                            <hr>

                            <div class="activity-log">
                                <div class="full-height-scroll">
                                    <strong>
                                        Último negócios
                                    </strong>
                                    <div id="vertical-timeline" class="vertical-container dark-timeline">
                                        <div class="vertical-timeline-block">
                                            <div class="vertical-timeline-icon gray-bg">
                                                <i class="fa fa-briefcase"></i>
                                            </div>
                                            <div class="vertical-timeline-content">
                                                <p>
                                                    Citroen C3 - VTR
                                                </p>
                                                <small class="pull-right">
                                                    <b>
                                                        43-BQ-55
                                                    </b>
                                                </small>
                                                <span class="vertical-date small text-muted">
                                                    17-08-2018
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="ibox" id="billing-pay">
            <div class="ibox-content flex">
                <div class="flex billing-pay-block">
                    <template>
                        <span class="text-uppercase">Preço venda</span>
                        <h1 class="small-2">
                            <currency
                                value=5000
                                symbol="€"></currency>
                        </h1>
                    </template>
                </div>

                <div class="flex billing-pay-block">
                    <template>
                        <span class="text-uppercase">Desconto</span>
                        <h1 class="small-2">
                            <currency
                                value=100
                                symbol="€"></currency>
                        </h1>
                    </template>
                </div>

                <div class="flex billing-pay-block">
                    <template>
                        <span class="text-uppercase">Total</span>
                        <h1 class="small-2">
                            <currency
                                value=100
                                symbol="€"></currency>
                        </h1>
                    </template>
                </div>

                <div class="flex">
                    <div class="btn-group">
                        <button class="btn btn-circle btn-default m-r-md">
                            <i class="fa fa-hand-holding-usd"></i>
                        </button>
                    </div>
                     <div class="btn-group">
                        <button type="button" class="btn btn-primary pull-right">
                            <i class="fa fa-shopping-cart m-r-sm"></i>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import _ from 'lodash'
    import sessionsServices from '@/services/sessions/session.service'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import requestService from '@/services/shared/request.service'
    import toastrService from '@/services/shared/toastr.service'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import RadioItem from '@/components/shared/input/RadioItem'
    import Multiselect from '@/components/shared/multi-select'
    import vehicleService from '@/services/vehicles/vehicle.service'
    import brandService from '@/services/brands/brand.service'
    import PageHeader from '@/components/layout/PageHeader'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Modal from '@/components/shared/Modal'
    import tooltip from '@/directives/tooltip'
    import {mapGetters, mapActions} from 'vuex'
    import TabPanel from '@/components/shared/TabPanel'
    import Currency from '@/components/shared/Currency'
    import currencyService from '@/services/shared/currency.service'
    import {Money} from 'v-money'
    import {TheMask} from 'vue-the-mask'

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
            RadioItem,
            TheMask,
            TabPanel,
            Currency,
            Money
        },

        data () {
            return {
                title: 'Criar negócio',

                breadcrumbs: [
                    {
                        url: '/negotiations',
                        title:  'Negócios'
                    }
                ],

                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: ' €',
                    precision: 2,
                    masked: false
                },

                hexTokens: {
                    F: {
                        pattern: /[0-9a-zA-Z]/,
                        transform: v => v.toLocaleUpperCase()
                    }
                },

                plate: null,

                vehicle: {
                        id: 1,
                        plate: null,
                        brand: {
                            id: 1,
                            description: 'Citroen',
                            model: {
                                id: 1,
                                description: 'C4'
                            }
                        },
                        picture: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        month: '06',
                        year: '2006',
                        fuel: {
                            id: 1,
                            description: 'Gasóleo'
                        },
                        color: {
                            id: 1,
                            description: 'Cinzento'
                        },
                        sale_price: 6001,
                        discount: 0
                },

                client: {
                    id: 1,
                    name: 'Nelson Matos',
                    tin: '218165810',
                    identificationNumber: '123456789',
                    mobileNumber: '968906700',
                    email: 'nelson-matos@hotmail.com',
                    address: 'Cortegaça - Subportela',
                    postalCode: '4905-631',
                    district: 'Viana do Castelo'
                }
            }
        },

        computed: {
            ...mapGetters([
                'pageContentSize',
                'loadings',
                'pageContentSize'
            ]),

            currentAccountListHeight () {
                return this.availableContentSize.height - 275
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            cleanseAmount (value) {
                let maxIntegerDigits = 10

                if (!value) {
                    return ''
                }

                let prefix = ''

                if (value.substring(0, 1) === '-') {
                    prefix = '-'
                }

                value = value.replace(/[^\d.,]/g, '')

                value = value.replace(',', '.')

                let splited = _.split(value, '.')

                if (splited[0].length > maxIntegerDigits) {
                    return prefix + splited[0].substring(0, maxIntegerDigits)
                }

                if (splited.length > 1 && splited[1] !== '') {
                    return prefix + splited[0] + '.' + splited[1].substring(0, 2)
                }

                return prefix + value
            },

            calculateTotal (vehicle) {
                let total = vehicle.sale_price - vehicle.discount

                return currencyService.formatMoney({
                    value: total
                })
            },

            hasDiscount (vehicle) {
                return vehicle.discount > 0
            }
        },

        created () {
        }
    }
</script>

<style>
.line-through {
    text-decoration: line-through
}

.vertical-timeline-content p {
    margin-top: 0px;
}

.small, small {
    font-size: 95%;
}

.align-text-right {
    text-align: right;
}

.total-margin {
    margin-top: 20px !important;
}

.img-inline {
    display: inline-block;
    margin-top: 20px;
}

.img-style {
    height: 100px;
    cursor: pointer;
    margin: 10px;
}

.m-b-prices {
    margin-bottom: 14px;
}

.table.shoping-cart-table tr td:last-child {
    width: 125px;
}


.btn-outline.disabled {
    border-color: #aaa !important;
    color: #aaa !important;
    background-color: #eee !important;
}

.current-account-table table tr {
    cursor: pointer;
}

.current-account-table table tr td {
    height: 46px;
    vertical-align: middle;
    border: none;
}

.current-account-table table tr.credit-item {
    background-color: #E2F5F1;
}

.current-account-table table tr.credit-item:hover {
    background-color: #C5ECE4;
}

.payments-list {
    border-style: solid;
    margin-bottom: 10px;
    background-color: #fafafa;
}

.scrollable {
    overflow-y: auto;
}

#billing-pay {
    position: fixed;
    left: 220px;
    right: 0px;
    bottom: 41px;
    margin-bottom: 0px;
}

#billing-pay .ibox-content {
    height: 80px;
    padding: 0px 20px;
    align-items: center;
}

i.fa.check-icon.fa-square-o {
    margin-right: 6.86px;
}

i.fa.check-icon.fa-check-square-o {
    margin-right: 5px;
}

i.fa.check-icon-lg {
    font-size: 18px;
    margin-top: 1px;
}

i.fa.check-icon-lg.fa-square-o {
    margin-right: 10.76px;
}

i.fa.check-icon-lg.fa-check-square-o {
    margin-right: 8px;
}

#billing-pay h1.small-1 {
    font-size: 30px;
}

#billing-pay h1.small-2 {
    font-size: 20px;
}

#billing-pay .billing-pay-block {
    flex-grow: 1;
    flex-basis: 0;
    flex-direction: column;
    align-items: flex-start;
}

#billing-pay .ibox-content {
    flex-direction: column;
}

@media (min-width: 800px) {
    #billing-pay .ibox-content {
        flex-direction: row;
    }
}

@media (min-width: 1551px) {
    #billing-pay .billing-pay-block {
        flex-direction: row;
        align-items: flex-end;
    }

    #billing-pay h1.small-1 {
        font-size: 28px;
        margin-left: 10px;
        margin-bottom: 0px;
    }

    #billing-pay h1.small-2 {
        font-size: 25px;
        margin-left: 10px;
        margin-bottom: 0px;
    }
}

::-webkit-input-placeholder {
   text-align: center;
}

.plate {
    width: 240px;
    letter-spacing: 3px;
    font-size: xx-large;
    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 1px solid #676a6c;
}
</style>
