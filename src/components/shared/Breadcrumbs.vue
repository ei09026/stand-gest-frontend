<template>
    <ol class="breadcrumb" :class="{'gray-bg': grayBackground}">
        <li>
            <router-link to="/" v-text="$t('navigation.home')"></router-link>
        </li>
        <li v-for="breadcrumb in breadcrumbs">
            <router-link v-if="breadcrumb.url" :to="breadcrumb.url" v-text="breadcrumb.title"></router-link>
            <span v-if="!breadcrumb.url" v-text="breadcrumb.title"></span>
        </li>
        <li class="active">
            <strong v-text="activeTitle"></strong>
        </li>
    </ol>
</template>

<script>
    export default {
        props: {
            activeTitle: {
                type: String
            },
            // Is it still necessary?
            title: {
                type: String
            },
            breadcrumbs: {
                type: Array,
                default () {
                    return []
                }
            },

            grayBackground: {
                type: Boolean,
                default: false
            },

            listClass: {
                type: [Object, Array],
                default () {
                    return {}
                }
            }
        },

        computed: {
            finalListClass () {
                let finalListClass = {
                    'gray-bg': this.grayBackground,
                    'white-bg': !this.grayBackground
                }

                if (Array.isArray(this.listClass)) {
                    for (let i = 0; i < this.listClass.length; i++) {
                        finalListClass[this.listClass[i]] = true
                    }
                } else {
                    Object.assign(finalListClass, this.listClass)
                }

                return finalListClass
            }
        }
    }
</script>

<style>
.breadcrumb {
    margin-top: 14px;
}
</style>
