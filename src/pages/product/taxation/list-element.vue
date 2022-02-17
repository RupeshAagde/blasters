<template>
    <div>
        <table class="mirage-table" v-if="tableData && tableData.length">
            <tr>
                <td v-for="(col, index) in tableColumns" :key="'col-' + index">
                    {{ col }}
                </td>
            </tr>
            <template>
                <tr v-for="(tab, index) in tableData" :key="'tab-' + index">
                    <td>{{ tab.uid }}</td>
                    <td>{{ tab.hsn_code }}</td>
                    <td>{{ formatString(tab.type) }}</td>

                    <td>
                        {{ format_date(tab.taxes[0].effective_date) }}
                    </td>
                    <td>{{ tab.taxes[0].rate }}%</td>
                    <td>{{ tab.country_code }}</td>
                    <td>
                        <nitrozen-button
                            theme="secondary"
                            class="ml-sm"
                            @click="redirectEdit(tab.uid)"
                        >
                            <inline-svg
                                class="nitrozen-icon"
                                src="edit"
                                title="edit hsn"
                            ></inline-svg>
                        </nitrozen-button>
                    </td>
                </tr>

            </template>
        </table>
    </div>
</template>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import debounce from 'lodash/debounce';
import path from 'path';
import moment from 'moment';
import { NitrozenButton, strokeBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'list-element',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        InlineSvg,
        NitrozenButton
    },
    directives: {
        strokeBtn
    },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        tableColumns: {
            type: Array,
            default: () => []
        },
        selectedIds: {
            type: Array,
            default: () => []
        },
        entityType: {
            type: String
        },
        activeTab: {
            type: Number
        }
    },
    computed: {
        isAllSelected() {
            return this.tableData.items.every((v) => v.isSelected);
        }
    },
    data() {
        return {
            selectAll: false
        };
    },
    methods: {
        formatString(str){
            if(str.length>0){
                let tempStr = str;
                return tempStr[0].toUpperCase() + tempStr.slice(1)
            }
            return 'type not found';
        },
        format_date(value) {
            if (value) {
                return moment(value);
            }
        },
        redirectEdit(code) {
            let redirectPath = `${code}/edit`;
            this.$router.push({
                path: path.join(this.$route.path, redirectPath)
            });
        }
    }
};
</script>

<style lang="less" scoped>
.mirage-table {
    width: 100%;
    margin-bottom: 24px;
    font-family: Inter;
    font-size: 14px;
    border: 1px solid @Iron;
    border-radius:4px;

    tr:first-child {
        background: #f6f6f6;
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        border-radius: 4px;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #41434c;
    }
    tr:not(:first-child) {
        border-bottom: 1px solid @Iron;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        opacity:0.5;
    }
    td {
        text-align: left;
        padding: 16px 16px;
        .ml-sm {
            border: 1px solid @Iron;
            padding: 2px 8px 2px 8px;
        }
    }
}
</style>
