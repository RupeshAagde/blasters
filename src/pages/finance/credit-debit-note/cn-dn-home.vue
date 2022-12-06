<template>
    <div v-if="!isBulkUpload" class="cn-container">
        <div class="above-table">
            <div class="filters">
                <!-- Filters {{ noteType }} -->
                <nitrozen-input
                    :showSearchIcon="true"
                    class="search filter-input-lg"
                    type="search"
                    :placeholder="`Search by ${searchPlaceholder}`"
                    v-model="search"
                    @input="searchByInput"
                ></nitrozen-input>
                <!-- @change="changeFilterType" -->
                <nitrozen-dropdown
                    id="search-status"
                    class="filter-type filter-input-sm"
                    :items="modifiedFilterList"
                    :searchable="true"
                    v-model="filterType"
                    @searchInputChange="searchStatus($event)"
                    @change="autoSearchStatus()"
                    placeholder="Status"
                >
                </nitrozen-dropdown>
                <nitrozen-dropdown
                    class="filter-type filter-input-sm"
                    :items="modifiedNoteItems"
                    :searchable="true"
                    v-model="noteTypeValue"
                    @searchInputChange="changeNoteType($event)"
                    @change="autoSearchNote()"
                    placeholder="Note Type"
                >
                </nitrozen-dropdown>
                <date-picker
                    class="date-picker filter-input-sm"
                    picker_type="date"
                    placeholder="Created At"
                    date_format="MMM Do, YY"
                    v-model="reconDate"
                    :clearable="true"
                    :range="true"
                    :not_before="notBefore"
                    :shortcuts="dateRangeShortcuts"
                    :not_after="new Date().toISOString()"
                    :useNitrozenTheme="true"
                    @input="dateRangeChange"
                />
            </div>
            <div class="cn-buttons" v-if="!isApprover">
                <!-- <nitrozen-button 
                    theme="secondary"
                    :disabled="true"
                    v-strokeBtn
                    @click="routeNoteCheck('BULK_UPLOAD')"
                > Bulk Upload
                </nitrozen-button> -->
                <nitrozen-button 
                theme="secondary"
                v-flatBtn
                @click="routeNoteCheck()"
                > Create New
                </nitrozen-button>
            </div>
            <div class="cn-buttons" v-if="isApprover">   <!-- //////// UPCOMING CHANGES //////////// -->
                    <nitrozen-button
                        v-strokeBtn
                        theme="secondary"
                        @click="quickApproverViewSection('Reject')"
                        :disabled="isDisabled.Reject"
                    >
                        Reject
                    </nitrozen-button>
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        @click="quickApproverViewSection('Approve')"
                        :disabled="isDisabled.Approve"
                    >
                        Approve
                    </nitrozen-button>
            </div>
        </div>
        <div v-if="inProgress">
            <loader class="loading"></loader>
        </div>
        <div v-else>
            <table
                class="mirage-table"
            >
                <tr>
                    <td v-if="isApprover"> <!-- //////// UPCOMING CHANGES //////////// -->
                        <nitrozen-checkbox
                            :disabled="true"
                        >
                            
                        </nitrozen-checkbox>
                    </td>
                    <td
                        v-for="(col, index) in tableColumns"
                        :key="'col-' + index"
                    >
                        {{ col }}
                    </td>
                </tr>
                <template>
                    <!-- tableDataItems 
                        v-for="(tab, index) in tableDataItems"
                        :key="'tab-' + index"
                    -->
                    <tr
                        v-for="(tab, index) in tableDataItems"
                        :key="'tab-' + index"
                    >
                        <template>
                            <td v-if="isApprover" class="icon-eye"> <!-- //////// UPCOMING CHANGES //////////// -->
                                <nitrozen-checkbox
                                    :v-model="tab"
                                    @change="select(tab), disableButton()"
                                    :multiple="false"
                                    :disabled="tab.approved_at !== null"
                                >
                                </nitrozen-checkbox>
                            </td>
                            <td> {{ tab.document_number }} </td>
                            <td> {{ tab.seller_name }} </td>
                            <td> {{ tab.total_amount }} </td>
                            <td> {{ tab.category }} </td>
                            <td> {{ dateFormatted(tab.created_at) }} </td>
                             <td v-if="!isApprover"> 
                                 <span v-if="tab.approved_at">
                                    {{ dateFormatted(tab.approved_at) }}
                                </span>
                                <span v-else > - </span>
                            </td>
                            <td v-else class="long-text"> 
                               <span v-if="tab.note_narration">
                                    {{ tab.note_narration }}
                                </span>
                                <span v-else > - </span>
                            </td>
                            <td>
                                <nitrozen-badge
                                    v-if="tab.status === 'Approved' || tab.status === 'approved'"
                                    state="success"
                                > APPROVED </nitrozen-badge>
                                <nitrozen-badge
                                    v-if="tab.status === 'Init' || tab.status === 'Pending' || tab.status === 'init' || tab.status === 'pending'"
                                    state="warn"
                                > PENDING </nitrozen-badge>
                                <nitrozen-badge
                                    v-if="tab.status === 'Rejected' || tab.status === 'rejected'"
                                    state="error"
                                > REJECTED </nitrozen-badge>
                            </td>
                            <td class="icons">
                                <span 
                                    class="cursor-pointer icon-eye"
                                    @click="previewNote(tab)"
                                >
                                    <adm-inline-svg src="eye-open"></adm-inline-svg>
                                </span>
                                <span 
                                    class="cursor-pointer icon-edit"
                                    v-if="!isApprover && tab.status === 'Init' || tab.status === 'Pending'"
                                    @click="editNote(tab)"
                                >
                                    <ukt-inline-svg src="edit-blue"></ukt-inline-svg>
                                </span>
                                <span 
                                    class="cursor-pointer icon-delete"
                                    v-if="!isApprover && tab.status === 'Init' || tab.status === 'Pending'"
                                    @click="deleteNote(tab)"
                                >
                                    <ukt-inline-svg src="delete-red"></ukt-inline-svg>
                                </span>
                                <span
                                    class="cursor-pointer icon-eye"
                                    v-if="tab.status === 'Approved' || tab.status === 'approved'"
                                    @click="downloadNote(tab)"
                                >
                                    <ukt-inline-svg src="download"></ukt-inline-svg>
                                </span>
                            </td>
                        </template>
                    </tr>
                </template>
            </table>
        </div>
        <div class="pagination-div">
            <nitrozen-pagination
                :name ="paginationName"
                v-model="pageObject"
                @change="handlePageChanges"
                :pageSizeOptions="[10, 20, 50, 100]"
            >
            </nitrozen-pagination>
            
        </div>
        
        <transition name="slide">   <!-- //////// UPCOMING CHANGES //////////// -->
            <template v-if="quickApproveView">
                <div class="slide-fade" ref="slide-fade" @click="close($event)">
                    <div class="container">
                        <approver-drawer
                            @drawerClose = "closeApproverDrawerView($event)"
                            :status = "drawerData.status"
                            :notesSet = "drawerData.notesSet"
                        ></approver-drawer>
                        
                        <a class="cancel-btn" @click="close($event)">
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>
    </div>
    <!-- <div v-else>  //////// UPCOMING CHANGES ////////////
    <BulkUploadVue  @is-bulk-upload-open="closeBulkUpload($event)" :noteType="this.noteType"></BulkUploadVue>
    </div> -->
</template>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenBadge,
    NitrozenTab,
    NitrozenInput,
    NitrozenCheckBox,
   // NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import DatePicker from '@/components/common/date-picker.vue';
import admInlineSVG from '@/components/common/adm-inline-svg';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import CreditDebitNoteServices from '@/services/cn-dn.service';
import { debounce } from '@/helper/utils';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import loader from '@/components/common/loader';
import moment from 'moment';
import { mapGetters } from 'vuex'
import ApproverDrawer from './approver-drawer.vue';
//import BulkUploadVue from './bulk-upload-creator.vue';
import { GET_USER_INFO, GET_USER_PERMISSIONS } from '@/store/getters.type'

const PAGINATION_OBJECT = {
    limit: 10,
    current: 0,
    total: 0,
};

export default {
    name: 'credit-note-main',
    components: {
      'nitrozen-tab': NitrozenTab,
      NitrozenButton,
      NitrozenPagination,
      NitrozenBadge,
      NitrozenDropdown,
      NitrozenInput,
      DatePicker,
      UktInlineSvg,
      //NitrozenToggleBtn,
      'nitrozen-checkbox':NitrozenCheckBox,
      'adm-inline-svg': admInlineSVG,
      loader,
      ApproverDrawer,
      //BulkUploadVue
    },
    directives: {
      flatBtn,
      strokeBtn
    },
    props: {
      noteType: String,
      isBulkUpload: Boolean
    },
    data (){
      return {
        //noteType: '',
        tab: [],
        isDisabled: {Reject:true, Approve:true},
        drawerData: {
            notesSet: {},
            status: ''
        },
        isApprover: false,
        isCreator: false,
        initialPayload: {},
        filterType: '',
        filterTypeList: [
            {
                text: 'Approved',
                value: 'approved'
            },
            {
                text: 'Pending',
                value: 'Init'
            },
            {
                text: 'Rejected',
                value: 'rejected'
            },
        ],
        modifiedFilterList: [],
        modifiedNoteItems :[],
        noteTypeValue: '',
        noteTypeItems: [
            {
                text: 'Commercial',
                value: 'commercial'
            },
            {
                text: 'GST Service',
                value: 'gst_service'
            },
            {
                text: 'GST Fee',
                value: 'gst_fee'
            }
        ],
        search: '',
        searchPlaceholder: 'Request No, Seller Name',
        tableColumns: ['Request No.','Seller Name','Amount','Note Type','Created At','Approved/Rejected At','Note Narration','Status','Action'],
        tableDataItems:[],
        pageObject: { ...PAGINATION_OBJECT },
        reconDate: [
          /* moment().subtract(1, 'weeks').toISOString(),
          moment().toISOString(), */
        ],
        dateRangeShortcuts: [...dateRangeShortcuts],
        notBefore: moment().subtract(3, 'months').toISOString(),
        fromDate: '',
        toDate: '',
        inProgress: false,
        quickApproveView: false,
        paginationName: 'Credit Note',
      }
    },
    computed: {
        ...mapGetters({
            userData: GET_USER_INFO,
            //isLoggedIn: IS_LOGGED_IN,
            currentUserPermissions: GET_USER_PERMISSIONS
        }),
    },
    mounted() {
        console.log(this.currentUserPermissions);
        if (this.currentUserPermissions.permissions.includes('credit-debit-note-create') && this.currentUserPermissions.permissions.includes('credit-debit-note-approve')) {
            this.isApprover = true;
        } else {
            if (this.currentUserPermissions.permissions.includes('credit-debit-note-create')) {
                this.isCreator = true;
            }
            if (this.currentUserPermissions.permissions.includes('credit-debit-note-approve')) {
                this.isApprover = true;
            }
        }
        
        
        this.getInitialListingPayload();
        this.getListData();
        if(this.noteType === 'credit'){
                this.paginationName = 'Credit Note'
            } else {
                this.paginationName = 'Debit Note'
        }
        this.modifiedFilterList = this.filterTypeList
        this.modifiedNoteItems = this.noteTypeItems
        this.checkForAllowedColumn();
    },
    methods: {
        closeBulkUpload(e){
          this.$emit('is-bulk-upload-open', e);
        },
        checkForAllowedColumn() {
            if(!this.isApprover){
                   this.tableColumns = this.tableColumns.filter((col) => col !== 'Note Narration')
            } else{
                this.tableColumns = this.tableColumns.filter((col) => col !== 'Approved/Rejected At')
            }
        },
        disableButton() {
            if(this.tab.length === 0){
                this.isDisabled.Reject = true;
                this.isDisabled.Approve = true;
            } else{
                this.isDisabled.Reject = false;
                this.isDisabled.Approve = !(
                    (Object.keys(this.drawerData.notesSet).length === 1) &&
                    (
                        ((this.drawerData.notesSet[Object.keys(this.drawerData.notesSet)[0]]).length === 1) ||
                        (Object.keys(this.drawerData.notesSet)[0] === 'commercial')
                    )
                );
            }
        },
        updateDrawerData(tab, add) {
            if(add){
                if(tab['category'] in this.drawerData.notesSet){
                    this.drawerData.notesSet[tab['category']].push({
                        'sellerName' : tab['seller_name'],
                        'noteId' : tab['id'],
                        'requestNo' : tab['document_number'],
                        'grossAmount' : tab['total_amount']
                    })
                } else{
                    this.drawerData.notesSet[tab['category']]=[{
                        'sellerName' : tab['seller_name'],
                        'noteId' : tab['id'],
                        'requestNo' : tab['document_number'],
                        'grossAmount' : tab['total_amount']
                    }]
                }
            } else{
                let i = 0;
                for(i; i<this.drawerData.notesSet[tab['category']].length; i++){
                    if(this.drawerData.notesSet[tab['category']][i].requestNo == tab['document_number']){
                        break;
                    }
                }
                this.drawerData.notesSet[tab['category']].splice(i,1);
                if((this.drawerData.notesSet[tab['category']]).length == 0){
                    delete this.drawerData.notesSet[tab['category']];
                }
            }
        },
        select(tab) {
            if((this.tab).indexOf(tab.document_number) != -1){
                (this.tab).splice((this.tab).indexOf(tab.document_number),1);
                this.updateDrawerData(tab, false);
            } else {
                (this.tab).push(tab.document_number);
                this.updateDrawerData(tab, true);
            }
        },
        closeApproverDrawerView(event){
            this.quickApproveView = false;
            if(event != false){
                this.drawerData = {
                    notesSet: {},
                    status: ''
                };
                this.tab = [];
                this.getListData();
            }
        },
        searchByInput: debounce(function (e) {
            this.initialPayload.data.page = 1;
            this.initialPayload.data.pageSize = this.pageObject.limit;
            this.pageObject.current = 1;
            this.initialPayload.data['search'] = {...this.initialPayload.data['search'], ...{seller_name: this.search, document_number: this.search}};
            this.getListData();
        }, 1000),
        dateFormatted(e){
            return moment(e).format('DD-MM-YYYY');
        },
        getInitialListingPayload(){
            let filters = {};
            if (this.isApprover) {
                filters = {
                    note_type:this.noteType,
                    is_active : true
                }
            } else {
                filters = {
                    note_type:this.noteType,
                    is_active : true,
                    created_by: this.userData.user.username,
                }
            }
            this.initialPayload = {
                data:{
                    table_name:"credit_debit_note",
                    page: 1,
                    pageSize: this.pageObject.limit,
                    filters: filters,
                    project:[
                        "document_number",
                        "seller_name",
                        "total_amount",
                        "category",
                        "created_at",
                        "approved_at",
                        "status",
                        "id",
                        "note_narration"
                    ],
                    "search":{},
                    order_by:"created_at Desc"
                }
            }
            if(!this.isApprover){
               let projectList =  this.initialPayload.data.project
               projectList = projectList.filter(val => val !== "note_narration");
               this.initialPayload.data.project = projectList
            }

        },
        getListData(){
            this.inProgress = true;
            const caller = CreditDebitNoteServices.getListData(this.initialPayload); //api integretion
            caller
                .then((res) => {
                    this.tableDataItems = res.data.items;
                    this.pageObject.total = res.data.page.item_count;
                })
                .catch((err) => {
                    /* this.$snackbar.global.showError(
                        `Failed due to ${err?.message}`
                    ); */
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        handlePageChanges(e) {
            this.pageObject = e;
            this.tab = [];
            this.drawerData.notesSet = {};
            this.disableButton();

            //this.getListData(); api call will be made for correct pagination
            const query = {
                page: this.pageObject.current,
                limit: this.pageObject.limit,
            };
            this.setRouteQuery(query);
        },
        setRouteQuery: function (query) {
            if (
                query.search ||
                query.status ||
                query.page ||
                query.limit ||
                query.from_date ||
                query.to_date
            ) {
                this.$router
                    .push({
                        path: this.$route.path,
                        query: {
                            ...this.$route.query,
                            ...query,
                        },
                    })
                    .catch(() => {});
            }

            if(query.page && query.limit){
                this.initialPayload.data.page = this.pageObject.current;
                this.initialPayload.data.pageSize = this.pageObject.limit;
                this.getListData();
            }

            /* if(query.search && query.page){
                this.initialPayload.data.page = query.page;
                this.initialPayload.data['search'] = {...this.initialPayload.data['search'], ...{seller_name: this.search}};
                this.getListData();
            } */
        },
        changeFilterType(){
            this.filterType = '';
            delete this.initialPayload.data.filters.status;
            this.getListData();
        },
        changeNoteType(e){
            this.modifiedNoteItems = this.noteTypeItems.filter((x) =>
               x.text.toLowerCase().includes(e.text.toLowerCase())
            );
            if(this.modifiedNoteItems.length == this.noteTypeItems.length) {
               delete this.initialPayload.data.filters.category;
               this.getListData();
            }
        },

        autoSearchNote(){
            if(this.noteTypeValue){
                this.initialPayload.data.page = 1;
                this.initialPayload.data.pageSize = this.pageObject.limit;
                this.pageObject.current = 1;
                this.initialPayload.data['filters'] = {...this.initialPayload.data['filters'], ...{category: this.noteTypeValue}};
                this.getListData();
            }
        },
         autoSearchStatus(){
            if(this.filterType){
                this.initialPayload.data.page = 1;
                this.initialPayload.data.pageSize = this.pageObject.limit;
                this.pageObject.current = 1;
                this.initialPayload.data['filters'] = {...this.initialPayload.data['filters'], ...{status: this.filterType}};
                this.getListData();
            }
            
        },
        searchStatus(e) {
            this.modifiedFilterList = this.filterTypeList.filter((x) =>
               x.text.toLowerCase().includes(e.text.toLowerCase())
            );
            if(this.modifiedFilterList.length == this.filterTypeList.length) {
                delete this.initialPayload.data.filters.status
                this.getListData();
            }
          },
        dateRangeChange() {
            const to_date = this.reconDate[1].length > 0 ? moment(this.reconDate[1]).format('DD-MM-YYYY') : '';
            const from_date = this.reconDate[0].length > 0 ? moment(this.reconDate[0]).format('DD-MM-YYYY') : '';
            this.fromDate = from_date;
            this.toDate = to_date;
            if(this.fromDate.length && this.toDate.length){
                this.initialPayload.data.page = 1;
                this.initialPayload.data.pageSize = this.pageObject.limit;
                this.pageObject.current = 1;
                this.initialPayload.data.filters['created_at'] = {...this.initialPayload.data.filters['created_at'], ...{from: moment(this.reconDate[0]).format('DD-MM-YYYY'), to: moment(this.reconDate[1]).format('DD-MM-YYYY')}};
                this.getListData();
            }
            else{
                delete this.initialPayload.data.filters.created_at;
                this.getListData();
            }
        },
        deleteNote(item){
            let param = {
                data:{
                    note_id: item.id,
                }
            }
            const caller = CreditDebitNoteServices.getNoteDetails(param); //api integretion
            caller
                .then((res) => {
                    let entityData = res.data.items;
                    entityData.note_details = entityData.note_details.map(item => {
                        return{ ...item, is_active: false };
                    });
                    let payload = {
                        data: {
                            type_of_request:"delete_entity",
                            item: { ...entityData, is_active: false }
                        }
                    }
                    const deleted = CreditDebitNoteServices.getEntity(payload);
                    deleted
                        .then((res) => {
                            this.getListData();
                            this.$snackbar.global.showSuccess(
                                `Note deleted successfully`
                            );
                        })
                        .catch((err) => {
                            this.$snackbar.global.showError(
                                `Failed to delete as ${err}`
                            );
                        })
                        .finally(() => {
                        })
                })
                .catch((err) => {
                    /* this.$snackbar.global.showError(
                        `Failed due to ${err?.message}`
                    ); */
                })
                .finally(() => {
                    this.inProgress = false;
                });

        },
        async downloadNote(item) {
            let param = {
                data:{
                    note_id: item.id,
                }
            }
            
            const res = await CreditDebitNoteServices.downloadNote(param);
            if(res.data.data.url === false) {
                this.$snackbar.global.showError(
                    'PDF does not exist'
                );
            } else {
                window.open(res.data.data.url)
            }
        },
        routeNoteCheck(action){
            if(action ===  "BULK_UPLOAD"){
               this.$emit('is-bulk-upload-open', true);
            }else{
            //this.$router.push({ path: 'debit-note' ,query: { note_type: 'debit' }});
            this.$router.push({ name: 'credit-note', params:{noteType: this.noteType } });
            }
        },
        editNote(tab){
            this.$router.push({ name: 'credit-note', params:{ noteType: this.noteType, noteId: tab.id,preview: 'edit', isApprover: this.isApprover, documentNo: tab.document_number } });
        },
        previewNote(tab){
            this.$router.push({ name: 'credit-note', params:{ noteType: this.noteType, noteId: tab.id, preview: 'preview', isApprover: this.isApprover, documentNo: tab.document_number } });
        },
        close: function (e) {
            e.stopPropagation();
            this.quickApproveView = false;
        },
        quickApproverViewSection: function (action) {
            this.quickApproveView = !this.quickApproveView;
            this.drawerData.status = action;
        },
    }
}
</script>

<style lang="less" scoped>
.cn-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    //overflow: scroll;
    
    //position: absolute;
    .loading{
        position: unset;
        background: transparent;
    }
    .above-table{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .filters {
            display: flex;
            width: 65%;
            height: 64px;
            justify-content: space-evenly;
            //gap: 10px;
            align-items: center;
            padding: 0 10px;
            background: #F8F8F8;

            .filter-input-lg {
                width: 40%;
            }

            .filter-type {
                width: 125px;
            }
        }

        .cn-buttons {
            display: flex;
            gap: 20px;
        }
    }

    .mirage-table {
        width: 100%;
        margin-bottom: 24px;
        font-family: Inter, sans-serif;
        font-size: 14px;
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
        }
        tr:not(:first-child) {
            border-bottom: 1px solid @Iron;
        }
        td {
            text-align: center;
            padding: 16px 6px;
        }
        td:last-child {
            text-align: left;
            width: 100px;
        }
        .icons {
            display: flex;
            gap: 10px;
            align-items: center;
        }
    }
}

.long-text{
    text-overflow: ellipsis;
    white-space: nowrap;
    /* width: 160px; */
    max-width: 226px;
    overflow: hidden;
    line-height: 20px;
}

.cursor-pointer{
    /* &:hover {
        cursor: pointer;
    } */
    cursor: pointer;
}
.icon-eye{
    padding-right: 4px;
    ::v-deep svg {
        width: 16px;
        height: 16px;
        #prefix__Eye_Open {
            stroke: @RoyalBlue;
            stroke-width: 2;
        }
    }
    /* &:hover {
        ::v-deep svg {
            //box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
            #prefix__Eye_Open {
                stroke: @RoyalBlue;
            }
        }
    } */
}

.icon-edit {
    ::v-deep svg {
        rect {
            display: none;
        }
    }
}

.icon-delete {
    ::v-deep svg {
        rect {
            display: none;
        }
    }
}

.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    .container {
        position: absolute;
        right: 0px;
        width: 33%;
        height: 100%;
        background: @White;
        /* overflow-y: scroll;*/
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            cursor: pointer;
        }
    }
}

/* .page-container {
  width: 95%;
  margin: 0 auto;
  display: block;
  //background: transparent;

  padding: 24px 16px;

  .group-name-container {
    margin-bottom: 24px;
    .group-tab {
      border-bottom: 1px solid #e4e5e6;
      /deep/.nitrozen-tab {
          padding: 0px;
      }
    }
  }
} */
</style>
