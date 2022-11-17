<template>
    <div class="panel">
        <div class="breadcrumb-parent">
            <breadcrumb
                :routes="breadcrumbRoutes"
            />
        </div>
        <div class="main-container">
            <div class="page-container">
                <div class="sales-channel-parent">
                    <delete-rule-dialog
                        @onNo="closeDeleteModal"
                        @onYes="deleteRule"
                        ref="delete-rule-dialog"
                    />
                    <jumbotron
                        title="Global Rules"
                        btnLabel="Add Rule"
                        @btnClick="redirectToSetup"
                    ></jumbotron>
                    <search-container
                        :placeholder="'Search by Global Rule'"
                        :id="'rules-search'"
                        :value="searchInput"
                        :handleChange="searchChannels"
                        :disabled="false"
                    />
                    <loader v-if="tableData.length === 0 && !isListLoaded"/>
                    <rules-table
                        :tableData="tableData"
                        rulesType="global"
                        :isListLoaded="isListLoaded"
                        :tableHeadings="tableHeadings"
                        @onDelete="openDeleteModal"
                        @onEdit="redirectToEdit"
                    />
                    <div class="pagination-parent" v-if="tableData.length > 0 && isListLoaded">
                        <nitrozen-pagination
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
    NitrozenBadge,
} from '@gofynd/nitrozen-vue';
import RMAService from '@/services/rma.service';
import inlineSvgVue from '@/components/common/inline-svg';
import loader from '@/components/common/loader';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import Jumbotron from '@/components/common/jumbotron';
import DeleteRuleDialog from './rules-components/delete-rule-dialog.vue';
import RulesTable from './rules-components/rules-table.vue';
import SearchContainer from '@/components/packaging/common/search-container.vue';
import { debounce } from '@/helper/utils';
import Breadcrumb from './common/breadcrumb.vue';

export default {
    name: 'global-rules',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'inline-svg': inlineSvgVue,
        'loader': loader,
        'adm-no-content': AdmNoContent,
        'nitrozen-badge': NitrozenBadge,
        'jumbotron': Jumbotron,
        'delete-rule-dialog': DeleteRuleDialog,
        'rules-table': RulesTable,
        'search-container': SearchContainer,
        'breadcrumb': Breadcrumb
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
            company: this.$route.params.sales_channel,
            tableData: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 5
            },
            isListLoaded: false,
            deleteRuleData: {},
            toggleValue: false,
            searchInput: '',
            breadcrumbRoutes: [
                {
                    name: 'Return Merchandise Authorisation',
                    path: '/administrator/settings/platform/rma/rules'
                },
                {
                    name: 'Global Rules',
                    path: ''
                },
            ]
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
                page_size: paginationData.limit
            });
        },
        redirectToSetup() {
            this.$router.push({ path: `${this.globalPath}/setup`});
        },
        redirectToEdit(data) {
            const rmaRuleData = JSON.stringify({
                actions: data.actions,
                id: data.id,
                channel: data.channel, 
                meta: data.meta
            })
            if (localStorage.getItem('rma_rule_data')) localStorage.removeItem('rma_rule_data');
            localStorage.setItem('rma_rule_data', rmaRuleData);
            this.$router.push({ path: `${this.globalPath}/edit`});
        },
        deleteRule(){
            RMAService.deleteRule(this.deleteRuleData)
            .then(() => {
                this.$snackbar.global.showInfo('Rule Deleted')
                this.loadSalesChannels()
            })
            .catch((err) => {
                const msg = err.response.data.error;
                this.$snackbar.global.showInfo(msg)
            });
        },
        openDeleteModal(data){
            delete data.channel;
            this.deleteRuleData = {...data, is_active: false};
            this.$refs['delete-rule-dialog'].open();
        },
        closeDeleteModal(){
            this.$refs['delete-rule-dialog'].close();
        },
        filterRulesList(){
            RMAService.getDepartments({
                page_no: 1,
                page_size: 9999,
                search: this.searchInput,
            })
            .then(result => {
                console.log(result);
                const items = result.data.items
                return items.map(item => item.uid).join(', ');
            })
            .then((uids) => {
                console.log(uids);
                // if (this.searchInput === '') {
                //     this.loadSalesChannels()
                //     return;
                // }
                // this.loadSalesChannels({
                //     page_no: 1,
                //     page_size: 5,
                //     channel: ids,
                //     rule_type: 'global'
                // })
            })
        },
        searchChannels: debounce(function(input){ 
            this.searchInput = input
            this.filterRulesList()
        }, 300)
    },
    mounted() {
        this.loadSalesChannels();
    }
}
</script>

<style lang="less" scoped>
@import './rules-components/rules-listing.less';
</style>