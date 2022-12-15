import {TABLE_COLUMN_TYPES} from "../../data/constants";

const reportsFilterMixins = {
    props: {
        seedFilterData: {
            type: Object, required: true, default() {
                return {}
            }
        },
        existingFilters: {type: Array},
        isOpen: {Boolean, default: false}
    },
    methods: {
        mapToDropDownFormat(data) {
            return data.map((x, i) => {
                return {
                    text: x.name,
                    value: x.id,
                    type: x.type,
                    id: x.id
                }
            })
        },
        operandType(filter, operand = 'operand1') {
            return this.filterIdMappings && this.filterIdMappings[filter[operand]]
        },
    },
    computed: {
        operand1DropDownItems() {
            if (!Object.keys(this.seedFilterData).length) {
                return [{id: "1", text: "Product code", value: "Product code"}, {
                    id: "2",
                    text: "SKU",
                    value: "SKU"
                }, {id: "3", text: "Quantity", value: "Quantity"}]
            }
            // console.log('seed data: ', this.seedFilterData)
            return this.mapToDropDownFormat(this.seedFilterData.data);
        },
        filterIdMappings() {
            return this.operand1DropDownItems.reduce((a, i) => {
                a[i.value] = !i.type || i.type === 'date' ? TABLE_COLUMN_TYPES.STRING : i.type.trim().toLowerCase()
                return a;
            }, {})
        },
    }
}
export {reportsFilterMixins}