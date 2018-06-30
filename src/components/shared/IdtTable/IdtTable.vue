<template>
    <div class="idt-table">
        <filter-panel class="m-b-sm"
            v-if="useFilter"
            :show="filterOpen"
            :filtered-results="hasFilteredResults"
            :filter-button-enabled="filterButtonEnabled"
            :clear-button-enabled="filterClearButtonEnabled"
            @toggled="filterToggled"
            @filter="$emit('filter')"
            @clear="$emit('filter-clear')">

            <loading
                v-show="filterLoading"></loading>

            <slot name="filter"
                v-if="!filterLoading"></slot>
        </filter-panel>

        <div class="idt-table-ibox ibox">
            <div class="ibox-content">
                <div class="search"
                    v-if="useSearch">

                    <label>{{$i18n.t('general.search')}}</label>

                    <div class="input-group">
                        <input type="text" class="form-control"
                            v-model="searchTerm"
                            :placeholder="searchPlaceholder">

                        <span class="input-group-btn">
                            <button class="btn btn-default"
                                v-tooltip="{title: $i18n.t('actions.clear'), placement: 'left'}"
                                @click="searchTerm = ''">

                                <i class="fas fa-times"></i>
                            </button>
                        </span>
                    </div>
                </div>

                <div class="table-responsive"
                    :style="tableContainerStyle">

                    <table class="table table-striped"
                        :class="{'clickable-rows': clickableRows || (expandableRows && expandOnRowClick)}">

                        <thead>
                            <tr>
                                <th class="expand-header"
                                    v-if="expandableRows"></th>
                                
                                <th
                                    v-for="(column, index) in columns"
                                    :key="column[columnKey]"
                                    :class="thClass(column)"
                                    @click="order(column)">

                                    <span class="pull-right m-l-sm"
                                        v-if="columnIsOrderable(column)">

                                        <i class="fas"
                                            :class="{
                                                'fa-sort-up': orderBy && orderBy.column === column[columnKey] && orderBy.direction === 'asc',
                                                'fa-sort-down': orderBy && orderBy.column === column[columnKey] && orderBy.direction === 'desc',
                                                'fa-sort': !orderBy || orderBy.column !== column[columnKey]
                                            }"></i>
                                    </span>

                                    <span>
                                        <slot name="column"
                                            :column="column"
                                            :index="index">

                                            {{columnLabel ? column[columnLabel] : column[columnKey]}}
                                        </slot>
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <template
                                v-if="!loading && rows.length"
                                v-for="(row, rowIndex) in rows">

                                <tr class="expandable-row"
                                    :key="rowKey ? row[rowKey] : rowIndex"
                                    @click="rowClicked(row, rowIndex)">

                                    <td class="text-center"
                                        v-if="expandableRows"
                                        @click.stop="toggleExpandRow(row, rowIndex)">

                                        <i class="fas fa-fw"
                                            :class="{
                                                'fa-chevron-down': rowIsExpanded(row, rowIndex),
                                                'fa-chevron-right': !rowIsExpanded(row, rowIndex)
                                            }"></i>
                                    </td>

                                    <td
                                        v-for="(column, columnIndex) in columns"
                                        :key="columnIndex"
                                        :class="tdClass(column)">

                                        <slot name="cell"
                                            :row="row"
                                            :row-index="rowIndex"
                                            :column="column"
                                            :column-index="columnIndex"
                                            :cell="cellValue(row, column, columnKey)">

                                            {{cellValue(row, column, columnKey)}}
                                        </slot>
                                    </td>
                                </tr>

                                <tr class="row-expansion unclickable bg-white"
                                    v-if="rowIsExpandable(row) && rowIsExpanded(row, rowIndex)"
                                    :key="'expansion:' + (rowKey ? row[rowKey] : rowIndex)"
                                    :class="{'expanded': rowIsExpanded(row, rowIndex)}">

                                    <td
                                        :colspan="columns.length + 1">

                                        <slot name="row-expansion"
                                            :row="row"
                                            :row-index="rowIndex"></slot>
                                    </td>
                                </tr>
                            </template>

                            <tr class="unclickable bg-white"
                                v-if="!loading && !rows.length">

                                <td
                                    :colspan="columns.length">

                                    {{$i18n.t('general.no-results')}}
                                </td>
                            </tr>

                            <tr class="unclickable bg-white"
                                v-if="loading">

                                <td
                                    :colspan="columns.length">

                                    <loading></loading>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="table-footer flex">
                    <pagination
                        v-if="pagination && !loading && rows.length"
                        :page="pagination.page"
                        :totalItems="pagination.totalItems"
                        :itemsPerPage="pagination.itemsPerPage"
                        @pageChanged="$emit('page-changed', $event)"></pagination>

                    <div class="actions">
                        <button type="button" class="btn btn-primary btn-outline"
                            :class="{'disabled': loading}"
                            v-for="button in displayedExportButtons"
                            :key="button.type"
                            v-tooltip="{title: button.title || button.type, placement: 'left'}"
                            @click="emitExport(button)">

                            <i class="fa-fw"
                                :class="[button.icon]"></i>

                            <span class="download-icon">
                                <i class="fas fa-arrow-down"></i>
                            </span>
                        </button>

                        <button type="button" class="btn btn-primary btn-outline"
                            :class="{'disabled': loading}"
                            v-if="refreshButton"
                            v-tooltip="{title: $i18n.t('actions.refresh'), placement: 'left'}"
                            @click="emitRefresh">

                            <i class="fas fa-fw fa-sync"
                                :class="{
                                    'fa-spin': loading
                                }"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import templatingUtilities from '@/components/shared/utilities/templating'
    import allowedExportTypes from '@/components/shared/IdtTable/allowedExportTypes'
    import tooltip from '@/directives/tooltip'
    import Loading from '@/components/shared/Loading'
    import FilterPanel from '@/components/shared/FilterPanel'
    import Pagination from '@/components/shared/Pagination'

    export default {
        directives: {
            tooltip
        },

        components: {
            Loading,
            FilterPanel,
            Pagination
        },

        props: {
            /*** Required ***/
            /****************/

            // Array of objects with these properties:
            // [columnKey]: (string) column identifier
            // [columnLabel]: (string) column label
            // thClass (optional): (string/object/array)
            // tdClass (optional): (string/object/array)
            /* example (columnKey = 'name', columnLabel = 'title'):
                [
                    {
                        name: 'address',
                        title: 'Customer address',
                        thClass: {'text-right': true},
                        tdClass: 'text-right'
                    }
                ]
            */
            columns: {
                type: Array,
                required: true
            },

            // Specifies what property on each column is its unique identifier
            // example: 'name'
            columnKey: {
                type: String,
                required: true
            },

            // Array of objects, where each object has properties corresponding to the given columns' keys
            rows: {
                type: Array,
                required: true
            },

            /*** Optional - Recommended ***/
            /******************************/

            // Specifies what property on each column should be displayed as its label
            columnLabel: {
                type: String
            },

            // Specify the rows' unique identifier property for improved performance
            rowKey: String,

            /*** Optional ***/
            /****************/

            // Should the table have a filter panel
            // Parent must specify the 'filter' slot
            // Emits: filter-toggled(isOpen)
            // Emits: filter()
            // Emits: filter-clear()
            useFilter: {
                type: Boolean,
                default: false
            },

            // Show a loading for the filter panel
            filterLoading: {
                type: Boolean,
                default: false
            },

            // Should the filter panel display a filtering icon
            hasFilteredResults: {
                type: Boolean,
                default: false
            },

            // Should filter button be enabled
            filterButtonEnabled: {
                type: Boolean,
                default: true
            },

            // Should clear filter button be enabled
            filterClearButtonEnabled: {
                type: Boolean,
                default: true
            },

            // Should the table have a search bar
            useSearch: {
                type: Boolean,
                default: false
            },

            // Should the search be debounced
            // Pass true for a 600ms delay or a number (ms) for the desired delay
            searchDebounce: {
                type: [Boolean, Number],
                default: false
            },

            // Search value
            // Emits: search(searchString)
            search: {
                type: String,
                default: ''
            },

            // Search input placeholder
            searchPlaceholder: {
                type: String,
                default: ''
            },

            // Allow the table to be orderable by clicking on its column headers.
            // Emits: order(orderBy) <See orderBy property below>
            useOrdering: {
                type: Boolean,
                default: false
            },

            // Object with 2 properties:
            // column: (string) column identifier corresponding to the [columnKey] property.
            // direction: (string) 'asc' / 'desc'
            /* example:
                {
                    column: 'address',
                    direction: 'desc'
                }
            */
            orderBy: Object,

            // An array of column identifiers corresponding to the [columnKey] property.
            // These columns will not be clickable for ordering.
            unorderableColumns: Array,

            // Show a loading for the table's rows.
            loading: {
                type: Boolean,
                default: false
            },

            // Allow the rows to be clickable.
            // Emits: row-clicked(row)
            clickableRows: {
                type: Boolean,
                default: false
            },

            // Allow the rows to be expandable.
            // Pass true for all rows or an array of {rowKey}
            // (rowKey attribute required for array usage).
            // Parent must specify the 'row-expansion' slot
            // Emits: row-expanded(row)
            // Emits: row-collapsed(row)
            expandableRows: {
                type: [Boolean, Array],
                default: false
            },

            // Allow expanding by clicking on the entire row.
            // Don't use if you're using clickableRows for other stuff.
            expandOnRowClick: {
                type: Boolean,
                default: false
            },

            // Pagination object with 3 properties:
            /* example:
                {
                    itemsPerPage: 25,
                    page: 1,
                    totalItems: 50
                }
            */
            // Emits: page-changed(page)
            pagination: Object,

            // Should the table contain a refresh button
            // Emits: refresh()
            refreshButton: {
                type: Boolean,
                default: true
            },

            // Array specifying which export buttons should be displayed
            // Available options: ['csv']
            // Emits: export(type)
            exportButtons: {
                type: Array,
                default: () => []
            },

            // Applies a min-height style to the table container
            tableMinHeight: [Number, String]
        },

        data () {
            return {
                filterOpen: false,

                searchTerm: this.search,

                debouncedSearch: null,

                expandedRows: []
            }
        },

        computed: {
            displayedExportButtons () {
                return allowedExportTypes.getTypesFromKeys(this.exportButtons)
            },

            tableContainerStyle () {
                let style = {}

                if (this.tableMinHeight) {
                    style.minHeight = this.tableMinHeight + (typeof(this.tableMinHeight) === 'string' ? '' : 'px')
                }

                return style
            }
        },

        methods: {
            cellValue (row, column, columnKey) {
                return _.get(row, column[columnKey])
            },

            filterToggled (show) {
                this.filterOpen = show

                this.$emit('filter-toggled', show)
            },

            thClass (column) {
                let classes = []

                if (this.columnIsOrderable(column)) {
                    classes.push('clickable')
                }

                if (column.thClass) {
                    classes.push(column.thClass)
                }

                return templatingUtilities.mergeClasses(classes)
            },

            tdClass (column) {
                return column.tdClass || null
            },

            columnIsOrderable (column) {
                if (!this.useOrdering) {
                    return false
                }

                if (!this.unorderableColumns || !this.unorderableColumns.length) {
                    return true
                }

                return this.unorderableColumns.indexOf(column[this.columnKey]) === -1
            },

            rowIsExpandable (row) {
                if (!this.expandableRows || !this.$scopedSlots['row-expansion']) {
                    return false
                }

                if (this.expandableRows === true) {
                    return true
                }

                return !!(Array.isArray(this.expandableRows) &&
                    this.rowKey &&
                    this.expandableRows.indexOf(row[this.rowKey]) >= 0)
            },

            rowIsExpanded (row, index) {
                let key = this.rowKey ? row[this.rowKey] : index

                return this.expandedRows.indexOf(key) >= 0
            },

            order (column) {
                if (!this.columnIsOrderable(column)) {
                    return
                }

                let columnIdentifier = column[this.columnKey]

                let direction = 'asc'

                if (this.orderBy && this.orderBy.column === columnIdentifier) {
                    direction = this.orderBy.direction === 'asc' ? 'desc' : 'asc'
                }

                this.$emit('order', {
                    column: columnIdentifier,
                    direction
                })
            },

            toggleExpandRow (row, index) {
                let key = this.rowKey ? row[this.rowKey] : index

                let expandedIndex = this.expandedRows.indexOf(key)

                if (expandedIndex === -1) {
                    this.expandedRows.push(key)

                    this.$emit('row-expanded', row)
                } else {
                    this.expandedRows.splice(expandedIndex, 1)

                    this.$emit('row-collapsed', row)
                }
            },

            rowClicked (row, index) {
                if (this.expandableRows && this.expandOnRowClick) {
                    this.toggleExpandRow(row, index)
                }

                this.$emit('row-clicked', row)
            },

            updateSearchDebounce () {
                if (!this.useSearch || this.searchDebounce === false) {
                    this.debouncedSearch = null

                    return
                }

                let self = this

                let delay = 600

                if (Number.isInteger(self.searchDebounce) && self.searchDebounce > 0) {
                    delay = self.searchDebounce
                }

                self.debouncedSearch = _.debounce(value => {
                    self.$emit('search', value)
                }, delay)
            },

            emitSearch (value) {
                if (this.searchDebounce) {
                    this.debouncedSearch(value)
                } else {
                    this.$emit('search', value)
                }
            },

            emitRefresh () {
                if (this.loading) {
                    return
                }

                this.$emit('refresh')
            },

            emitExport (button) {
                if (this.loading) {
                    return
                }

                this.$emit('export', button.type)
            }
        },

        watch: {
            searchTerm (value) {
                this.emitSearch(value)
            },

            searchDebounce () {
                this.updateSearchDebounce()
            }
        },

        created () {
            this.updateSearchDebounce()
        }
    }
</script>

<style>
    .idt-table .table thead>tr th.clickable,
    .idt-table .table.clickable-rows tbody>tr:not(.unclickable) td {
        cursor: pointer;
    }

    .idt-table .table thead>tr th.clickable:hover,
    .idt-table .table.clickable-rows tbody>tr:not(.unclickable):hover {
        background-color: #f5f5f5;
    }

    .idt-table .table thead>tr th.expand-header {
        width: 1px;
    }

    .idt-table .table {
        margin-bottom: 0px;
    }

    .idt-table .idt-table-ibox .bg-white {
        background-color: #fff !important;
    }

    .idt-table .idt-table-ibox .ibox-content {
        padding: 0px;
    }

    .idt-table .idt-table-ibox .search {
        padding: 10px;
    }

    .idt-table .idt-table-ibox .table-footer {
        justify-content: flex-end;
    }

    .idt-table .idt-table-ibox .table-footer .v-pagination {
        flex-grow: 1;
        padding: 20px 0px 20px 20px;
    }

    .idt-table .idt-table-ibox .table-footer .actions {
        display: flex;
        padding: 20px;
    }

    .idt-table .idt-table-ibox .table-footer .actions .btn {
        position: relative;
    }

    .idt-table .idt-table-ibox .table-footer .actions .btn:not(:first-child) {
        margin-left: 10px;
    }

    .idt-table .idt-table-ibox .table-footer .actions .btn .download-icon {
        position: absolute;
        bottom: -2px;
        right: 2px;
        font-size: 12px;
    }
</style>
