<template>
    <div class="sales-channel-parent">
        <jumbotron
            :title="'Company - FYND'"
            btnLabel="Add New"
            @btnClick="redirectToSetup"
        ></jumbotron>
        <table class="mirage-table">
            <tr>
                <td v-for="(heading, index) of tableHeadings" :key="index">
                    {{heading}}
                </td>
            </tr>
            <tr v-for="(tableRow, index) of tableData" :key="index">
                <td>{{tableRow.channel}}</td>
                <td>{{tableRow.category}}</td>
                <td>{{tableRow.Subcategory}}</td>
                <td>{{tableRow.qc}}</td>
                <td class="table-ctas">
                    <button class="row-cta">
                        <img src="/public/assets/svgs/delete_outline.svg"/>
                    </button>
                    <button @click="redirectToEdit" class="row-cta">
                        <img src="/public/assets/svgs/edit_outline.svg"/>
                    </button>
                </td>
            </tr>
        </table>
        <div class="pagination-parent">
            <nitrozen-pagination
                name="FYND"
                v-model="pagination"
                @change="paginationChange"
                :pageSizeOptions="[5, 10, 20, 50]"
            ></nitrozen-pagination>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenPagination
} from '@gofynd/nitrozen-vue';
import Jumbotron from '@/components/common/jumbotron';
import RMAService from '@/services/rma.service';

export default {
    name: 'sales-channel',
    components: {
        'nitrozen-input': NitrozenInput,
        'jumbotron': Jumbotron,
        'nitrozen-pagination': NitrozenPagination
        // 'inline-svg': InlineSvg,
    },
    data(){
        return {
            tableHeadings: [
                'Sales Channel',
                'Category',
                'Subcategory',
                'QC',
                'Action'
            ],
            company: this.$route.params.company,
            tableData: [
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Mobile',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Tabs',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Computer. Laptop',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Computer, Accesories',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Mobile, Accesories, Charger',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Smart Watch',
                    qc: 'Inactive',
                },
                {
                    channel: 'Amazon',
                    category: 'Electronics',
                    Subcategory: 'Mobile, Accesories, Cover',
                    qc: 'Inactive',
                },
                
            ],
            pagination: {
                total: 50,
                current: 1,
                limit: 10
            }
        }
    },
    methods:{
        paginationChange(){
            
        },
        redirectToSetup() {
            this.$router.push({ path: `/administrator/rma/rules/${this.company}/setup` });
        },
        redirectToEdit() {
            this.$router.push({ path: `/administrator/rma/rules/${this.company}/edit` });
        }
    },
    mounted() {
        RMAService.getSalesChannel()
        .then((data) => {
            console.log(data);
        })
    }
}
</script>

<style lang="less" scoped>
.jumbotron-container{
    border: none;
    border-bottom: 1px solid #E1E1E1;
    padding: 0;
    padding-bottom: 24px;
    margin-bottom: 22px;
}

.table-ctas{
    display: flex;
    gap: 16px;
    
    .row-cta{
        border: 1px solid #8F8F8F;
        height: 29px;
        width: 29px;
        background: none;
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
.pagination-parent{
    margin-top: 24px;
}
.mirage-table {
    width: 100%;
    font-family: Inter;
    font-size: 12px;
    border: 1px solid @Iron;
    border-radius: 4px;

    tr:first-child {
        background: #f6f6f6;
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        border-radius: 4px;
        font-family: Inter;
        font-size: 12px;
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
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: center;
        // opacity: 0.5;
        color: grey;
    }
    td {
        vertical-align: middle;
        text-align: left;
        padding: 16px 16px;
        .edit-btn {
            float: left;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }
    }
    .first-col {
        font-weight: 500;
    }
}
</style>