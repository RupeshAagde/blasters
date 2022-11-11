import {ANALYTICS_PAGES, GRAPH_TYPES, ROW_DATA_PICKER, TABLE_COLUMN_TYPES} from "../../data/constants";

const analyticsTablePropsMixins = {
    props: {
        columns: {
            type: Array,
        },
        rows: {
            type: Array,
        },
        chartId: {type: [String, Number]},
        showPagination: {type: Boolean, default: false, required: false},
        analyticPage: {type: String, default: ANALYTICS_PAGES.DASHBOARD},
        type: {type: String, default: GRAPH_TYPES.TABLE},
        extraProps: {type: Object},
        statusCode: {type: Number, required: true}
    },
    methods: {
        rowDataPicker(data, type = TABLE_COLUMN_TYPES.STRING) {
            // if the data is present at the root level then send them, if an object then pick the properties accordingly
            if (type !== TABLE_COLUMN_TYPES.IMAGE && (typeof data === "string" || typeof data === "number")) {
                return data;
            }
            // console.log(data);
            return data && data[ROW_DATA_PICKER[type]];
        },
        valueFormatterPicker(row, column) {
            const data = row[column.field];
            if (!data) {
                // console.log('empty- ', data, row, columnField);
                return null;
            }
            let formatter = data.valueFormatter;
            if (column.valueFormatter) {
                formatter = {...column.valueFormatter, ...formatter};
            }
            return formatter;
        },
        imageValuePicker(row, columnField) {
            // console.log('columField: ', columnField, ' and value: ', row[columnField])
            if (typeof row[columnField] === 'string') {
                return row[columnField];
            }
            if (!row[columnField].image) {
                return null;
            }
            return row[columnField].image;
        },
        mapToPaginationFormat({current, size, item_total}) {
            return {
                total: item_total,
                current,
                limit: Math.max(size, this.paginationRows[0])
            }
        }
    },
    computed: {
        errorText() {
            // if (this.graphType !== GRAPH_TYPES.TABLE) {
            //     return `No data available for selected filter`
            // }
            return `No data available for selected filter`
        }
    }
};

const analyticsGenericGraphMixins = {
    props: {
        xAxes: {
            type: Array,
            required: false
        },
        yAxes: {
            type: Array,
            required: false
        },
        filters: {type: Object, default: null},
        extraProps: {type: Object},
        dataSource: {type: String, required: true}
    }
};

const analyticsTableV2 = {
    props: {
        seedFilters: {type: Array, default: () => null},
    }
};

export {analyticsTablePropsMixins, analyticsGenericGraphMixins, analyticsTableV2};
