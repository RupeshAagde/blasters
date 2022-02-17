<template>
    <div>
        <table class="mirage-table" v-if="tableData && tableData.length">
            <tr>
                <td v-for="(col, index) in tableColumns" :key="'col-' + index">
                    {{ getColoumnName(col) }}
                </td>
            </tr>
            <template>
                <tr v-for="(tab, index) in tableData" :key="'tab-' + index">
                    <td>{{ tab.uid }}</td>
                    <td>{{ tab.hsn_code }}</td>
                    <td>{{ tab.type }}</td>

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
        getColoumnName(col) {
            return col.toUpperCase();
        },
        selectItem: debounce(function(tab, index) {
            this.$set(
                this.tableData.items[index],
                'isSelected',
                !this.tableData.items[index].isSelected
            );
            this.$emit('itemClick', this.tableData.items[index]);
        }, 150),
        selectAllItem: debounce(function(tab, index) {
            if (!this.isAllSelected) {
                this.tableData.items.map((v) => (v.isSelected = true));
            } else {
                this.tableData.items.map((v) => (v.isSelected = false));
            }
            this.$emit('allItemClick', this.tableData.items);
        }, 150),
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
.table-checkox {
    position: relative;
    bottom: 16px;
    left: 12px;
}

/*
    This class needs to use in listing pages
*/
.mirage-table {
    width: 100%;
    margin-bottom: 24px;
    font-family: Inter, sans-serif;
    font-size: 14px;
    border: 1px solid @Iron;
    // ::v-deep .eye-icon > svg {
    //     width: 16px;
    //     height: 16px;
    //     #prefix__Eye_Open {
    //         stroke: @Mako;
    //     }
    //     &:hover {
    //         box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
    //         #prefix__Eye_Open {
    //             stroke: @RoyalBlue;
    //         }
    //     }
    // }
    tr:first-child {
        background: @Alabaster2;
        color: @Black;
        border: 1px solid @Iron;
    }
    tr:not(:first-child) {
        border-bottom: 1px solid @Iron;
    }
    td {
        text-align: center;
        padding: 16px 6px;
        .ml-sm {
            border: 1px solid @Iron;
            padding: 2px 8px 2px 8px;
        }
    }
}
</style>
