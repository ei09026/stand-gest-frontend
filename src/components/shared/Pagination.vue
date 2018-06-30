<template>
    <div class="v-pagination">
        <div class="btn-group pagination"
            :class="navigationClass">

            <button type="button" class="btn btn-white"
                :disabled="!hasPreviousPage"
                @click="jumpToPage(1)">

                <i class="fa fa-angle-double-left"></i>
            </button>
    
            <button type="button" class="btn btn-white"
                :disabled="!hasPreviousPage"
                @click="jumpToPage(page - 1)">

                <i class="fa fa-angle-left"></i>
            </button>
    
            <button class="btn btn-white"
                @click="pageJumperIsOpen = !pageJumperIsOpen">

                {{ page + ' ' + $i18n.t('ui-elements.pagination.of') + ' ' + totalPages }}
            </button>
    
            <div class="dropdown-menu border-left-right border-top-bottom page-jumper"
                v-show="pageJumperIsOpen">
    
                <div class="form-group m-n">
                    <div class="input-group">
                        <filtered-input class="form-control"
                            v-model="pageJumperValue"
                            :filter="pageInputFilter"
                            @key-pressed-enter="jumpToPage(pageJumperValue)"></filtered-input>
    
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-primary"
                                @click="jumpToPage(pageJumperValue)">

                                <i class="fa fa-chevron-right"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
    
            <button type="button" class="btn btn-white"
                :disabled="!hasNextPage"
                @click="jumpToPage(page + 1)">

                <i class="fa fa-angle-right"></i>
            </button>
    
            <button type="button" class="btn btn-white"
                :disabled="!hasNextPage"
                @click="jumpToPage(totalPages)">

                <i class="fa fa-angle-double-right"></i>
            </button>
        </div>

        <button 
            v-if="refresh"
            type="button"
            class="btn btn-success btn-outline pull-right m-r-lg"
            @click="$emit('refresh')">
            
            <i class="fa fa-sync"></i>
        </button>

        <template
            v-if="showItemsCount">

            <span class="items-count hidden-xs hidden-sm m-l-sm">
                {{ $t('ui-elements.pagination.showing-from') }}

                <strong>{{showingFrom}}</strong> {{ $t('ui-elements.pagination.until') }}

                <strong>{{showingUntil}}</strong> {{ $t('ui-elements.pagination.of') }}

                <strong>{{totalItems}}</strong> {{ $t('ui-elements.pagination.results') }}
            </span>

            <span class="items-count hidden-md hidden-lg m-l-sm">
                <strong>{{showingFrom}} - {{showingUntil}}</strong>

                <span class="m-l-sm">({{totalItems}})</span>
            </span>
        </template>
    </div>
</template>

<script>
    import FilteredInput from '@/components/shared/input/FilteredInput'

    export default {
        components: {
            FilteredInput
        },

        props: {
            page: {
                type: Number,
                default: 1
            },

            totalItems: {
                type: Number,
                default: 0
            },

            itemsPerPage: {
                type: Number,
                default: 0
            },

            position: {
                type: String,
                default: 'top'
            },

            showItemsCount: {
                type: Boolean,
                default: true
            },

            refresh: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                pageJumperOpen: false,
                pageJumperValue: this.page
            }
        },

        computed: {
            navigationClass () {
                let finalClass = {
                    'pull-right': this.showItemsCount,
                    'open': this.pageJumperIsOpen,
                    'closed': !this.pageJumperIsOpen,
                    'dropup': this.position === 'top'
                }

                if (Array.isArray(this.paginationClass)) {
                    for (let i = 0; i < this.paginationClass.length; i++) {
                        finalClass[this.paginationClass[i]] = true
                    }
                } else {
                    Object.assign(finalClass, this.paginationClass)
                }

                return finalClass
            },

            totalPages () {
                if (!this.itemsPerPage) {
                    return 1
                }

                let totalPages = Math.ceil(this.totalItems / this.itemsPerPage)

                return totalPages || 1
            },

            hasPreviousPage () {
                return this.page > 1
            },

            hasNextPage () {
                return this.page < this.totalPages
            },

            pageJumperIsOpen: {
                get () {
                    return this.pageJumperOpen
                },

                set (value) {
                    this.pageJumperValue = this.page
                    this.pageJumperOpen = value
                }
            },

            showingFrom () {
                let from = this.itemsPerPage * (this.page - 1) + 1

                return from > this.totalItems ? this.totalItems : from
            },

            showingUntil () {
                let until = (this.itemsPerPage * this.page)

                return until > this.totalItems ? this.totalItems : until
            }
        },

        methods: {
            jumpToPage (page) {
                this.pageJumperIsOpen = false
                this.$emit('pageChanged', page)
            },

            pageInputFilter (value) {
                if (!value || isNaN(value)) {
                    return 1
                }

                value = parseInt(value)

                if (value < 1) {
                    return 1
                }

                if (value > this.totalPages) {
                    return this.totalPages
                }

                return value
            }
        }
    }
</script>

<style>
    .pagination {
        margin: 0px;
        white-space: nowrap;
    }

    .v-pagination .items-count {
        line-height: 34px;
    }

    .v-pagination .page-jumper open {
        display: block;
    }

    .v-pagination .page-jumper closed {
        display: none;
    }

    .v-pagination .dropdown-menu {
        box-shadow: none;
    }
</style>
