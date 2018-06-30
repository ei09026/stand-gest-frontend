<template>
    <div class="row wrapper gray-bg page-heading p-h-xs m-b-sm"
        :class="{'white-bg': !grayBackground, 'gray-bg': grayBackground}">
        
        <div class="col-md-6 page-heading-component">
            <img class="active-picture"
                v-if="activePicture"
                :src="activePicture.imgSrc"
                :class="activePicture.imgClass || []">
            
            <h2 class="m-t-sm"
                v-text="title"></h2>
        </div>

        <div class="col-md-6 text-right page-heading-component">
            <breadcrumbs
                v-if="activeTitle"
                :active-title="activeTitle"
                :breadcrumbs="breadcrumbs"
                :gray-background="grayBackground"></breadcrumbs>
        </div>
    </div>
</template>

<script>
    import Breadcrumbs from '@/components/shared/Breadcrumbs'

    export default {
        components: {
            Breadcrumbs
        },

        props: {
            activeTitle: String,

            pageTitle: String,
            
            activePicture: Object, // {imgSrc: '...', imgClass: '...'}

            breadcrumbs: {
                type: Array,
                default () {
                    return []
                }
            },

            grayBackground: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            title () {
                return this.pageTitle || this.activeTitle
            }
        }
    }
</script>

<style>
    .page-heading>.page-heading-component {
        height: 46px;
    }

    .page-heading>.page-heading-component>h2 {
        height: 30px;
    }

    .page-heading>.page-heading-component * {
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    .page-heading img.active-picture {
        height: 45px;
        float: left;
        margin-right: 10px;
    }

    @media (max-width: 991px) {
        .page-heading>.page-heading-component {
            text-align: center;
        }
    }
</style>
