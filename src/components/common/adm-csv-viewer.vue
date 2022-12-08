<template>
    <div class="csv-preview-container">
        <div class="grid-title-row">
            <div v-if="title" class="grid-title">{{ title }}</div>
            <div v-else></div>
            <slot name="action-button"></slot>
            <div
                class="csv-export-icon"
                v-if="grid && csvExportFileName"
                @click="exportErrorsInCsv"
                title="Export as CSV"
            >
                <ukt-inline-svg src="download"></ukt-inline-svg>
            </div>
        </div>
        <div ref="grid" :id="id" :style="css" class="ag-theme-alpine"></div>
    </div>
</template>

<script>
import { Grid } from 'ag-grid-community';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import shortid from 'shortid';
export default {
    name: 'csv-viewer',
    components: { UktInlineSvg },
    props: {
        title: {
            type: String
        },
        csvExportFileName: {
            type: String,
            default: null
        },
        css: {
            type: String,
            default: 'height:500px'
        }
    },
    data: function() {
        return { id: `csvAgGrid-${shortid.generate()}`, grid: null };
    },
    mounted() {
        this.id = `csvAgGrid-${shortid.generate()}`;
    },
    methods: {
        /**
         * @param {Array} data grid data
         * @param {any} options ag grid options
         */
        createGrid(data, options) {
            this.removeGrid();
            let gridDiv = this.$refs.grid;
            this.grid = new Grid(gridDiv, {
                columnDefs: data.column,
                rowData: data.rows,
                ...options
            });
        },
        removeGrid() {
            let grid = this.$refs.grid;
            // grid && grid.remove();
            grid && (grid.innerHTML = '');
        },
        exportErrorsInCsv() {
            if (this.grid) {
                this.grid.gridOptions.api.exportDataAsCsv({
                    fileName: `${this.csvExportFileName}_.csv`
                });
            } else {
                this.$snackbar.global.showInfo('Grid is not loaded');
            }
        }
    },
    destroyed() {
        this.removeGrid();
    }
};
</script>

<style lang="less" scoped>
@import '~ag-grid-community/dist/styles/ag-theme-alpine.css';
@import '~ag-grid-community/dist/styles/ag-grid.css';
.csv-preview-container {
    .grid-title-row {
        width: 100%;
        color: @Mako;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .grid-title {
            color: @Mako;
            font-weight: 500;
        }
        .csv-export-icon {
            cursor: pointer;
            // ::v-deep svg {
            //     width: 18px;
            //     height: 18px;
            // }
        }
    }

    .button-box {
        margin-left: auto;
        @media @mobile {
            margin-left: auto;
        }
        .disabledToggleString {
            color: @DustyGray2;
        }
        .toggle-label {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .pad-right {
            margin-right: 8px;
        }
    }

    ::v-deep .ag-body-viewport {
        .mirage-scrollbar;

        // css hack to select text within ag-frid cell
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }
    ::v-deep .success-row {
        color: white;
        background-color: #00c853;
    }
    ::v-deep.error-row {
        color: #5C5C5C;
        background-color: #FDEDED;
    }
    ::v-deep.warning-row {
        color: white;
        background-color: #ffbb33;
    }
    ::v-deep.info-row {
        color: white;
        background-color: @RoyalBlue;
    }
}
</style>
