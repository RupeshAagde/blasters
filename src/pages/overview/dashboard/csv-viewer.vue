<template>
    <transition name="modal" mode="out-in">
        <!-- <ukt-modal
            class="nav-form"
            :isOpen="true"
            :childHandleFocus="true"
            @closedialog="closeDialog"
            :title="title"
        >
            <loader class="loading" v-if="showLoader"></loader>
            <div class="columns">
                <div class="column full-width">
                    <div class="csv-table">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th
                                        class="cell dark-sm"
                                        v-for="(h, i) in headers"
                                        :key="i"
                                    >
                                        <div
                                            class="csv-header"
                                            @click="sortData(i)"
                                        >
                                            <span>{{ h }}</span>
                                            <span
                                                class="sort-icon"
                                                v-if="sortIndex == i"
                                            >
                                                <ukt-inline-svg
                                                    class="asc-icon"
                                                    name="sort-asc"
                                                    :src="
                                                        asc
                                                            ? 'arrow-dropdown-black'
                                                            : 'arrow-top-black'
                                                    "
                                                ></ukt-inline-svg>
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, i) in rows" :key="i">
                                    <td
                                        class="cell regular-xs"
                                        v-for="(cell, j) in row"
                                        :key="j"
                                    >
                                        {{ cell }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ukt-modal>-->

        <nitrozen-dialog ref="csv_viewer" :title="title" @close="closeDialog">
            <template slot="body">
                <loader class="loading" v-if="showLoader"></loader>
                <div class="columns">
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search"
                        type="search"
                        :placeholder="'Search'"
                        v-model="searchText"
                        @input="searchCsv"
                    ></nitrozen-input>
                    <div class="column full-width">
                        <div class="csv-table">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th
                                            class="cell dark-sm regular-xs index-th"
                                        >
                                            #
                                        </th>
                                        <th
                                            class="cell dark-sm regular-xs header-th"
                                            v-for="(h, i) in headers"
                                            :key="i"
                                        >
                                            <div
                                                class="csv-header"
                                                @click="sortData(i)"
                                            >
                                                <span
                                                    :class="{
                                                        'selected-opt':
                                                            sortIndex == i
                                                    }"
                                                    >{{ h }}</span
                                                >
                                                <span
                                                    class="sort-icon"
                                                    v-if="sortIndex == i"
                                                >
                                                    <ukt-inline-svg
                                                        class="asc-icon"
                                                        name="sort-asc"
                                                        :src="
                                                            asc
                                                                ? 'arrow-dropdown-black'
                                                                : 'arrow-top-black'
                                                        "
                                                    ></ukt-inline-svg>
                                                </span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(row, i) in filteredRows"
                                        :key="i"
                                    >
                                        <td class="cell regular-xs">
                                            {{ i + 1 }}
                                        </td>
                                        <td
                                            class="cell regular-xs"
                                            v-for="(cell, j) in row"
                                            :key="j"
                                        >
                                            {{ cell }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- <div v-if="!filteredRows.length && !showLoader">
                <adm-no-content :helperText="'No Data Available'"></adm-no-content>
                </div> -->
            </template>
            <template slot="footer">
                <div></div>
            </template>
        </nitrozen-dialog>
    </transition>
</template>

<script>
import uktmodal from './../../../../components/common/ukt-modal.vue';
import loader from './../../../../components/admin/common/adm-loader.vue';
import admnocontent from './../../../../components/admin/common/adm-no-content';
import uktinlinesvg from './../../../../components/common/ukt-inline-svg.vue';
import ApiService from './../../../../services/api.service';
import papa from 'papaparse';
import { NitrozenDialog, NitrozenInput } from '@gofynd/nitrozen-vue';

export default {
    name: 'csv-viewer',
    components: {
        'ukt-modal': uktmodal,
        'ukt-inline-svg': uktinlinesvg,
        'adm-no-content': admnocontent,
        loader: loader,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-input': NitrozenInput
    },
    props: {
        csvLink: {},
        title: {}
    },
    watch: {
        csvLink() {
            this.fetchCSV();
        }
    },
    data() {
        return {
            showLoader: false,
            headers: [],
            rows: [],
            sortIndex: 0,
            asc: true,
            searchText: '',
            filteredRows: []
        };
    },
    computed: {},
    mounted() {
        this.$refs['csv_viewer'].open({
            width: '800px',
            showCloseButton: true,
            dismissible: true
        });
        this.fetchCSV();
    },
    methods: {
        createCSVTable(data) {
            var text = data;
            const csvMeta = papa.parse(data);
            this.headers = csvMeta.data[0];
            // this.headers.unshift('#');
            this.rows = csvMeta.data.slice(1, csvMeta.data.length);
            this.filteredRows = this.rows;
        },

        sortData(index) {
            if (this.sortIndex == index) {
                this.asc = !this.asc;
            } else {
                this.sortIndex = index;
            }
            this.rows.sort(
                function(a, b) {
                    return this.compareData(a, b);
                }.bind(this)
            );
        },
        compareData(a, b) {
            if (isNaN(a[this.sortIndex]) || isNaN(b[this.sortIndex])) {
                if (this.asc) {
                    return a[this.sortIndex].localeCompare(b[this.sortIndex]);
                }
                return -a[this.sortIndex].localeCompare(b[this.sortIndex]);
            }
            if (this.asc) {
                return a[this.sortIndex] - b[this.sortIndex];
            }
            return b[this.sortIndex] - a[this.sortIndex];
        },

        fetchCSV() {
            if (this.csvLink) {
                this.showLoader = true;
                ApiService.get(this.csvLink, { headers: {} })
                    .then(res => {
                        this.showLoader = false;
                        this.createCSVTable(res.data);
                    })
                    .catch(err => {
                        this.showLoader = false;
                    });
            }
        },
        searchCsv() {
            if (this.searchText) {
                this.filteredRows = [];
                for (let i = 0; i < this.rows.length; i++) {
                    for (let j = 0; j < this.rows[i].length; j++) {
                        if (this.rows[i][j].includes(this.searchText)) {
                            this.filteredRows.push(this.rows[i]);
                        }
                    }
                }
            } else {
                this.filteredRows = this.rows;
            }
        },
        closeDialog() {
            this.$emit('closedialog');
            // this.$refs['csv_viewer'].close();
        }
    }
};
</script>

<style lang="less" scoped>
.columns {
    max-height: 350px;
}
.full-width {
    width: 100%;
    max-width: 100%;
}
.half-width {
    width: 50%;
    max-width: 50%;
}
.csv-table {
    max-width: 100%;
    overflow-x: auto;
    margin: 0px 0px 15px 0px;
    .table {
        width: 100%;
        tr:nth-child(even) {
            background-color: @Alabaster2;
        }
    }
    thead {
        background-color: @Alabaster2;
    }
    th,
    td {
        border: 1px solid @LightGray;
    }
    th {
        text-transform: capitalize;
        font-weight: 600;
    }
    .index-th {
        width: 10%;
    }
    .header-th {
        width: 30%;
    }
}
.csv-header {
    white-space: nowrap;
    cursor: pointer;
    .flex-center();
}
.cell {
    text-align: center;
    padding: 10px;
}
.buttons {
    padding-left: 20px;
}
.search {
    width: 400px;
    margin-bottom: 24px;
}
::v-deep .nitrozen-dialog-footer {
    display: none;
}
.selected-opt {
    color: #2E31BE;
}
</style>
