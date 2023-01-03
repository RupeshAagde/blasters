<template>
    <div class="table-container">
        <table class="mirage-table list-table">
            <tr class="table-header-row" v-if="columns.length && columns.length">
                <!-- :class="{'clickable': column.sort === true}"
                    @click="sortTable(column, $event)"
                    THE ABOVE AND BELOW COMMENTED CODE WILL BE USED IN SORTING THE LIST ACCORDING TO THE PRICE -->
                <th
                    v-for="column in columns"
                    :key="column.value"
                    class="no-wrap"
                >
                    <div class="row-content"
                        v-if="column.text">
                        <span class="table-header">
                            {{ column.text }}
                        </span>
                        <!-- <adm-inline-svg 
                            v-if="column.sort"
                            :class="{'ascending': column.asc}"
                            src="arrow-dropdown-black">
                        </adm-inline-svg> -->
                    </div>
                </th>
            </tr>
            <tr
                v-for="item in items"
                :key="item.id"
                class="line-break"
            >
                <td class="item-details-container">
                    <div class="item-cell" v-if="item.item">
                        <img v-if="item.item.image" :src="item.item.image" class="item-logo" />
                        <span v-if="item.item.image.name" style="line-height: 17px">{{ item.item.name }}</span>
                    </div>
                </td>
                <td class="size" v-if="item.article && item.article.size">
                    <span>{{ item.article.size }}</span>
                </td>
                <td>
                    <div class="seller-cell" v-if="item.article && item.article.identifiers">
                        <span v-for="(identifier, key) in item.article.identifiers" 
                            :key="identifier+key" id="sku">{{ snakeCaseToCaps(key) }}: {{ identifier }}</span>
                    </div>
                </td>
                <td v-if="item.quantity">
                    <span>{{ item.quantity }}</span>
                </td>
                <td v-if="item.prices && item.prices.price_effective"> 
                    <span>₹{{ item.prices.price_effective.toFixed(2) }}</span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
/* Component imports */
import AdmInlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils';

export default {
    name: 'bags-dialog-table',
    props: {
        items: {
            type: Array,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        }
    },
    components: {
        AdmInlineSvg
    },
    data() {
        return {
            asc: false
        }
    },
    mounted() {
    },
    methods: {
        // sortTable(column, event) {
        //     this.$emit('sort', column);
        // }
        snakeCaseToCaps(text) {
            return convertSnakeCaseToString(text).toUpperCase();
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../../less/common.less';

.table-container {
    overflow-y: auto;
    box-sizing: border-box;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    background-color: #ffffff;
    margin: 18px 24px 24px 24px;
    max-height: 685px;
    .list-table {
        border-collapse: collapse; 
        width: 100%;
        margin-bottom: 0px;
        font-family: Inter, sans-serif;
        font-size: 14px;

        .clickable {
            cursor: pointer;
        }

        .row-content {
            display: flex;
            align-items: center;

            .table-header {
                margin-right: 4px;
            }
        }

        tr:hover {
            cursor: pointer;
            background-color: #F5F8FF;
        }

        .table-header-row {
            position: sticky;
            top: 0;
            z-index: 1;
            box-sizing: border-box;
            width: 1094px;
            height: 47.37px;
            background: #F6F6F6;
            /* colour/border */

            // border: 1px solid #E0E0E0;
            border-bottom: 1px solid #eeeeee;
            border-radius: 4px;
            // background: @Alabaster2;
            // color: @Black;

            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            /* identical to box height, or 142% */
            color: #41434C;
        }
        tr:not(:first-child) {
            border-bottom: none;
            width: 1092px;
            height: 64px;
        }
        tr:last-child {
            border-bottom: none;
        }
        th:first-child {
            // width: 110px;
            padding-left: 24px;
        }
        th {
            position: sticky;
            top: 0;
            vertical-align: middle;
            text-align: left;
            // width: 52.43px;
            height: 17px;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            /* identical to box height, or 142% */
            color: #41434C;
        }
        th:not(:first-child) {
            padding-left: 5px;
        }
        td {
            vertical-align: top;
            text-align: left;
            padding: 12px 6px;

            &:first-child {
                padding-left: 24px;
            }
        }
        tr.line-break td{
            position: relative;
            top: 0px;
        }
        tr.line-break td:after {
            content: '';
            position: absolute;
            top: -1px;
            left: 0px;
            height: 1px;
            width: 100%;
            background-color: rgb(235,235,235);
        }
        tr.line-break td:first-child:after,
        tr.line-break td:last-child:after {
            width: calc(100% - 24px);
        }
        tr.line-break td:first-child:after {
            right: 0px;
            left: auto;
        }

        .item-cell {
            display: flex;
            align-items: center;

            .item-logo {
                margin-right: 10px;
                height: 34px;
                width: 30px;
            }
        }

        .line-break {
            position: relative;
        }

        .item-details-container {
            width: 40%;
        }

        .seller-cell {
            display: flex;
            flex-direction: column;

            span {
                padding-bottom: 4px;
            }
        }

        .ascending {
            transform: rotate(180deg);
        }
    }
}
</style>