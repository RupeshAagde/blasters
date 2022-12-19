<template>
    <div v-if="tableData.length > 0 && !showLoader" class="rules-table">
        <table class="blaster-table">
            <tr>
                <td v-for="(heading, index) of tableHeadings" :key="index">
                    {{heading}}
                </td>
            </tr>
            <tr v-for="(tableRow, index) of tableData"
                :key="index" :class="{'global-rule': !showCustom && !isGlobal}"
                @click="(function(){
                    !showCustom && !isGlobal && ($emit('onEdit', tableRow))
                })()">
                <td>{{tableRow.id}}</td>
                <td>{{tableRow.meta.department ? tableRow.meta.department ? tableRow.meta.department.display_name ? tableRow.meta.department.display_name : 'All' : '' : 'All'}}</td>
                <td>{{tableRow.meta.l3 ? tableRow.meta.l3.display_name : 'All'}}</td>
                <td>
                    <nitrozen-badge :state="tableRow.qc_enabled ? 'success' : 'warn'">
                        {{tableRow.qc_enabled ? 'Active' : 'Inactive'}}
                    </nitrozen-badge>
                </td>
                <td class="table-ctas" v-if="isGlobal || showCustom">
                    <button class="row-cta delete" @click="$emit('onDelete', tableRow)">
                        <img src="/public/assets/svgs/delete_outline.svg"/>
                    </button>
                    <button @click="$emit('onEdit', tableRow)" class="row-cta edit">
                        <img src="/public/assets/svgs/edit_outline.svg"/>
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import {
    NitrozenBadge
} from '@gofynd/nitrozen-vue';
export default {
    name: 'rules-table',
    props: {
        isGlobal: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: [],
        },
        showLoader: {
            type: Boolean,
            default: false
        },
        showCustom: {
            type: Boolean,
            default: false
        },
        tableHeadings: {
            type: Array,
            default: []
        }
    },
    components: {
        'nitrozen-badge': NitrozenBadge
    }
}
</script>
<style scoped lang="less">
.rules-table{
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
.table-ctas{
    display: flex;
    gap: 16px;
    
    .row-cta{
        border: 1px solid #8F8F8F;
        height: 29px;
        width: 29px;
        background: white;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        .flex-center();
    
        /deep/img {
            height: 18px;
            width: 18px;
        }
    }
}
.blaster-table{
    border: none;
    tr:first-child{
        border-top: none;
        border-inline: none;
    }
    .global-rule{
        transition: 0.2s;
        position: relative;
        cursor: pointer;
    }
    tr:last-child{
        border-bottom: none;
    }
    td{
        width: 22%;
    }
    td:last-child{
        width: 5%;
    }
}
</style>