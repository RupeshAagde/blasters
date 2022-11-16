<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <div class="sales-channel-parent">
                    <nitrozen-dialog ref="delete-channel-dialog" class="delete-channel-dialog">
                        <template slot="body">
                            <div class="dialog-body">
                                <img src='/public/assets/svgs/yellow-alert-badge.svg'/>
                                <div class="heading">Are you sure?</div>
                                <div class="description">If you delete this sales channel, all of the applied rules will be revoked and you will be unable to retrieve them again.</div>
                            </div>
                        </template>
                        <template slot="footer">
                            <div class="dialog-footer">
                                <nitrozen-button
                                    theme="secondary"       
                                    @click="closeDeleteModal()"
                                    v-strokeBtn
                                    >No
                                </nitrozen-button>
                                <nitrozen-button
                                    theme="secondary"
                                    @click="deleteRule()"
                                    v-flatBtn
                                    >Yes
                                </nitrozen-button>
                            </div>
                        </template>
                    </nitrozen-dialog>
                    <jumbotron
                        title="Global Rules"
                        btnLabel="Add Rule"
                        @btnClick="redirectToSetup"
                    ></jumbotron>
                    <loader v-if="tableData.length === 0 && !isListLoaded"/>
                    <div v-if="tableData.length > 0 && isListLoaded" class="sales-channels-table">
                        <table class="blaster-table">
                            <tr>
                                <td v-for="(heading, index) of tableHeadings" :key="index">
                                    {{heading}}
                                </td>
                            </tr>
                            <tr v-for="(tableRow, index) of tableData" :key="index">
                                <td>{{tableRow.meta.department ? tableRow.meta.department.display_name : 'All'}}</td>
                                <td>{{tableRow.meta.l2 ? tableRow.meta.l2.display_name : 'All'}}</td>
                                <td>
                                    <nitrozen-badge :state="tableRow.qn_elabled ? 'success' : 'warn'">
                                        {{tableRow.qn_elabled ? 'Active' : 'Inactive'}}
                                    </nitrozen-badge>
                                </td>
                                <td class="table-ctas">
                                    <button class="row-cta" @click="openDeleteModal(tableRow)">
                                        <img src="/public/assets/svgs/delete_outline.svg"/>
                                    </button>
                                    <button @click="redirectToEdit" class="row-cta">
                                        <img src="/public/assets/svgs/edit_outline.svg"/>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="pagination-parent" v-if="tableData.length > 0 && isListLoaded">
                        <nitrozen-pagination
                            :name="company"
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 8, 20, 50]"
                        ></nitrozen-pagination>
                    </div>
                    <adm-no-content
                        v-if="tableData.length === 0 && isListLoaded"
                        :helperText="`No Sales Channels found for ${company}`"
                    ></adm-no-content>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenPagination,
    NitrozenDialog,
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenBadge,
} from '@gofynd/nitrozen-vue';
import RMAService from '@/services/rma.service';
import utils from './utils/rma-utils';
import inlineSvgVue from '@/components/common/inline-svg';
import loader from '@/components/common/loader';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import Jumbotron from '@/components/common/jumbotron';

export default {
    name: 'custom-sales-channel',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-button': NitrozenButton,
        'inline-svg': inlineSvgVue,
        'loader': loader,
        'adm-no-content': AdmNoContent,
        'nitrozen-badge': NitrozenBadge,
        jumbotron: Jumbotron,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data(){
        return {
            globalPath: '/administrator/settings/platform/rma/rules/global',
            tableHeadings: [
                'Department',
                'Subcategory',
                'Quality Check',
                'Action'
            ],
            company: this.$route.params.company,
            tableData: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 5
            },
            isListLoaded: false,
            deleteRuleData: {},
            toggleValue: false
        }
    },
    methods:{
        loadSalesChannels(params = {
                page_size: 5,
                page_no: 1,
                rule_type: 'global'
            }){
            RMAService.getRulesList(params)
            .then((result) => {
                this.tableData = result.data.items
                this.isListLoaded = true
                this.pagination.total = result.data.page.item_total
            })
        },
        paginationChange(paginationData){
            this.pagination.current = paginationData.current;
            this.pagination.limit = paginationData.limit;
            this.tableData = [];
            this.isListLoaded = false;
            this.loadSalesChannels({
                page_no: paginationData.current,
                page_size: paginationData.limit,
                platform: this.company
            });
        },
        redirectToSetup() {
            this.$router.push({ path: `${this.globalPath}/setup`});
        },
        redirectToEdit() {
            this.$router.push({ path: `${this.globalPath}/edit`});
        },
        deleteRule(){
            RMAService.deleteRule(this.deleteRuleData)
            .then(() => {
                this.loadSalesChannels();
                this.$refs['delete-channel-dialog'].close();
            })
            .catch((err) => {
                const msg = err.response.data.error;
                this.$snackbar.global.showInfo(msg)
            });
        },
        openDeleteModal(data){
            delete data.channel;
            console.log(data);
            this.deleteRuleData = {
                ...data,
                is_active: false
            };
            this.$refs['delete-channel-dialog'].open({
                neutralButtonLabel: false,
                width: '383px'
            });
        },
        closeDeleteModal(){
            this.$refs['delete-channel-dialog'].close();
        },
        customListing(e){
            
        }
    },
    mounted() {
        this.loadSalesChannels();
        utils.foo();
    }
}
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.page-container {
    margin: 0;
    flex-direction: column;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }
    .header-container {
        font-family: Inter;
        align-items: center;
        display: flex;
        justify-content: space-between;
        background-color: @White;

        .caption-container {
            display: flex;
            flex-direction: column;

            .caption-title {
                color: @Mako;
                font-weight: bold;
                font-size: 24px;
                line-height: 40px;
                text-align: left;
            }
            .caption-description {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 16px;
            }
        }
    }
}
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

.sales-channels-table{
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
.blaster-table{
    border: none;
    tr:first-child{
        border-top: none;
        border-inline: none;
    }
    tr:last-child{
        border-bottom: none;
    }
    td{
        width: 22%;
    }
}
.nitrozen-dialog{
    border-radius: 12px;
    .dialog-body{
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 40px;
        padding-inline: 16px;
    
        img{
            width: 50px;
            margin-bottom: 16px;
        }
    
        .heading{
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .description{
            font-size: 12px;
            font-weight: 400;
            color: #666666;
        }
    }
}

::v-deep .nitrozen-dialog-footer{
    justify-content: center !important;
    padding-bottom: 16px;

    div{
        display: flex;
        justify-content: center;
        gap: 20px;
        width: 90%;

        button{
            width: 100%;
        }
    }
}

.pagination-parent{
    margin-top: 24px;
}
</style>