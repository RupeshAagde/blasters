<template>
    <div class="summary">
        <p class="cl-Mako darker-md">Validation Summary</p>
        <p class="cl-DustyGray2 regular-xxs total-records">
            Total Records: <span class="cl-Mako darker-xxs">0</span>
        </p>
        <div class="divider"></div>
        <div>
            <no-records></no-records>
        </div>
        <div
            class="form-container csv-table"
            v-show="productsTable.data.length"
        >
            <div class="csv-container">
                <csv-view
                    title="File Data"
                    ref="csv-preview"
                    class="csv-preview"
                    v-show="productsTable.data.length && !showErrorsTable"
                ></csv-view>
                <!-- <csv-view
                    title="Errors"
                    ref="errors-preview"
                    class="csv-preview"
                    v-show="errorsTable().data.length && showErrorsTable"
                    :csvExportFileName="
                        file ? `validation-errors-${file.name}_.csv` : null
                    "
                ></csv-view> -->
            </div>
        </div>
    </div>
</template>

<script>
import NoRecords from '../components/no-records.vue';
import CsvView from '@/components/common/adm-csv-viewer.vue';
export default {
    name: 'validation-summary',
    components: {
        'no-records': NoRecords,
        'csv-view': CsvView
    },
    props: {
        productsTable: Object,
        default: () => {
            return {
                meta: { fields: [] },
                data: []
            };
        }
    },

    data() {
        return {
            showErrorsTable: false,
        };
    },
    mounted() {
        this.renderTable();
    },
    methods: {
        renderTable() {
            console.log(this.productsTable)
            this.$refs['csv-preview'].createGrid({
                column: this.productsTable.meta.fields.map((e) => ({
                    headerName: e,
                    field: e,
                    resizable: true,
                    width: 120
                })),
                rows: this.productsTable.data
            });
        }
    }
};
</script>
<style lang="less" scoped>
.summary {
    margin: 24px;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;

    .total-records {
        padding-top: 8px;
    }

    .divider {
        margin-top: 16px;
        border: 1px solid #e0e0e0;
    }
}
</style>
