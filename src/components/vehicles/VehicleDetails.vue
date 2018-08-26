<template>
    <div class="checklists">
         <page-header
            :active-title="title"></page-header>

        <div class="idt-table-ibox ibox">
            <div class="ibox-content">
                <tab-panel
                    :tabs="tabs"
                    @selectTab="selectedTab = $event">    
                    <div v-if="selectedTab.slug == 'general-data'"
                        class="form-horizontal m-l-md">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group m-t-md">
                                    <label class="col-lg-1 control-label">
                                        Marca
                                    </label>
                                    <div class="col-lg-11">
                                        <span style="border: none;" class="form-control">
                                            <small>Citroen</small>
                                        </span>
                                    </div>
                                </div>

                                <div class="form-group m-t-md">
                                    <label class="col-lg-1 control-label">
                                        Marca
                                    </label>
                                    <div class="col-lg-11">
                                        <span style="border: none;" class="form-control">
                                            <small>Citroen</small>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group m-t-md">
                                    <label class="col-lg-1 control-label">
                                        Marca
                                    </label>
                                    <div class="col-lg-11">
                                        <span style="border: none;" class="form-control">
                                            <small>Citroen</small>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="col-lg-1 control-label">
                                        Marca
                                    </label>
                                    <div class="col-lg-11">
                                        <span style="border: none;" class="form-control">
                                            <small>Citroen</small>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="col-lg-1 control-label">
                                        Marca
                                    </label>
                                    <div class="col-lg-11">
                                        <span style="border: none;" class="form-control">
                                            <small>Citroen</small>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="selectedTab.slug == 'pictures'">
                        <ul>
                            <li v-for="(image, index) in images" 
                                :key="index"
                                class="img-inline">
                                <div class="">
                                    <img 
                                        v-lazy="image.src" 
                                        style="height: 100px" 
                                        class="img-style"
                                        @click="openGallery(index)">
                                    <button class="btn btn-default btn-circle rm-button" >
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>                                
                            </li>
                        </ul>
                                
                        <LightBox :images="images" 
                            ref="lightbox"
                            :show-caption="true"
                            :show-light-box="false">
                        </LightBox>


                         <div class="ibox-content">
         
                            <vue2-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue2-dropzone>

                        </div>

                    </div>
                </tab-panel>
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
    import MaskedInput from 'vue-masked-input'
    import TabPanel from '@/components/shared/TabPanel'
    import LightBox from 'vue-image-lightbox'
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

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
            MaskedInput,
            TabPanel,
            LightBox,
            vue2Dropzone
        },

        data () {
            return {
                title: 'Marcas',

                tabs: [
                    {
                        slug: 'general-data',
                        name: 'Dados gerais',
                        icon: 'fa fa-car'
                    },
                    {
                        slug: 'extras',
                        name: 'Extras',
                        icon: 'fa fa-trophy'
                    },
                    {
                        slug: 'pictures',
                        name: 'Fotos',
                        icon: 'fa fa-camera'
                    },
                    {
                        slug: 'expenses',
                        name: 'Despesas',
                        icon: 'fa fa-dollar-sign'
                    }
                ],

                images: [
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_2_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    },
                    {
                        thumb: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        src: 'https://carspt-images.akamaized.net/images_carspt/75365619_6_1080x720_rev037.jpg',
                        caption: 'caption to display. receive <html> <b>tag</b>',
                    }
                ],

                selectedTab: null,

                dropzoneOptions: {
                    url: 'https://httpbin.org/post',
                    thumbnailWidth: 150,
                    maxFilesize: 0.5,
                    headers: { "My-Awesome-Header": "header value" }
                }
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            openGallery(index) {
                this.$refs.lightbox.showImage(index)
            }
        },

        created () {
            this.selectedTab = this.tabs[0]
        }
    }
</script>

<style>
.vue-lb-box{width:100%}.vue-lb-container{align-items:center;background-color:rgba(0,0,0,.8);box-sizing:border-box;display:-ms-flexbox;display:flex;height:100%;justify-content:center;left:0;padding:10px;position:fixed;top:0;width:100%;z-index:2000;-webkit-align-items:center;-moz-box-sizing:border-box;-webkit-justify-content:center;-ms-flex-align:center;-webkit-box-align:center;-ms-flex-pack:center;-webkit-box-pack:center}.vue-lb-content{margin-bottom:60px;max-width:1024px;position:relative}.vue-lb-header{display:-ms-flexbox;display:flex;justify-content:space-between;height:40px;-webkit-justify-content:space-between;-ms-flex-pack:justify;-webkit-box-pack:justify}.vue-lb-button-close{background:none;border:none;cursor:pointer;outline:none;position:relative;top:0;vertical-align:bottom;height:40px;margin-right:-10px;padding:10px;width:40px}.vue-lb-figure{margin:0;display:block;position:relative}img.vue-lb-modal-image{max-height:calc(100vh - 140px);cursor:pointer;display:block;height:auto;margin:0 auto;max-width:100%;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.vue-lb-info{visibility:initial;position:absolute;bottom:25px;color:#fff;background-color:rgba(0,0,0,.7);height:40px;width:100%;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;text-align:center}.vue-lb-footer{box-sizing:border-box;color:#fff;cursor:auto;display:-ms-flexbox;display:flex;justify-content:space-between;left:0;line-height:1.3;padding:5px 0;-moz-box-sizing:border-box;-webkit-justify-content:space-between;-ms-flex-pack:justify;-webkit-box-pack:justify}.vue-lb-footer-info{display:block;flex:1 1 0;-webkit-flex:1 1 0;-ms-flex:1 1 0}.vue-lb-footer-count{color:hsla(0,0%,100%,.75);font-size:.85em;padding-left:1em}.vue-lb-thumbnail{bottom:10px;height:50px;padding:0 50px;text-align:center;white-space:nowrap;display:inline-block;position:relative}.vue-lb-modal-thumbnail{box-shadow:inset 0 0 0 1px hsla(0,0%,100%,.2)}.vue-lb-modal-thumbnail,.vue-lb-modal-thumbnail-active{background-position:50%;background-size:cover;border-radius:2px;cursor:pointer;display:inline-block;height:50px;margin:2px;overflow:hidden;width:50px}.vue-lb-modal-thumbnail-active{box-shadow:inset 0 0 0 2px #fff}.vue-lb-thumbnail-arrow{height:54px;width:40px;background:none;border:none;border-radius:4px;cursor:pointer;outline:none;padding:10px;position:absolute;top:50%;-webkit-touch-callout:none;user-select:none;height:50px;margin-top:-25px;width:30px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.vue-lb-thumbnail-left{left:10px}.vue-lb-thumbnail-right{right:10px}.vue-lb-arrow{background:none;border:none;border-radius:4px;cursor:pointer;outline:none;padding:10px;position:absolute;top:50%;-webkit-touch-callout:none;user-select:none;height:120px;margin-top:-60px;width:40px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.vue-lb-left{left:10px}.vue-lb-right{right:10px}.vue-lb-open{overflow:hidden}.vue-lb-thumbnail-wrapper{bottom:10px;height:50px;left:0;margin:0 auto;position:absolute;right:0;text-align:center;top:auto}@media (min-width:500px){.vue-lb-thumbnail-arrow{width:40px}}@media (min-width:768px){.vue-lb-arrow{width:70px}}.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}.fade-enter,.fade-leave-to{opacity:0}.no-scroll{overflow-y:hidden}

.img-inline {
    display: inline-block; 
    margin-top: 20px;    
}

.img-style {
    height: 100px;
    cursor: pointer;   
    margin: 10px;
}

.rm-button {
    margin-left: -30px;
    margin-top: -89px;
}

</style>
