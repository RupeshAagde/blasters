<!-- SHOWS GLOBAL AND CUSTOM RULES -->
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
                        v-if="isGlobal"
                        title="Global Rules"
                        btnLabel="Add Rule"
                        @btnClick="redirectTo('setup')"
                    ></jumbotron>
                    <custom-rules-header
                        v-if="!isGlobal"
                        :title="channelName ? channelName : 'Company'"
                        btnLabel="Add Rule"
                        @btnClick="redirectTo('setup')"
                        @toggleClick="customListing"
                    ></custom-rules-header>
                    <search-container
                        :placeholder="'Search by Custom Rule'"
                        :id="'rules-search'"
                        :value="searchInput"
                        :handleChange="searchChannels"
                        :disabled="false"
                    />
                    <div class="loader-parent" v-if="tableData.length === 0 && showLoader">
                        <loader/>
                    </div>
                    <rules-table
                        :tableData="tableData"
                        rulesType="custom"
                        :showLoader="showLoader"
                        :showCustom="showCustom"
                        :tableHeadings="tableHeadings"
                        @onDelete="openDeleteModal"
                        @onEdit="redirectToEdit"
                    />
                    <div class="pagination-parent" v-if="tableData.length > 0 && !showLoader">
                        <nitrozen-pagination
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 8, 20, 50]"
                        ></nitrozen-pagination>
                    </div>
                    <adm-no-content
                        v-if="tableData.length === 0 && !showLoader"
                        helperText="No Custom Rules found"
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
} from '@gofynd/nitrozen-vue'
import CustomRulesHeader from './rules-components/custom-rules-header'
import RMAService from '@/services/rma.service'
import inlineSvgVue from '@/components/common/inline-svg'
import loader from '@/components/common/loader'
import AdmNoContent from '@/components/common/adm-no-content.vue'
import SearchContainer from '@/components/packaging/common/search-container.vue'
import DeleteRuleDialog from './rules-components/delete-rule-dialog.vue'
import RulesTable from './rules-components/rules-table.vue'
import { debounce } from '@/helper/utils'
import Breadcrumb from './common/breadcrumb.vue'
import Jumbotron from '@/components/common/jumbotron'

export default {
    name: 'custom-rules',
    components: {
        'nitrozen-input': NitrozenInput,
        'custom-rules-header': CustomRulesHeader,
        'nitrozen-pagination': NitrozenPagination,
        'inline-svg': inlineSvgVue,
        'loader': loader,
        'adm-no-content': AdmNoContent,
        'nitrozen-badge': NitrozenBadge,
        'search-container': SearchContainer,
        'delete-rule-dialog': DeleteRuleDialog,
        'rules-table': RulesTable,
        'breadcrumb': Breadcrumb,
        'jumbotron': Jumbotron,
    },
    data(){
        return {
            isGlobal: this.$route.name === 'rma-global-rules',
            defaultPath: `/administrator/settings/platform/rma/rules/`,
            tableHeadings: this.isGlobal ? [
                'ID',
                'Department',
                'Subcategory',
                'Quality Check',
                'Actions'
            ] : [
                'ID',
                'Department',
                'Subcategory',
                'Quality Check',
            ],
            channelId: !this.isGlobal && this.$route.params.sales_channel.toString(),
            tableData: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 5
            },
            showLoader: true,
            deleteRuleData: {},
            toggleValue: false,
            showCustom: false,
            searchInput: '',
            channelName: '',
            rulesParams: {},
            breadcrumbRoutes: [
                {
                    name: 'Return Merchandise Authorisation',
                    path: '/administrator/settings/platform/rma/rules'
                },
                {
                    name: this.isGlobal ? 'Global Rules' : 'Custom Rules',
                    path: ''
                },
            ]
        }
    },
    methods:{
        loadRules(params = this.rulesParams){
            RMAService.getRulesList(params)
            .then((result) => {
                this.tableData = result.data.items
                this.showLoader = false
                !this.channelName && (this.channelName = this.tableData[0].meta.display_name);
                this.pagination.total = result.data.page.item_total
            })
        },
        paginationChange(paginationData){
            this.pagination.current = paginationData.current
            this.pagination.limit = paginationData.limit
            this.tableData = []
            this.showLoader = true
            this.loadRules({
                ...this.rulesParams,
                page_no: paginationData.current,
                page_size: paginationData.limit,
            })
        },
        redirectTo(to = 'edit') {
            this.isGlobal ?
                this.$router.push({ path: `${this.defaultPath}/${to}`})
                :
                this.$router.push({ path: `${this.defaultPath}/${this.channelId}/${to}`})
        },
        redirectToEdit(data) {
            const rmaRuleData = JSON.stringify({
                actions: data.actions,
                id: data.id,
                channel: data.channel, 
                meta: data.meta
            })
            localStorage.getItem('rma_rule_data') && localStorage.removeItem('rma_rule_data')
            localStorage.setItem('rma_rule_data', rmaRuleData)
            this.redirectTo('edit')
        },
        deleteRule(){
            RMAService.deleteRule(this.deleteRuleData)
            .then(() => {
                this.$snackbar.global.showSuccess('Rule Deleted')
                this.$refs['delete-rule-dialog'].close()
                this.loadRules()
            })
            .catch((err) => {
                const msg = err.response.data.error
                this.$snackbar.global.showError(msg)
            })
        },
        openDeleteModal(data){
            delete data.channel
            this.deleteRuleData = {...data, is_active: false}
            this.$refs['delete-rule-dialog'].open()
        },
        closeDeleteModal(){
            this.$refs['delete-rule-dialog'].close()
        },
        customListing(isEnabled){
            const ruleData = JSON.parse(localStorage.getItem('rma_custom_rule_data'))
            this.showLoader = true
            RMAService.toggleRulesType({
                ...ruleData,
                qc_config: isEnabled ? 'custom' : 'global'
            }, ruleData.id)
            .then(() => {
                this.loadRules({...this.rulesParams})
                this.showCustom = isEnabled
                isEnabled ? this.tableHeadings.push('Action') : this.tableHeadings.pop()
            })
        },
        filterRulesList({searchById = false}){
            if (this.searchInput === '') {
                this.loadRules()
                return
            }
            if (this.isGlobal){
                RMAService.getDepartments({
                    page_no: 1,
                    page_size: 9999,
                    search: this.searchInput,
                })
                .then(result => {
                    console.log(result);
                    const items = result.data.items
                    return items.map(item => item.uid.toString());
                })
                .then((uids) => {
                    this.loadRules({
                        ...this.rulesParams,
                        department: uids,
                    })
                })
                return
            }
            RMAService.getOptedSalesChannelList({
                page_no: 1,
                page_size: 9999,
                q: this.searchInput,
            })
            .then(result => {
                const items = result.data.items
                if (searchById) return [parseInt(this.searchInput)]
                return items.map(item => item.id.toString())
            })
            .then((ids) => { 
                console.log(ids)
                searchById ? this.loadRules({
                    ...this.rulesParams,
                    id: ids
                }) :
                this.loadRules({
                    ...this.rulesParams,
                    channel: ids
                }) 
            })
        },
        searchChannels: debounce(function(input){ 
            this.searchInput = input
            const inputStartsWithNumber = input.length >= 1 && !isNaN(parseInt(input.charAt(0)))
            if (inputStartsWithNumber){
                this.filterRulesList({searchById: true})
                return
            }
            this.showLoader = true
            this.filterRulesList({})
        }, 300)
    },
    mounted() {
        this.rulesParams = this.isGlobal ?
            {
                page_size: 5,
                page_no: 1,
                is_active: true
            } : {
                page_size: 5,
                page_no: 1,
                channel: [this.channelId],
                is_active: true
            }
        this.loadRules();
    }
}
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
@import './rules-components/rules-listing.less';
</style>