<!-- SHOWS GLOBAL AND CUSTOM RULES -->
<template>
    <div class="panel">
        <drawer :direction="'right'" :exist="true" ref="RightDrawer">
            <drawer-view :data="drawerData"></drawer-view>
        </drawer>
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
                        title="Global Rule"
                        btnLabel="Add Rule"
                        :btnDisabled="tableData.length >= 1"
                        @btnClick="redirectTo('setup')"
                    ></jumbotron>
                    <!-- <custom-rules-header
                        v-if="!isGlobal"
                        :title="channelName ? channelName : ''"
                        btnLabel="Add Rule"
                        :toggleValue="showCustom"
                        @btnClick="redirectTo('setup')"
                        @onToggleClick="customListing"
                    ></custom-rules-header> -->
                    <custom-rules-header
                        v-if="!isGlobal"
                        :title="channelName ? channelName : ''"
                        btnLabel="Add Rule"
                        :toggleValue="showCustom"
                        @btnClick="redirectTo('setup')"
                    ></custom-rules-header>
                    <search-container
                        :placeholder="'Search by ID or Department'"
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
                        :isGlobal="isGlobal"
                        :showLoader="showLoader"
                        :showCustom="showCustom"
                        :tableHeadings="tableHeadings"
                        @onDelete="openDeleteModal"
                        @onEdit="redirectToEdit"
                        @onRuleClick="openDrawer"
                    />
                    <div class="pagination-parent" v-if="(tableData.length > 0 && !showLoader && !isGlobal)">
                        <nitrozen-pagination
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 10, 20, 50]"
                        ></nitrozen-pagination>
                    </div>
                    <adm-no-content
                        v-if="tableData.length === 0 && !showLoader"
                        :helperText="`No ${isGlobal ? 'Global' : 'Custom'} Rules found ${!isGlobal ? `in ${channelName}` : ''}`"
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
import Drawer from '@/components/common/drawer'
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
        'drawer': Drawer,
    },
    data(){
        return {
            isGlobal: false,
            localStorageKey: 'rma_sales_channel_data',
            defaultPath: '',
            tableHeadings: [],
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
            channelData: {},
            rulesParams: {},
            breadcrumbRoutes: [],
            departmentIds: [],
            channelId: '',
            channelIds: [],
            ruleIds: [],
            drawerData: {}
        }
    },
    methods:{
        loadRules(params = this.rulesParams){
            this.tableData = [];
            this.showLoader = true
            RMAService.getRulesList(params)
            .then((result) => {
                this.tableData = result.data.items
                this.showLoader = false
                this.pagination.total = result.data.page.item_total
            })
        },
        updateRuleParams(){
            this.rulesParams = {
                page_size: this.pagination.limit,
                page_no: this.pagination.current,
                is_deleted: false,
                channel: this.channelIds,
                department: this.departmentIds,
                id: this.ruleIds,
                rule_type: this.isGlobal ? 'global' : 'custom'
            }
        },
        paginationChange(paginationData){
            this.pagination.current = paginationData.current
            this.pagination.limit = paginationData.limit
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
                this.$router.push({ path: `${this.defaultPath}/${this.getChannelId()}/${to}`})
        },
        redirectToEdit(data) {
            const rmaRuleData = JSON.stringify({
                actions: data.actions,
                id: data.id,
                channel: data.channel, 
                meta: data.meta
            })
            localStorage.setItem('rma_rule_data', rmaRuleData)
            this.redirectTo('edit')
        },
        openDrawer(ruleData){
            if (this.$refs.RightDrawer.active) {
                this.$refs.RightDrawer.close();
            } else {
                this.$refs.RightDrawer.open();
            }
            this.drawerData = ruleData;
        },
        deleteRule(){
            RMAService.deleteRule(this.deleteRuleData)
            .then(() => {
                this.$snackbar.global.showSuccess('Rule Deleted')
                this.$refs['delete-rule-dialog'].close()
                this.loadRules()
            })
            .catch((err) => {
                const msg = 'Rule Couldn\'t be deleted'
                this.$snackbar.global.showError(msg)
                this.$refs['delete-rule-dialog'].close()
            })
        },
        openDeleteModal(data){
            this.deleteRuleData = {...data, is_deleted: true}
            this.$refs['delete-rule-dialog'].open()
        },
        closeDeleteModal(){
            this.$refs['delete-rule-dialog'].close()
        },
        // customListing(isEnabled){
        //     this.showLoader = true
        //     this.channelIds = isEnabled ? [this.getChannelId()] : []
        //     RMAService.toggleRulesType(this.channelData.id, {
        //         ...this.channelData,
        //         qc_config: isEnabled ? 'custom' : 'global'
        //     })
        //     .then(() => {
        //         this.showCustom = isEnabled
        //         this.updateLocalStorage()
        //         this.updateRuleParams() 
        //         this.setCustomTableHeader()
        //         this.loadRules()
        //     })
        // },
        setChannelData(){
            if (this.isGlobal) { return }
            this.channelData = JSON.parse(localStorage.getItem(this.localStorageKey))
            this.channelData && (this.showCustom = this.channelData.qc_config === 'custom')
            !this.channelName && (this.channelName = this.channelData.name)
        },
        updateLocalStorage(){
            localStorage.getItem(this.localStorageKey) && localStorage.removeItem(this.localStorageKey)
            const updatedJSON = JSON.stringify({
                ...this.channelData,
                qc_config: this.showCustom ? 'custom' : 'global'
            });
            localStorage.setItem(this.localStorageKey, updatedJSON)
        },
        getChannelId(){
            return this.$route.params.sales_channel ? this.$route.params.sales_channel.toString() : ''
        },
        filterRulesList({searchById = false}){
            if (this.searchInput === '') {
                this.departmentIds = []
                this.ruleIds = []
                this.pagination.current = 1
                this.updateRuleParams()
                this.loadRules()
                return
            }
            if (searchById) {
                this.ruleIds = [parseInt(this.searchInput)]
                this.updateRuleParams()
                this.loadRules()
                return
            }
            RMAService.getDepartments({
                page_no: 1,
                page_size: 9999,
                search: this.searchInput
            })
            .then(result => {
                const items = result.data.items
                return items.map(item => item.uid.toString())
            })
            .then((departmentUids) => {
                if (departmentUids.length === 0) {
                    this.tableData = []
                    this.showLoader = false
                    return
                }
                this.departmentIds = departmentUids
                this.updateRuleParams()
                this.loadRules()
            })
        },
        searchChannels: debounce(function(input){
            this.searchInput = input
            this.pagination.current = 1
            const inputStartsWithNumber = input.length >= 1 && !isNaN(parseInt(input.charAt(0)))
            if (inputStartsWithNumber){
                this.filterRulesList({searchById: true})
                return
            }
            this.showLoader = true
            this.filterRulesList({})
        }, 300),
        setBreadcrumbRoutes(){
            this.breadcrumbRoutes = [
                {
                    name: 'Return Merchandise Authorisation',
                    path: '/administrator/orders/rma/rules'
                },
                {
                    name: this.isGlobal ? 'Global Rule' : this.channelName,
                    path: ''
                }
            ]
        }
    },
    mounted() {
        this.isGlobal = this.$route.name === 'rma-global-rules'
        this.tableHeadings = this.isGlobal ? [
            'ID',
            'Department',
            'Category',
            'Quality Check',
            'Actions'
        ] : [
            'ID',
            'Department',
            'Category',
            'Quality Check',
        ]
        this.setChannelData()
        this.defaultPath = `/administrator/orders/rma/rules/${this.isGlobal ? 'global' : 'custom'}`
        this.channelId = this.getChannelId()
        this.channelIds = this.channelId ? [this.channelId] : []
        this.updateRuleParams()
        this.loadRules()
        this.setBreadcrumbRoutes()
    }
}
</script>

<style lang="less" scoped>
    @import './../less/page-header.less';
    @import './../less/page-ui.less';
    @import './rules-components/rules-listing.less';
</style>