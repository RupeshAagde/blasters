<template>
    <div class="panel">

        <page-header
            :title=title
            @backClick="goBackDialog"
        >
            <div v-if="noteId" class="tab-header">
                <nitrozen-badge v-if="tab.status === 'Approved' || tab.status === 'approved'" state="success">
                    {{ tab.status }}
                </nitrozen-badge>
                <nitrozen-badge v-if="tab.status === 'Init' || tab.status === 'Pending'" state="warn">
                    Pending
                </nitrozen-badge>
                <nitrozen-badge v-if="tab.status === 'Rejected' || tab.status === 'rejected'" state="error">
                    {{ tab.status }}
                </nitrozen-badge>
                <nitrozen-button
                    v-flatBtn
                    theme="secondary"
                    v-if = "   
                        readOnlyMode && 
                        (tab.status === 'Init' || tab.status === 'Pending') &&
                        !isPreview
                    "
                    @click.stop.native="editMode()"
                >
                    Edit
                </nitrozen-button>
                
                <div class="approver-buttons" v-if="isApprover === true">
                    <nitrozen-button
                        v-strokeBtn
                        theme="secondary"
                        :disabled="tab.approved_at !== null"
                        @click="quickApproverViewSection('Reject')"
                    >
                        Reject
                    </nitrozen-button>
                    <nitrozen-button
                        v-flatBtn
                        theme="secondary"
                        :disabled="tab.approved_at !== null"
                        @click="quickApproverViewSection('Approve')"
                    >
                        Approve
                    </nitrozen-button>
                </div>
                <nitrozen-button
                    v-flatBtn
                    v-if="!readOnlyMode"
                    theme="secondary"
                    @click.stop.native="saveCN('edit_entity')"
                    :disabled="disableEdit()"
                >
                    Save Changes
                </nitrozen-button>
            </div>
            <nitrozen-button
                v-flatBtn
                v-else
                theme="secondary"
                @click.stop.native="saveCN('create_entity')"
                :disabled="disableSave()"
            >
                Save
            </nitrozen-button>
            
        </page-header>
        
        <div class="main-container">
            <mirage-alert type="error" v-if="noteId && (tab.status === 'Rejected' || tab.status === 'rejected')">
                <div class="mirage-content">
                    <div class="first-row">
                        <div class="heading">
                            Rejection Reason
                        </div>
                         <div class="reject-date">
                             Rejected on {{ dateFormatted(tab.approved_at) }}
                         </div>
                    </div>
                    <div class="second-row">
                        {{ tab.approver_remark }}
                    </div>
                </div>
            </mirage-alert>

            <div class="top-wrap">

                <div class="first">
                    <!-- Note Type -->
                    <label class="label">{{dropdownLabel}}</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            v-model="selectedType"
                            placeholder="Search Note Type"
                            :items="filteredCnTypes"
                            :disabled="readOnlyMode || editingMode"
                            @change="resetForm"
                        ></nitrozen-dropdown>
                    <!-- <nitrozen-error v-if="isEmpty(selectedType)">Please Select a Note Type</nitrozen-error> -->
                </div>

                <div class="date-picker-wrap">
                        <date-picker
                            class="date-picker filter-input-dr"
                            picker_type="date"
                            label="Select Date"
                            date_format="MMM Do, YY"
                            v-model="uploadDateRange"
                            :clearable="false"
                            :not_before="notBefore"
                            :not_after="new Date().toISOString()"
                            :useNitrozenTheme="true"
                            @input="onFilterChange"
                        /> 
                </div>
                <span>{{ noteDesc }}</span>
            </div>
            <div class="commercial-cn" v-show="selectedType === 'commercial'">
                
                <div class="second">

                    <div class="row-1">
                        <div class="input-field seller-id">
                            <nitrozen-input
                                label="Seller ID"
                                placeholder="Enter Seller ID"
                                v-model="sellerId.value"
                                :required="isRequired"
                                @keyup.enter="getSellerDetails"
                                @blur="getSellerDetails"
                                :disabled="readOnlyMode || editingMode"
                            ></nitrozen-input>
                            <nitrozen-error v-if="sellerId.errorMessage">{{ sellerId.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="input-field seller-name">
                            <nitrozen-input
                                label="Seller Name"
                                placeholder="Seller Name"
                                v-model="sellerName"
                                :disabled="isDisabled"
                            ></nitrozen-input>
                        </div>
                    </div>
                    
                    <div class="row-2">
                        <div class="input-field purpose">
                            <nitrozen-dropdown
                                label="Purpose"
                                v-model="purposeType.value"
                                :items="filteredPurposeList"
                                :disabled="readOnlyMode"
                                :required="isRequired"
                                :searchable="true"
                                @change="validateForm('purpose')"
                                @searchInputChange="changePurposeType($event)"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="purposeType.errorMessage">{{ purposeType.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="input-field shipment-id">
                            <nitrozen-input
                                label="Shipment ID"
                                placeholder="Enter Shipment ID"
                                :disabled="readOnlyMode"
                                v-model="shipmentIdCommercial.value"
                                @input="validateForm('shipmentIdCommercial', false)"
                            ></nitrozen-input>
                            <nitrozen-error v-if="shipmentIdCommercial.errorMessage">{{ shipmentIdCommercial.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="input-field invoice-number">
                            <nitrozen-input
                                label="Invoice Number"
                                placeholder="Enter Invoice Number"
                                :disabled="readOnlyMode"
                                v-model="invoiceNumber.value"
                                :required="isRequired"
                                @blur="validateServiceInvoice"
                                @input="validateForm('invoiceNumber')"
                            ></nitrozen-input>
                            <!-- @keyup.enter.tab="validateServiceInvoice" -->
                            <nitrozen-error v-if="invoiceNumber.errorMessage">{{ invoiceNumber.errorMessage }}</nitrozen-error>
                        </div>
                    </div>
                </div>


                <div class="third">

                    <div class="row-1">
                        <div class="fee-type">
                            <nitrozen-dropdown
                                label="Fee Component Type"
                                v-model="feeType.value"
                                :items="FeeComponentTypeList"
                                :disabled="readOnlyMode"
                                :required="isRequired"
                                :searchable="true"
                                @change="validateForm('feeType')"
                                
                            ></nitrozen-dropdown>
                            <!-- @searchInputChange="changePurposeType($event)" -->
                            <nitrozen-error v-if="feeType.errorMessage">{{ feeType.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="credit-debit-note-amount">
                            <nitrozen-input
                                :label=noteAmountLabel
                                :placeholder=noteAmountPlaceholder
                                :required="isRequired"
                                :disabled="readOnlyMode"
                                :showPrefix=true
                                :prefix=currency
                                @input="validateForm('amount')"
                                @keypress="omit_special_char($event)"
                                v-model="creditDebitNoteAmount.value"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="creditDebitNoteAmount.errorMessage">{{ creditDebitNoteAmount.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="kapture-id">
                            <nitrozen-input
                                label="Kapture ID"
                                placeholder="Enter Kapture ID"
                                :disabled="readOnlyMode"
                                v-model="kaptureId.value"
                                @input="validateForm('kaptureId', false)"
                            ></nitrozen-input>
                            <nitrozen-error v-if="kaptureId.errorMessage">{{ kaptureId.errorMessage }}</nitrozen-error>
                        </div>
                    </div>

                    <div class="row-2">
                        
                        <div class="remarks">
                        <nitrozen-input
                            label="Remarks"
                            placeholder="Enter Remarks"
                            :required="isRequired"
                            :disabled="readOnlyMode"
                            v-model="remarks.value"
                            @input="validateForm('remarks')"
                        ></nitrozen-input>
                        <nitrozen-error v-if="remarks.errorMessage">{{ remarks.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="note-narration">
                        <nitrozen-input
                            label="Note Narration"
                            placeholder="Enter Note Narration"
                            :required="isRequired"
                            :disabled="readOnlyMode"
                            v-model="noteNarration.value"
                            @input="validateForm('noteNarration')"
                        ></nitrozen-input>
                        <nitrozen-error v-if="noteNarration.errorMessage">{{ noteNarration.errorMessage }}</nitrozen-error>
                        </div>

                    </div>    
            </div>
                
            </div>
            
            
            <div class="gst-fee-invoice-cn" v-show="selectedType === 'gst_fee'">

                <div class="row-1-gst-fee-invoice-cn">
                    <div class="service-invoice-number input-field">
                    <nitrozen-input
                            label="Service Invoice Number"
                            placeholder="Enter Service Invoice Number"
                            :required="isRequired"
                            :disabled="readOnlyMode || editingMode"
                            v-model="invoiceNumber.value"
                            
                            @blur="validateServiceInvoice"
                            @input="validateForm('invoiceNumber')"
                        ></nitrozen-input>
                        <!-- @keyup.enter.tab="validateServiceInvoice" -->
                        <nitrozen-error v-if="invoiceNumber.errorMessage">{{ invoiceNumber.errorMessage }}</nitrozen-error>
                    </div>

                    <div class="note-narration input-field">
                    <nitrozen-input
                            label="Note Narration"
                            placeholder="Enter Note Narration"
                            :required="isRequired"
                            :disabled="readOnlyMode"
                            v-model="noteNarration.value"
                            @input="validateForm('noteNarration')"
                        ></nitrozen-input>
                        <nitrozen-error v-if="noteNarration.errorMessage">{{ noteNarration.errorMessage }}</nitrozen-error>
                    </div>
                </div>
                <div 
                    v-for="(item, index) in feeInvoiceDetails"
                    :key="'item-' + index"
                    class="row-2-gst-fee-invoice-cn"
                >
                    <expandable-table
                        v-if="purposeList" 
                        :purpose="purposeList"
                        :readOnly="readOnlyMode"
                        :bagData="item"
                        :preview="isPreview"
                        @row-data="ChildToParent($event)"
                        @disable-save="ChildToParent($event)"
                    ></expandable-table>
                </div>

            </div>

            <div class="gst-service-invoice-cn" v-show="selectedType === 'gst_service'">

                <div class="first-container-gst-service-invoice-cn">
                    <div class="row-1-gst-service-invoice-cn">
                        <div class="service-invoice-number input-field">
                        <nitrozen-input
                                label="Service Invoice Number"
                                placeholder="Enter Service Invoice Number"
                                :required="isRequired"
                                :disabled="readOnlyMode || editingMode"
                                v-model="invoiceNumber.value"
                                @keyup.enter.tab="validateServiceInvoice"
                                @blur="validateServiceInvoice"
                                @input="validateForm('invoiceNumber')"
                            ></nitrozen-input>
                            <nitrozen-error v-if="invoiceNumber.errorMessage">{{ invoiceNumber.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="note-narration input-field">
                        <nitrozen-input
                                label="Note Narration"
                                placeholder="Enter Note Narration"
                                :required="isRequired"
                                :disabled="readOnlyMode"
                                v-model="noteNarration.value"
                                @input="validateForm('noteNarration')"
                            ></nitrozen-input>
                            <nitrozen-error v-if="noteNarration.errorMessage">{{ noteNarration.errorMessage }}</nitrozen-error>
                        </div>
                    </div>

                    <div class="row-2-gst-service-invoice-cn">
                        <div class="dropdown shipment-id" >
                            <div>
                            <label class="n-input-label">Shipment ID *</label>
                            <div 
                                class="input-text cn-dn-chips"
                                @click="$refs.chips.focus()"
                            >
                                <nitrozen-chips
                                    :disable="readOnlyMode"
                                    v-for="(item,
                                    index) in shipmentId.value"
                                    :key="'searchText_' + index"
                                >
                                    {{ item }}
                                    <nitrozen-inline
                                        :icon="'cross'"
                                        class="nitrozen-icon"
                                        v-on:click="removeSearchInput(index), validateForm('shipmentId'), selectShipment(), getInvoiceDetails().then(()=>unselectBags())"
                                    ></nitrozen-inline>
                                </nitrozen-chips>
                                <input
                                    :disabled="readOnlyMode || disableShipmentInput"
                                    type="text"
                                    class="chip-input cl-Mako light-xs"
                                    @keydown="getSearchText"
                                    ref="chips"
                                    v-model="chips"
                                    @input="validateForm('shipmentId'), selectShipment()"
                                    @keyup.enter.space.188="getInvoiceDetails(), selectShipment(), validateForm('shipmentId')"
                                    @keydown.tab="getInvoiceDetails(), selectShipment(), validateForm('shipmentId')"
                                />
                            </div>
                            <div class="message" v-if="shipmentId.value">
                                {{ shipmentSelected }}
                            </div>
                            <nitrozen-error v-if="shipmentId.errorMessage">{{ shipmentId.errorMessage }}</nitrozen-error>
                        </div>

                        <div class="dropdown bag-id">
                            <nitrozen-dropdown
                                label="Bag ID"
                                v-model="bagId.value"
                                :required="isRequired"
                                :items="bagList"
                                :disabled="readOnlyMode"
                                :multiple=true
                                :searchable="true"
                                @change="getInvoiceDetails(), selectBags()"
                            ></nitrozen-dropdown>
                            <div class="message" v-if="bagId.value">
                                {{ bagSelected }}
                            </div>
                             <nitrozen-error v-if="bagId.errorMessage">{{ bagId.errorMessage }}</nitrozen-error>

                             <div class="chip-wrapper inline cn-dn-chips">
                                 <div
                                    v-for="(bag, index) of bagId.data"
                                    :key="index"
                                 >
                                    <nitrozen-chips 
                                        class=" cl-Mako light-xs"
                                        :disable="readOnlyMode"
                                    >
                                        {{ bag.bag_id }}
                                        <nitrozen-inline
                                            icon="cross"
                                            class="nitrozen-icon"
                                            @click="bagId.value.splice(index,1), getInvoiceDetails().then(()=>unselectBags())"
                                        >
                                        </nitrozen-inline>
                                    </nitrozen-chips>
                                 </div>
                             </div>
                        </div>
                        </div>
                    </div>
                </div>

                <div class="second-container-gst-service-invoice-cn" v-if="bagId && callExpandable">
                    <div
                        v-for="(bag, index) in bagId.data"
                        :key="'bag-' + index"
                        class="tables-section"
                    >
                        <accordion
                            class="accordion-container"
                            :initialState="false"
                        >
                            <template 
                                v-slot:header
                                class="header"
                            >
                                <div class="tick-row">
                                    <span class="first-header">Bag ID: {{ bag.bag_id }}</span>
                                    <span 
                                    class="cursor-pointer icon-ok"
                                    v-if="showTick(index)"
                                    >
                                        <inline-svg :src="'ok'"></inline-svg>
                                    </span>
                                </div>
                                
                                <span class="second-header">Shipment ID: {{ bag.shipment_id }}</span>
                                
                            </template>
                            <expandable-table
                                v-if="purposeList" 
                                :purpose="purposeList"
                                :bagData="bag"
                                :readOnly="readOnlyMode"
                                :preview="isPreview"
                                @selected-component="ChildToParent($event)"
                                @row-data="ChildToParent($event)"
                                @disable-save="ChildToParent($event)"
                            ></expandable-table>
                        </accordion>
                    </div>
                </div>
            </div>
            
            <save-note-dialog
                ref="saveNoteDialog"
                title="Save Credit Note"
                @close="$dialogClosed"
            >
            </save-note-dialog>
            <div v-show="!isPreview">
                <go-back-dialog
                    ref="goBackDialog"
                    title="goBackDialog"
                    @close="$dialogClosed"
                ></go-back-dialog>
            </div>

        </div>

        <transition name="slide">
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


</template>


<script>
    import Jumbotron from '@/components/common/jumbotron';
    import { PageHeader } from '@/components/common';
    import MirageAlert from '@/components/orders/alert.vue';
    import InlineSvg from '@/components/common/inline-svg.vue';
    import admInlineSVG from '@/components/common/adm-inline-svg';
    import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
    import SaveNoteDialog from './save-note-dialog.vue';
    import GoBackDialog from './go-back-dialog.vue';
    import accordion from '@/components/common/accordion.vue';
    import { mapGetters } from 'vuex'
    import ApproverDrawer from './approver-drawer.vue';
    import { GET_USER_INFO } from '@/store/getters.type';
    import { ADMIN_PERMISSIONS } from '../../../store/getters.type';
    import loader from '@/components/common/loader';
    import DatePicker from '@/components/common/date-picker.vue';
    import moment from 'moment';
    import {
        NitrozenInput,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenDialog,
        NitrozenCheckBox,
        NitrozenError,
        NitrozenBadge,
        flatBtn,
        strokeBtn,
        NitrozenToggleBtn,
        NitrozenChips,
        NitrozenInline
    }from '@gofynd/nitrozen-vue';
    import ExpandableTable from './expandable-table.vue';
    import CreditDebitNoteServices from '@/services/cn-dn.service';
    import isEmpty from 'lodash/isEmpty';

    export default{
        name: 'CreditNote',
        components: {
            Jumbotron,
            PageHeader,
            NitrozenInput,
            NitrozenButton,
            NitrozenDropdown,
            NitrozenDialog,
            NitrozenCheckBox,
            NitrozenError,
            NitrozenBadge,
            InlineSvg,
            admInlineSVG,
            UktInlineSvg,
            accordion,
            ExpandableTable,
            SaveNoteDialog,
            GoBackDialog,
            ApproverDrawer,
            NitrozenToggleBtn,
            NitrozenChips,
            MirageAlert,
            NitrozenInline,
            'adm-inline-svg': admInlineSVG,
            'date-picker':DatePicker,
            loader
        },
        directives: {
            flatBtn,
            strokeBtn
        },
        props:{
            /* tab: {
                type: Object
            } */
        },
        data() {
            return {
                disableShipmentInput : false,
                isApprover: '',
                uploadDateRange: moment().toISOString(),
                notBefore: moment().startOf('month').toISOString(),
                selectedDate:moment().format('YYYY-MM-DD hh:mm:ss'),
                drawerData: {
                    status: '',
                    notesSet:{}
                },
                approve: 'Approve',
                chips: '',
                selectedType: 'commercial',
                sellerId: {
                    value: '1',
                    errorMessage: '',
                    isValid: true
                },
                isValidForm: {},
                calledFromChild: false,
                sellerName:'',
                noteDetails: [],
                filteredCnTypes : [
                    {
                        text:"Commercial",
                        value:"commercial",
                        description:"Commercial Credit notes are raised against invoice number and seller id. An example where a commercial credit note needs to be issued is when an order is lost by logistic service provider, the amount recovered by logistic service provider is credited to the seller."
                    },
                    {
                        text:"GST Fee Invoice",
                        value:"gst_fee",
                        description:"Gst fee note is raised against an existing fee invoice component if theres an issue that affects the entire invoice."
                    },
                    {
                        text:"GST Service Invoice",
                        value:"gst_service",
                        description:"Gst Service is raised against an existing service invoice component. One of the events in which gst service note needs to be issued is the invoice difference of initial shipping cost charged to Seller based on estimates and actual cost charged by logistic service provider."
                    }
                ],
                noteDesc: '',
                isDisabled: true,
                isRequired: true,
                isPreview: false,
                purposeList: [],    
                filteredPurposeList : [],
                FeeComponentTypeList: [],
                noteDetailsMap: {},
                purposeType: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                feeType: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                shipmentId: {
                    value: [],
                    errorMessage: '',
                    isValid: false
                },
                feeInvoiceDetails:[],
                serviceInvoiceDetails: [],
                shipmentIdCommercial: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                invoiceNumber: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                creditDebitNoteAmount: {
                    value: '',
                    errorMessage: '',
                    regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                    isValid: false
                },
                kaptureId: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                remarks: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                noteNarration: {
                    value: '',
                    errorMessage: '',
                    isValid: false
                },
                bagId: {
                    value: [],
                    data:[],
                    errorMessage: '',
                    isValid: false
                },
                bagList: [],
                noteType: '',
                noteId: '',
                title:'',
                dropdownLabel: '',
                sacCode: '',
                shipmentList: [],
                currency: '₹',
                noteAmountLabel: '',
                noteAmountPlaceholder: '',
                bagShipmentMapping: {},
                bagMapping: {},
                componentList: [],
                readOnlyMode: false,
                editingMode: false,
                tab: {},
                quickApproveView: false,
                shipmentSelected: '',
                bagSelected: '',
                showTicks: [],
                callExpandable: false,
                extraBags: {},
                bagsRemoved: []
            };
        },

        computed: {
            ...mapGetters({
                userData: GET_USER_INFO,
                aclPermissions: ADMIN_PERMISSIONS
            }),
        },

        mounted() {
            this.isApprover = this.$route.params.isApprover;
            this.noteType = this.$route.params.noteType;
            this.getCommercialFeeType();
            if(this.noteType === 'credit'){
                this.title = 'Create Credit Note';
                this.dropdownLabel = 'Credit Note Type *';
                this.noteAmountLabel = 'Credit Note Amount';
                this.noteAmountPlaceholder = 'Enter Credit Note Amount';
                this.noteDesc = this.filteredCnTypes[0].description;
            } else{
                this.title = 'Create Debit Note';
                this.dropdownLabel = 'Debit Note Type *';
                this.noteAmountLabel = 'Debit Note Amount';
                this.noteAmountPlaceholder = 'Enter Debit Note Amount';
                this.filteredCnTypes = [
                    {
                        text:"Commercial",
                        value:"commercial",
                        description:"Commercial debit notes are raised against invoice number and seller id. An example where a commercial debit note needs to be issued is in an event of Return initiation or acceptance after return window/seller settlement, or cashback by bank."
                    }
                ]
                this.noteDesc = this.filteredCnTypes[0].description;
            }
            this.setPurposeList();
            if(this.$route.params.noteId){
                if(this.$route.params.preview && this.$route.params.preview == 'preview'){
                    this.isPreview = true;
                }
                this.readOnlyMode = true;
                this.readOnlyData();
                this.noteId = this.$route.params.noteId;
                this.title = this.$route.params.documentNo;
            }
            this.getSellerDetails();
        },

        methods: {
            onFilterChange(e){
                this.selectedDate = moment(e).format('YYYY-MM-DD hh:mm:ss');
                
            },
            dateRange(){
                var firstDay = moment().startOf('month');
                var endDay = moment().endOf('month');

                var monthRange = moment.range(firstDay, endDay)

            },
            isEmpty,
            closeApproverDrawerView(event){
            this.quickApproveView = false;
                if (event != false) {
                    this.$router.back();
                    return;
                }
            },

            omit_special_char(e) {
                let keyCode = e.keyCode ? e.keyCode : e.which;
                if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
                    e.preventDefault();
                }
            },

            dateFormatted(date){
                return moment(new Date(date*1000)).format('DD-MM-YYYY')
            },

            showTick(index) {
                if (this.readOnlyMode || this.showTicks.includes(this.bagId.value[index])) {
                    return true;
                }
                if (this.calledFromChild) {
                    let values = Object.values(this.noteDetailsMap)
                    values.map(v => {
                        if (!this.showTicks.includes(this.bagId.value[index])
                                && v.bag_id+v.shipment_id === this.bagId.value[index]) {
                            this.showTicks.push(this.bagId.value[index])
                        }
                    })
                    return this.showTicks.includes(this.bagId.value[index]);
                }
                return false;
            },
            changePurposeType(e){
                this.filteredPurposeList = this.purposeList.filter((x) =>
                    x.text.toLowerCase().includes(e.text.toLowerCase())
                );
                if(isEmpty(e.text)){
                    this.purposeType.errorMessage = 'Purpose is required';
                    this.purposeType.isValid = false;
                    delete this.isValidForm["purpose"];
                }
            },
            changeDesc(){
                let noteDesc = this.filteredCnTypes.find(obj => obj.value === this.selectedType);
                this.noteDesc = noteDesc.description;
            },
            resetForm() {
                this.sellerId.value = '1';
                this.sellerName = '';
                this.purposeType.value = '';
                this.shipmentId.value = [];
                this.invoiceNumber.value = '';
                this.feeType.value = '';
                this.invoiceNumber.errorMessage = '';
                this.creditDebitNoteAmount.value = '';
                this.kaptureId.value = '';
                this.remarks.value = '';
                this.noteNarration.value = '';
                this.bagId.value = [];
                this.bagList = [];
                this.bagShipmentMapping = {};
                this.isValidForm = {};
                this.calledFromChild = false;
                this.feeInvoiceDetails = [];
                this.noteDetailsMap = {};
                this.noteDetails = [];
                this.purposeList = [];
                this.setPurposeList();
                this.showTicks = [];
                this.getSellerDetails();
                this.changeDesc();
            },
            resetSellerName() {
                if(this.sellerId.value.trim() === ''){
                    this.sellerName = '';
                    this.isValidForm["sellerName"] =  false;
                }
            },
            roundToTwo(num) {
                let length = num.length;
                let index = num.indexOf('.');
                if(index === -1) return true;
                if (length - index - 1 > 2) {
                    return false;
                }
                return true;
            },

            validateForm(input, required=true){
                switch (input) {
                    case 'sellerId':
                        if(this.sellerId.value.trim() === ''){
                            this.sellerId.errorMessage = 'Seller ID is required';
                            this.sellerId.isValid = false;
                        }else{
                            this.sellerId.errorMessage = '';
                            this.sellerId.isValid = true;
                        }
                        this.isValidForm[input] =  this.sellerId.isValid;
                        break;
                    case 'amount':
                        if (typeof this.creditDebitNoteAmount.value === 'string' ? this.creditDebitNoteAmount.value.trim() === '' : this.creditDebitNoteAmount.value === '') {
                            this.creditDebitNoteAmount.errorMessage = this.noteType === 'credit' ?
                            'Credit Note Amount is required':
                            'Debit Note Amount is required';
                            this.creditDebitNoteAmount.isValid = false;
                        } else if(!this.creditDebitNoteAmount.regex.test(this.creditDebitNoteAmount.value)){
                            this.creditDebitNoteAmount.errorMessage = this.noteType === 'credit' ?
                                'Credit Note Amount should be a positive number':
                                'Debit Note Amount should be a positive number';
                            this.creditDebitNoteAmount.isValid = false;
                        } else if (this.creditDebitNoteAmount.value * 1 === 0) {
                            this.creditDebitNoteAmount.errorMessage = this.noteType === 'credit' ?
                            'Credit amount should be greater than 0':
                            'Debit amount should be greater than 0';
                            this.creditDebitNoteAmount.isValid = false;
                        } else if (!this.roundToTwo(this.creditDebitNoteAmount.value+'')){
                            this.creditDebitNoteAmount.errorMessage = 'Only 2 digits after decimal allowed';
                            this.creditDebitNoteAmount.isValid = false;
                        } else {
                            this.creditDebitNoteAmount.errorMessage = '';
                            this.creditDebitNoteAmount.isValid = true;
                        }
                        this.isValidForm[input] = this.creditDebitNoteAmount.isValid;
                        break;
                    case 'remarks':
                        if (this.remarks.value.trim() === '') {
                            this.remarks.errorMessage = 'Remarks is required';
                            this.remarks.isValid = false;
                            delete this.isValidForm[input];
                        } else if (this.remarks.value.length >= 512) {
                            this.remarks.errorMessage = 'Remarks cannot exceed 512 chars';
                            this.remarks.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.remarks.errorMessage = '';
                            this.remarks.isValid = true;
                            this.isValidForm[input] = this.remarks.isValid;
                        }
                        break;
                    case 'noteNarration':
                        if (this.noteNarration.value.trim() === '') {
                            this.noteNarration.errorMessage = 'Note Narration is required';
                            this.noteNarration.isValid = false;
                            delete this.isValidForm[input];
                        } else if (this.noteNarration.value.length >= 512) {
                            this.noteNarration.errorMessage = 'Note Narration cannot exceed 512 chars';
                            this.noteNarration.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.noteNarration.errorMessage = '';
                            this.noteNarration.isValid = true;
                            this.isValidForm[input] = this.noteNarration.isValid;
                        }
                        break;
                    case 'invoiceNumber':
                        if (required && this.invoiceNumber.value.trim() === '') {
                            this.invoiceNumber.errorMessage = 'Invoice Number is required';
                            this.invoiceNumber.isValid = false;
                            delete this.isValidForm[input];
                        } else if (this.invoiceNumber.value.length >= 100) {
                            this.invoiceNumber.errorMessage = 'Invoice Number cannot exceed 100 chars';
                            this.invoiceNumber.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.invoiceNumber.errorMessage = '';
                            this.invoiceNumber.isValid = true;
                            if (required) {this.isValidForm[input] = this.invoiceNumber.isValid;}
                        }
                        break;
                    case 'purpose':
                        if (this.purposeType.value.trim() === '') {
                            this.purposeType.errorMessage = 'Purpose is required';
                            this.purposeType.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.purposeType.errorMessage = '';
                            this.purposeType.isValid = true;
                            this.isValidForm[input] = this.purposeType.isValid;
                        }
                        break;
                    case 'feeType':
                        if (this.feeType.value.trim() === '') {
                            this.feeType.errorMessage = 'Fee Component Type is required';
                            this.feeType.isValid = false;
                            delete this.isValidForm[input];
                        } else if (this.feeType.value.length >= 100) {
                            this.feeType.errorMessage = 'Fee Component Type cannot exceed 100 chars';
                            this.feeType.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.feeType.errorMessage = '';
                            this.feeType.isValid = true;
                            this.isValidForm[input] = this.feeType.isValid;
                        }
                        break;
                    case 'kaptureId':
                        if (required && this.kaptureId.value.trim() === '') {
                            this.kaptureId.errorMessage = 'Kapture ID is required';
                            this.kaptureId.isValid = false;
                            delete this.isValidForm[input];
                        } else if (this.kaptureId.value.length >= 100) {
                            this.kaptureId.errorMessage = 'Kapture ID cannot exceed 100 chars';
                            this.kaptureId.isValid = false;
                            delete this.isValidForm[input];
                        } else {
                            this.kaptureId.errorMessage = '';
                            this.kaptureId.isValid = true;
                            if (required) {this.isValidForm[input] = this.kaptureId.isValid;}
                        }
                        break;
                    case 'shipmentIdCommercial':
                        if (this.shipmentIdCommercial.value.length >= 50) {
                            this.shipmentIdCommercial.errorMessage = 'Shipment ID cannot exceed 50 chars';
                            this.shipmentIdCommercial.isValid = false;
                        } else {
                            this.shipmentIdCommercial.errorMessage = '';
                            this.shipmentIdCommercial.isValid = true;
                        }
                        break;
                    case 'shipmentId':
                        if (this.shipmentId.value.length === 0) {
                            this.shipmentId.errorMessage = 'Shipment IDs required';
                            this.shipmentId.isValid = false;
                            this.disableShipmentInput = false;
                        } else if (this.shipmentId.value.length > 10) {
                            this.shipmentId.errorMessage = 'More than 10 shipment ids not allowed';
                            this.shipmentId.isValid = false;
                            this.disableShipmentInput = true;
                        } else {
                            let res = true;
                            this.shipmentId.value.map(shipment => {
                                if (this.shipmentId.value.indexOf(shipment) !== this.shipmentId.value.lastIndexOf(shipment)) {
                                    res = false
                                }
                            })
                            if (!res) {
                                this.shipmentId.errorMessage = 'Duplicate shipments not allowed';
                                this.shipmentId.isValid = false;
                            } else {
                                this.shipmentId.errorMessage = '';
                                this.shipmentId.isValid = true;
                            }
                            this.disableShipmentInput = false;
                        }
                        this.isValidForm[input] = this.shipmentId.isValid;
                        if(this.shipmentId.value && this.shipmentId.value.length >=10){
                             this.disableShipmentInput = true;
                        }
                        break;
                    case 'bagId':
                        if (this.bagId.value.length === 0) {
                            this.bagId.errorMessage = 'Bag ID is required';
                            this.bagId.isValid = false;
                        } else {
                            this.bagId.errorMessage = '';
                            this.bagId.isValid = true;
                        }
                        this.isValidForm[input] = this.bagId.isValid;
                        break;
                }
            },

            disableEdit() {
                switch (this.selectedType) {
                    case 'gst_fee':
                        if (Object.keys(this.isValidForm).length !== 0 || this.calledFromChild) {
                            return false; // case when both are edited or one of them is edited
                        }
                        return true;
                    case 'gst_service':
                        if (this.shipmentId.value.length === 0 || this.bagId.value.length === 0) {
                            return true;
                        }
                        if ((Object.keys(this.isValidForm).length !== 0 && this.calledFromChild) 
                            || (Object.keys(this.isValidForm).length !== 0 && !this.calledFromChild)
                            || (Object.keys(this.isValidForm).length === 0 && this.calledFromChild)) {
                            return false; // case when both are edited or one of them is edited
                        }
                        return true;
                    case 'commercial':
                        if (this.creditDebitNoteAmount.errorMessage === '' && this.feeType.errorMessage === '' && this.invoiceNumber.errorMessage === ''
                            && this.shipmentIdCommercial.errorMessage === '' && this.purposeType.errorMessage === '' && this.kaptureId.errorMessage === ''
                            && this.remarks.errorMessage === '' && this.noteNarration.errorMessage === '') {
                                return false;
                        }
                        return true;
                }
            },

            disableSave() {
                if(Object.keys(this.isValidForm).length === 0) return true;
                if(Object.values(this.isValidForm).includes(false)){
                    return true;
                }
                switch (this.selectedType) {
                    case 'commercial':
                        if(Object.keys(this.isValidForm).length === 8) return false;
                        break;
                    case 'gst_fee':
                        if(Object.keys(this.isValidForm).length > 3) {
                            if (!this.calledFromChild) {
                                return true;
                            }
                            return false;
                        }
                        break;
                    case 'gst_service':
                        if(Object.keys(this.isValidForm).length > 3 && this.calledFromChild) return false;
                        break;
                }
                return true;
            },

            readOnlyData(){
                let param = {
                    data:{
                        note_id:this.$route.params.noteId,  //this.tab.document_number  can be....
                    }
                }

                const caller = CreditDebitNoteServices.getNoteDetails(param); //api integretion
                caller.then((res) => {
                        //integrate key value pairs with the nitrozen inputs and dropdowns and expandable tables
                        this.tab = res.data.items;
                        this.selectedType = this.tab.category;
                        this.changeDesc();
                        if(this.tab.category === 'gst_service'){
                            this.purposeList = [];
                            this.setPurposeList();
                            this.invoiceNumber.value = this.tab.invoice_number;
                            this.noteNarration.value = this.tab.note_narration;
                            this.sellerId.value = this.tab.seller_id;
                            this.sellerName = this.tab.seller_name;
                            let temp = []
                            if (this.tab.note_details) {
                                this.bagList.length = 0;
                                this.bagMapping = {};
                                this.bagId.data = []
                                this.bagId.value = []
                                this.tab.note_details.map(note => {
                                    // pushing data in shipment id to show selected shipments
                                    if (!this.shipmentId.value.includes(note.shipment_id)) {
                                        this.shipmentId.value.push(note.shipment_id);
                                    }
                                    // pushing data in bag id to get selected bags
                                    if (!this.bagId.value.includes(note.bag_id+note.shipment_id)) {
                                        this.bagId.value.push(note.bag_id+note.shipment_id);
                                        let row =  {
                                            'fee_type': note.fee_type,
                                            'purpose_id': note.purpose_id,
                                            'gross_amount': note.gross_amount,
                                            'sac_code': note.sac_code,
                                            'sgst_tax_rate': note.sgst_tax_rate,
                                            'igst_tax_rate': note.igst_tax_rate,
                                            'cgst_tax_rate': note.cgst_tax_rate,
                                            'remark': note.remark,
                                            'kapture_sr_id': note.kapture_sr_id,
                                            'total_amount': note.total_amount,
                                            'bag_id': note.bag_id,
                                            'shipment_id': note.shipment_id,
                                            'id': note.id
                                        }
                                        let r = [];
                                        r.push(row);
                                        //this.bagId.data = [];
                                        this.bagId.data.push({
                                            'bag_id': note.bag_id,
                                            'shipment_id': note.shipment_id,
                                            'row' : r
                                        })
                                    } else {
                                        this.bagId.data.map(d => {
                                        if (d.bag_id === note.bag_id && d.shipment_id === note.shipment_id) {
                                            let row =  {
                                                'fee_type': note.fee_type,
                                                'purpose_id': note.purpose_id,
                                                'gross_amount': note.gross_amount,
                                                'sac_code': note.sac_code,
                                                'sgst_tax_rate': note.sgst_tax_rate,
                                                'igst_tax_rate': note.igst_tax_rate,
                                                'cgst_tax_rate': note.cgst_tax_rate,
                                                'remark': note.remark,
                                                'kapture_sr_id': note.kapture_sr_id,
                                                'total_amount': note.total_amount,
                                                'bag_id': note.bag_id,
                                                'shipment_id': note.shipment_id,
                                                'id': note.id
                                            }
                                            d.row.push(row);
                                        }
                                        })
                                    }
                                    
                                    // creating mapping between bag+shipment and note details
                                    if(!Object.keys(this.bagMapping).includes(note.shipment_id+''+note.bag_id)) {
                                        this.bagMapping[note.shipment_id+''+note.bag_id] = []
                                    }
                                    this.bagMapping[note.shipment_id+''+note.bag_id].push(note)
                                    let a = [];
                                    this.bagList = [];
                                    Object.entries(this.bagMapping).map(data => {
                                        data[1].map(d => {
                                            if (!a.includes(d.bag_id+d.shipment_id)) {
                                                this.bagList.push({
                                                    text: d.bag_id,
                                                    data: d,
                                                    value: d.bag_id+d.shipment_id
                                                })
                                                a.push(d.bag_id+d.shipment_id);
                                            }
                                        })
                                    })
                                    temp = [...a]
                                })
                                const returned = this.getInvoiceDetails()
                                let chargeComponents = {}
                                let orderId = {}
                                let orderingChannel = {}
                                let bag = {}
                                returned.then(r => {
                                    r.data.items.map(v => {
                                        let key = v.bag_id+v.shipment_id
                                        let value = v.charge_components
                                        Object.assign(chargeComponents, {[key]: value});
                                    })
                                    r.data.items.map(v => {
                                        let key = v.bag_id+v.shipment_id
                                        let value = v.order_id
                                        Object.assign(orderId, {[key]: value});
                                    })
                                    r.data.items.map(v => {
                                        let key = v.bag_id+v.shipment_id
                                        let value = v.ordering_channel
                                        Object.assign(orderingChannel, {[key]: value});
                                    })
                                    r.data.items.map(v => {
                                        let key = v.bag_id+v.shipment_id
                                        let value = v
                                        Object.assign(bag, {[key]: value});
                                    })
                                    Object.keys(bag).map(b => {
                                        if (!temp.includes(b)) {
                                            this.bagList.push({
                                                text: bag[b].bag_id,
                                                data: bag[b],
                                                value: b
                                            })
                                            temp.push(b);
                                        }
                                    })
                                    this.bagId.data.map(data => {
                                        data.charge_components = chargeComponents[data.bag_id+data.shipment_id]
                                        data.order_id = orderId[data.bag_id+data.shipment_id]
                                        data.ordering_channel = orderingChannel[data.bag_id+data.shipment_id]
                                    })
                                    
                                    this.callExpandable = true;
                                    
                                    // adding extra bags
                                    r.data.items.map(v => {
                                        if (!this.bagId.value.includes(v.bag_id+v.shipment_id)) {
                                            let key = v.bag_id+v.shipment_id;
                                            let value = v;
                                            Object.assign(this.extraBags,{[key]: value});
                                        }
                                    })
                                })
                            }
                        }
                        if(this.tab.category === 'gst_fee'){
                            this.purposeList = [];
                            this.setPurposeList();
                            this.invoiceNumber.value = this.tab.invoice_number;
                            this.noteNarration.value = this.tab.note_narration;

                            
                            if (this.tab.note_details) {
                                
                                //this.feeInvoiceDetails = [...this.tab.note_details]
                                let temp = [...this.tab.note_details]

                                const ret = this.getFeeInvoiceDetails()
                                ret.then(r => {
                                    temp[0].charge_components = r.data.items[0].charge_components;
                                    temp[0].seller_id = r.data.items[0].seller_id;
                                    temp[0].seller_name = r.data.items[0].seller_name;
                                }).then(() => {
                                    this.feeInvoiceDetails = [...temp] // array of objects(rows) with cc, seller id amd seller name
                                })
                            }
                        }
                        if(this.tab.category === 'commercial'){
                            this.sellerId.value = this.tab.seller_id;
                            this.sellerName = this.tab.seller_name;
                            this.shipmentIdCommercial.value = this.tab.note_details[0].shipment_id;
                            this.invoiceNumber.value = this.tab.note_details[0].invoice_number;
                            this.feeType.value = this.tab.note_details[0].fee_type;
                            this.creditDebitNoteAmount.value = this.tab.note_details[0].total_amount;
                            this.kaptureId.value = this.tab.note_details[0].kapture_sr_id;
                            this.remarks.value = this.tab.note_details[0].remark;
                            this.noteNarration.value = this.tab.note_narration;
                            this.purposeType.value = this.tab.purpose_id;
                            this.getSellerDetails();
                        }
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            `Failed due to ${err.message}`
                        );
                    })
                    .finally(() => {
                        //this.inProgress = false;
                    });
                
            },
            editMode(){
                this.readOnlyMode = false;
                this.editingMode = true;
            },

            displayPlaceholder(identifier) {
                switch (identifier) {
                    case 1:
                        return this.shipmentId.value.length+'/'+this.shipmentList.length+' selected';
                
                    case 2:
                        return this.bagId.value.length+'/'+this.bagList.length+' selected';
                }
            },

            // method to get payload for Commercial CN/DN
            getCommercialPayload(action) {
                if (action === 'edit_entity') {
                    return {
                        data: {
                            "type_of_request":action,
                            "item": {
                                "id": this.noteId,
                                "seller_id" : this.sellerId.value,
                                "seller_name" : this.sellerName,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category" : this.selectedType,
                                "invoice_type" : "Commercial",
                                "total_amount" : this.creditDebitNoteAmount.value * 1,
                                "purpose_id" : this.purposeType.value,
                                "note_narration" : this.noteNarration.value,
                                "status" : "Init",
                                "invoice_number" : this.invoiceNumber.value === '' ? null : this.invoiceNumber.value,
                                "is_active" : true,
                                "issued_at" : this.selectedDate,
                                "created_by" : this.userData.user.username,
                                "note_details" : [
                                    {
                                        "id": this.tab.note_details[0].id,
                                        "note_id" : this.noteId,
                                        "fee_type": this.feeType.value,
                                        "purpose_id": this.purposeType.value,
                                        "total_amount": this.creditDebitNoteAmount.value * 1,
                                        "is_active": true,
                                        "sac_code": null,
                                        "sgst_tax_rate": null,
                                        "cgst_tax_rate": null,
                                        "igst_tax_rate": null,
                                        "gross_amount": this.creditDebitNoteAmount.value * 1,
                                        "remark": this.remarks.value,
                                        "kapture_sr_id": this.kaptureId.value,
                                        "shipment_id": this.shipmentIdCommercial.value,
                                        "note_narration": this.noteNarration.value,
                                        "invoice_number" : this.invoiceNumber.value === '' ? null : this.invoiceNumber.value,
                                    }
                                ]
                            }
                        }
                    }
                }
                return {
                    data:{
                        "type_of_request":action,
                            "item":{
                                "seller_id" : this.sellerId.value,
                                "seller_name" : this.sellerName,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category" : this.selectedType,
                                "invoice_type" : "Commercial",
                                "total_amount" : this.creditDebitNoteAmount.value * 1,
                                "purpose_id" : this.purposeType.value, 
                                "note_narration" : this.noteNarration.value,
                                "status" : "Init",
                                "invoice_number" : this.invoiceNumber.value === '' ? null : this.invoiceNumber.value,
                                "is_active" : true,
                                "issued_at" : this.selectedDate,
                                "created_by" : this.userData.user.username,
                                "note_details" : [
                                    {
                                        "fee_type": this.feeType.value,
                                        "purpose_id": this.purposeType.value,
                                        "total_amount": this.creditDebitNoteAmount.value * 1,
                                        "is_active": true,
                                        "sac_code": null,
                                        "sgst_tax_rate": null,
                                        "cgst_tax_rate": null,
                                        "igst_tax_rate": null,
                                        "gross_amount": this.creditDebitNoteAmount.value * 1,
                                        "remark": this.remarks.value,
                                        "kapture_sr_id": this.kaptureId.value,
                                        "shipment_id": this.shipmentIdCommercial.value,
                                        "note_narration": this.noteNarration.value,
                                        "invoice_number" : this.invoiceNumber.value === '' ? null : this.invoiceNumber.value,
                                    }
                                ]
                        }
                    }
                }
            },

            // method to construct service invoice payload
            getServiceInvoicePayload(action) {
                if (action === 'edit_entity') {
                    //let newNotes = [];
                    if (this.bagsRemoved.length !== 0) {
                        let temp = [...Object.values(this.noteDetailsMap)];
                        let temp1 = [];
                        let flag = false;
                        temp.map(t => {
                            if (typeof t.map === 'function') {
                                    t.map(t1 => {
                                    temp1.push(t1);
                                })
                                flag = true;
                            }
                            
                        })
                        
                        if (flag) {
                            temp = [...temp1];
                            temp.map(v => {
                                this.tab.note_details.map(tnote => {
                                    if (v.id === tnote.id) {
                                        tnote.is_active = false;
                                    }
                                })
                            })
                        } else {
                            temp.map(v => {
                                v.row.map(r => {
                                    this.tab.note_details.map(tnote => {
                                        if (r.id === tnote.id) {
                                            tnote.is_active = false;
                                        }
                                    })
                                })
                            })
                        }
                    }
                    else if (Object.values(this.noteDetailsMap).length !== 0) {
                        
                        this.noteDetails.map(note => {
                            this.tab.note_details.map(tnote => {
                                // updating value already present in tab
                                if (note.id === tnote.id) {
                                    tnote.is_active = note.is_active;
                                    tnote.bag_id = note.bag_id;
                                    tnote.cgst_tax_rate = note.cgst_tax_rate;
                                    tnote.fee_type = note.fee_type;
                                    tnote.gross_amount = note.gross_amount;
                                    tnote.id = note.id;
                                    tnote.igst_tax_rate = note.igst_tax_rate;
                                    tnote.invoice_number = note.invoice_number;
                                    tnote.kapture_sr_id = note.kapture_sr_id;
                                    tnote.note_id = note.note_id;
                                    tnote.order_id = note.order_id;
                                    tnote.purpose_id = note.purpose_id;
                                    tnote.remark = note.remark;
                                    tnote.sac_code = note.sac_code;
                                    tnote.sgst_tax_rate = note.sgst_tax_rate;
                                    tnote.shipment_id = note.shipment_id;
                                    tnote.total_amount = note.total_amount;
                                    this.noteDetails = this.noteDetails.filter(item => item.id !== note.id)
                                }
                            })
                        })
                    }
                    this.tab.note_details.map(note => {
                        this.noteDetails.push(note);
                    })
                    
                    let counter = 0;
                    let noteTemp = []
                    while (counter < this.noteDetails.length) {
                        if (!Array.isArray(this.noteDetails[counter])) {
                            noteTemp.push(this.noteDetails[counter]);
                        }
                        counter++;
                    }
                    this.noteDetails = [];
                    this.noteDetails = [...noteTemp];
                    let total_amount = 0;
                    this.noteDetails.map(note => {
                        if (note.is_active !== false) {
                            note.is_active = true;
                        }
                        if (note.is_active) {
                            total_amount += note.total_amount;
                        }
                        note.note_id = this.noteId;
                        delete note['order_id'];
                        delete note['invoice_number']
                    })
                    return {
                        data: {
                            "type_of_request": "edit_entity",
                            "item":{
                                "id": this.noteId,
                                "seller_id": this.sellerId.value,
                                "seller_name": this.sellerName,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category": this.selectedType,
                                "invoice_number": this.invoiceNumber.value,
                                "issued_at" : this.selectedDate,
                                "invoice_type": "service",
                                "total_amount": total_amount.toFixed(2),
                                "purpose_id": this.noteDetails[0].purpose_id,
                                "note_narration": this.noteNarration.value,
                                "status": "Init",
                                "is_active": true,
                                "created_by" : this.userData.user.username,
                                "note_details" : this.noteDetails
                            }
                        }
                    }
                } else {
                    this.noteDetails = [...Object.values(this.noteDetailsMap)];
                    let total_amount = 0;
                    this.noteDetails.map(note => {
                        total_amount += note.total_amount;
                    })
                    return {
                        data: {
                            "type_of_request": "create_entity",
                            "item":{
                                "seller_id": this.noteDetails[0].seller_id,
                                "seller_name": this.noteDetails[0].seller_name,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category": this.selectedType,
                                "invoice_number": this.invoiceNumber.value,
                                "invoice_type": "service",
                                "total_amount": total_amount,
                                "purpose_id": this.noteDetails[0].purpose_id,
                                "note_narration": this.noteNarration.value,
                                "status": "Init",
                                "issued_at" : this.selectedDate,
                                "is_acive": true,
                                "order_id": this.noteDetails[0].order_id,
                                "ordering_channel": this.noteDetails[0].ordering_channel,
                                "created_by" : this.userData.user.username,
                                "note_details" : this.noteDetails
                            }
                        }
                    }
                } 
            },

            // method to construct fee invoice payload
            getFeeInvoicePayload(action) {
                if (action === 'edit_entity') {
                    if(Object.values(this.noteDetailsMap).length !== 0) {
                        this.feeInvoiceDetails = [];
                        this.feeInvoiceDetails = [...Object.values(this.noteDetailsMap)]

                    }
                    let total_amount = 0;
                    this.feeInvoiceDetails.map(note => {
                        total_amount += note.total_amount;
                        note.is_active = true
                        note.note_id = this.noteId;
                    })
                    return {
                        data: {
                            "type_of_request": "edit_entity",
                            "item":{
                                "id": this.noteId,
                                "seller_id": this.feeInvoiceDetails[0].seller_id,
                                "seller_name": this.feeInvoiceDetails[0].seller_name,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category": this.selectedType,
                                "invoice_number": this.invoiceNumber.value,
                                "invoice_type": "Fee",
                                "total_amount": total_amount,
                                "purpose_id": this.feeInvoiceDetails[0].purpose_id,
                                "note_narration": this.noteNarration.value,
                                "status": "Init",
                                "issued_at" : this.selectedDate,
                                "is_active": true,
                                "created_by" : this.userData.user.username,
                                "note_details" : this.feeInvoiceDetails 
                            }
                        }
                    }
                } else {
                    this.noteDetails = [...Object.values(this.noteDetailsMap)];
                    let total_amount = 0;
                    this.noteDetails.map(note => {
                        total_amount += note.total_amount;
                    })
                    return {
                        data: {
                            "type_of_request": "create_entity",
                            "item":{
                                "seller_id": this.noteDetails[0].seller_id,
                                "seller_name": this.noteDetails[0].seller_name,
                                "note_type": this.noteType === 'credit' ? 'Credit': 'Debit',
                                "category": this.selectedType,
                                "invoice_number": this.invoiceNumber.value,
                                "invoice_type": "Fee",
                                "total_amount": total_amount,
                                "purpose_id": this.noteDetails[0].purpose_id,
                                "note_narration": this.noteNarration.value,
                                "status": "Init",
                                "issued_at" : this.selectedDate,
                                "is_acive": true,
                                "created_by" : this.userData.user.username,
                                "note_details" : this.noteDetails
                            }
                        }
                    }
                }
            },

            async setPurposeList() {
                let params = {
                    "data":{
                        "table_name": "credit_debit_note_purpose",
                        "filters":{
                            "note_type": this.noteType === 'credit' ? 'credit': 'debit',
                            "category" : this.selectedType
                        },
                        "project":[
                            "id",
                            "name",
                            "priority"
                        ],
                        "order_by":"priority Desc"
                    }
                }
                const res = await CreditDebitNoteServices.getPurpose(params);
                this.purposeList = res.data.items.map((item) => {
                            return {
                                text: item.name,
                                value: item.id
                            };
                });
                this.filteredPurposeList = this.purposeList;
            },

            // method to call save dialog and passing data
            async saveCN(action) {
                let payload = {}
                switch (this.selectedType) {
                    case 'commercial':
                        // It is needed to update seller-name if seller-id is changed just before save without a tab or enter
                        await this.getSellerDetails();
                        payload = this.getCommercialPayload(action);
                        break;
                    case 'gst_fee':
                        payload = this.getFeeInvoicePayload(action);
                        break;
                    case 'gst_service':
                        payload = this.getServiceInvoicePayload(action);
                        break;
                }
                this.$refs.saveNoteDialog.open({
                        data: payload
                });
            },

            // method to open dialog on clicking back button without saving changes
            goBackDialog() {
                if (this.isPreview) {
                    this.$router.back();
                    return;
                }
                this.$refs.goBackDialog.open({});
            },

            $dialogClosed() {},

            // method to get user name from user id
            async getSellerDetails() {
                this.sellerId.errorMessage = (this.sellerId.value.length == 0) ? 'Seller ID is required' : '';
                const params = {
                    "data": {
                        "seller_id": this.sellerId.value
                    }
                }
                try {
                    const res = await CreditDebitNoteServices.getSellerDetails(params);

                    if(this.sellerId.value.length == 0){
                        this.sellerName = '';
                    }else{
                        this.sellerName = res.data.data.seller_name;
                        this.isValidForm["sellerName"] =  true;
                        this.isValidForm["sellerId"] = true;
                        this.validateServiceInvoice();
                    }
                } catch (error) {
                    this.$snackbar.global.showError('Invalid Seller ID');
                    this.sellerName = ''
                    this.isValidForm["sellerName"] =  false;
                    this.isValidForm["sellerId"] = false;
                }
            },

            // method to get Fee invoice details
            async getFeeInvoiceDetails() { 
                this.feeInvoiceDetails = [];
                let res;
                const params = {
                    "data":{
                        "invoice_type": 'fee',
                        "invoice_number": this.invoiceNumber.value
                    }
                }
                try {
                    res = await CreditDebitNoteServices.getServiceInvoiceDetails(params);
                    if (this.readOnlyMode) {
                        return res
                    }
                } catch (error) {
                    this.$snackbar.global.showError('Invoice number provided doesnt exists in system, please provide valid invoice_number');
                    return;
                }
                this.feeInvoiceDetails = res.data.items;    
            },

            async getInvoiceDetails() {
                const params = {
                    "data": {
                        "invoice_type": "service",
                        "invoice_number": this.invoiceNumber.value,
                        "shipment_ids": this.shipmentId.value
                    }
                }

                let res;

                try {
                    res = await CreditDebitNoteServices.getGSTServiceInvoiceDetails(params);
                    if (this.readOnlyMode) {
                        return res;
                    }
                } catch (error) {
                    this.bagList = [];
                    return;
                }
                let ans = [];
                res.data.items.map(item => {
                    ans.push(item.shipment_id)
                })
                let flag = false; // no shipment id is wrong
                this.shipmentId.value.map(s => {
                    if (!ans.includes(s)) {
                        flag = true;
                        this.shipmentId.errorMessage = 'Incorrect Shipment ID';
                    }
                })
                let data = res.data.items.map( i =>  {
                    return {
                        "shipment_id": i.shipment_id,
                        "data": i,
                        "bag_id": i.bag_id
                    }
                })

                this.bagList.length = 0;
                this.bagShipmentMapping = {};

                data.map((v) => {
                            this.bagList.push({
                                text: v.bag_id,
                                data: v.data,
                                value: v.bag_id+v.shipment_id
                            })
                            //this.bagShipmentMapping[v.bag_id] = v.data //v.shipment_id
                            this.bagShipmentMapping[v.bag_id+v.shipment_id] = v.data
                        })
                // adding extra bags
                res.data.items.map(v => {
                    if (!this.bagId.value.includes(v.bag_id+v.shipment_id)) {
                        let key = v.bag_id+v.shipment_id;
                        let value = v;
                        Object.assign(this.extraBags,{[key]: value});
                    }
                })
            },

            // method to validate  service invoice number 
            async validateServiceInvoice(){
                let res;
                if(this.invoiceNumber.value.length != 0){
                    const params = {
                        "data":{
                            "invoice_number": this.invoiceNumber.value,
                        }
                    }
                    try {
                        if (!this.readOnlyMode) {
                            res = await CreditDebitNoteServices.validateServiceInvoiceNumber(this.selectedType === 'commercial' ? { data: {...params.data, seller_id: this.sellerId.value } } : params );
                            this.invoiceNumber.isValid = res.data.success;
                            this.invoiceNumber.errorMessage = '';
                            if(this.selectedType === 'gst_fee'){
                                this.getFeeInvoiceDetails();
                            }
                            /* if (!this.invoiceNumber.isValid) {
                                this.invoiceNumber.errorMessage = "Invalid Service Invoice Number";
                            } */
                        }
                    } catch(error) {
                        this.invoiceNumber.isValid = error.response.data.success;
                        if (!this.invoiceNumber.isValid) {
                            this.invoiceNumber.errorMessage = error.response.data.reason;
                        }
                        this.$snackbar.global.showError(error.response.data.reason);
                        return;
                    }
                }
            },

            unselectBags() {
                if (this.editingMode) {
                    this.bagsRemoved = [];
                    this.noteDetailsMap = {};
                    let temp = [];
                    let existingBags = []

                    this.bagList.map(bag => {
                        if (!this.extraBags[bag.value]) {
                            existingBags.push(bag.value);
                        }
                    })
                    this.bagId.value = [...existingBags];
                    this.bagId.data.map(d => {
                        if (!this.bagId.value.includes(d.bag_id+d.shipment_id)) {
                            if (d.row) {
                                this.noteDetailsMap[d.bag_id+d.shipment_id] = d.row;
                            } else {
                                this.noteDetailsMap[d.bag_id+d.shipment_id] = d;
                            }
                            this.bagsRemoved.push(d.bag_id+d.shipment_id);
                        } else {
                            temp.push(d);
                        }
                    })
                    this.bagId.data = [...temp];
                } else {
                    if (this.shipmentId.value.length === 0) {
                        this.bagList = [];
                        this.bagId.value = [];
                        this.bagId.data = [];
                    }
                    if (this.bagId.data.length === 0) {
                        return;
                    }
                    let temp = [];
                    this.bagList.map(d => {
                        temp.push(d.data);
                    })
                    this.bagId.data = [...temp];
                    temp = [];
                    this.bagList.map(d => {
                        temp.push(d.value);
                    })
                    this.bagId.value = [...temp];
                }
            },

            selectBags() {
                if(this.editingMode) {
                    //this.bagsRemoved = []; // not sure
                    if (this.bagId.value.length === 0) {
                        this.bagId.data = [];
                        this.showTicks = [];
                        return;
                    }
                    // taking back up of old bags
                    let temp = []
                    this.bagId.data.map(d => {
                        if (this.bagId.value.includes(d.bag_id+d.shipment_id)) {
                            if (d.row) {
                                temp.push(d)
                            }
                        } else {
                            this.bagsRemoved.push(d.bag_id+d.shipment_id)
                            this.noteDetailsMap[d.bag_id+d.shipment_id] = d;
                        }
                    })
                    // resetting
                    this.bagId.data = []
                    // pushing old bags
                    temp.map(t => {
                        this.bagId.data.push(t);
                    })
                    // pushing new bags
                    this.bagId.value.map(bag => {
                        if (this.extraBags[bag]) {
                            this.bagId.data.push(this.extraBags[bag]);
                        }
                    })
                } else {
                    if (this.bagId.value.length === 0) {
                        this.bagId.data = [];
                        this.showTicks = [];
                        return;
                    }
                    this.bagId.data = [];
                    this.showTicks = [];
                    this.bagId.value.map(id => {
                        this.bagId.data.push(this.bagShipmentMapping[id]);
                    })
                    this.callExpandable = true;
                }
            },

            ChildToParent(e){
                if (e === false) {
                    this.disableEdit();
                }
                if (e !== undefined && e.index) {
                    this.calledFromChild = true;
                    const key = e.bag_id + e.shipment_id + '' + e.index;
                    if (this.noteDetailsMap.hasOwnProperty(key)) {
                        this.noteDetailsMap[key].purpose_id = e.purpose_id;
                        this.noteDetailsMap[key].remark = e.remark;
                        this.noteDetailsMap[key].kapture_sr_id = e.kapture_sr_id;
                        this.noteDetailsMap[key].gross_amount = e.gross_amount;
                        this.noteDetailsMap[key].total_amount = e.total_amount;
                        this.noteDetailsMap[key].order_id = e.order_id;
                        this.noteDetailsMap[key].ordering_channel = e.ordering_channel;
                    } else {
                        this.noteDetailsMap[key] = e;
                    }
                    this.noteDetails = []
                    //this.noteDetails.push(Object.values(this.noteDetailsMap));
                    Object.values(this.noteDetailsMap).map(v => {
                        this.noteDetails.push(v);
                    })
                    this.disableSave();
                }
                else this.calledFromChild = false; 
            },
            close: function (e) {
                e.stopPropagation();
                this.quickApproveView = false;
            },

            quickApproverViewSection: function (action) {
                this.quickApproveView = !this.quickApproveView;
                this.drawerData.status = action;
                this.drawerData.notesSet[this.selectedType]=[{
                        'sellerName' : this.tab.seller_name,
                        'noteId' : this.tab.id,
                        'requestNo' : this.tab.document_number,
                        'grossAmount' : this.tab.total_amount
                }]
            },

            getSearchText(event) {
                if (
                    event.keyCode === 32 ||
                    event.keyCode === 13 ||
                    event.keyCode === 188 ||
                    event.keyCode === 9
                ) {
                    this.addSearchText();
                }
            },

            addSearchText() {
                if(this.chips) {
                    let splitString = this.chips.split(/[ ,]+/);
                    this.shipmentId.value.push(splitString.splice(-1).pop());
                    this.chips = ''
                }
            },

            removeSearchInput(index) {
                this.shipmentId.value.splice(index, 1);
                this.shipmentId.value = this.shipmentId.value.filter(item => item);
            },

            selectShipment() {
                this.shipmentSelected = 'You have added '+ this.shipmentId.value.length + '/' + '10 permitted Shipment IDs (Use comma to add multiple Shipment IDs)'
                this.bagSelected = 'You\'ll see Bag IDs corresponding to ' + this.shipmentId.value.length + ' selected Shipment IDs'
            },

            getCommercialFeeType() {
                let params = {
                    data: {
                        table_name: "reporting_variables",
                        filters: {
                            type:"tenant"
                        },
                        project: [
                            "variable"
                        ]
                    }
                }
                const getFeeType = CreditDebitNoteServices.getListData(params);
                return getFeeType
                    .then(( res ) => {
                        this.FeeComponentTypeList = res.data.items[0].variable['cn-dn|commercial'].fynd.map((item) => {
                            return {
                                text: item.display_name,
                                value: item.type
                            };
                        })
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(err);
                    })
                    /* .finally(() => {
                        //this.inProgress = false;
                    }); */
            }
        }
    };

    

</script>

<style lang="less" scoped>

.tab-header{
    width: 100%;
    display: flex;
    padding-left: 20px;
    justify-content: space-between;
    align-items: center;
}

.approver-buttons {
    //padding: 20px;
    display: flex;
    gap: 15px;
}
.main-container {
    
    //overflow: auto;
    //scroll-behavior: smooth;
    overflow-y: scroll;
    position: absolute;
    .top-wrap{
        display: flex;
        border-bottom : 1px solid #F2F2F2;
        margin-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 30px;
        row-gap: 10px;
        align-items: center;

        span{
            font-size: 14px;
            font-family: sans-serif;
            color: #2E31BE;
        }
        
        .vue-date-picker {
            width: 349px;
        }
        .mx-datepicker{
            height: 40px;
            width: 349px;
        }
    }

    

    .second::after {
        content: " ";
        display: block;
        border: 1px solid #F2F2F2;
        margin-top: 20px;
        margin-bottom: 20px;
    }
      .mirage-content {
            display: flex;
            flex-direction: column;
            width: -webkit-fill-available;
        .first-row {
            display: flex;
            justify-content: space-between;
            .heading {
                color: black;
            }
            .reject-date {
                color: grey;
                font-size: small;
                /*position: fixed;
                right: 50px;*/
            }
        }

        .second-row {
            color: gray;
            font-size: small;
        }
    }    .first {
        margin-top: 10px;
    }

    cursor: pointer;
        background-color: white;
        margin: 24px;
        padding: 24px;
        top: 56.5px;
        position: relative;
        min-height: 400px;

    .label {
        height: 17px;
        width: 103px;
        left: 0px;
        top: 0px;
        border-radius: nullpx;
        font-family: Inter;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #9B9B9B;

    }

    .filter-dropdown {
        height: 40px;
        width: 349px;
        left: 0px;
        top: 25px;
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .second {
        .row-1 {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 50px;
            
            .seller-id {
                height: 40px;
                width: 349px;
                // left: 0px;
                // top: 25px;
                border-radius: 4px;
            }

            .seller-name {
                height: 40px;
                width: 349px;
                // left: 397px;
                // right: 396px;
                // top: 25px;
                border-radius: 4px;
            }
        }

         .row-2 {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 50px;

            .purpose {
                height: 40px;
                width: 349px;
                // left: 0px;
                // top: 0px;
                border-radius: nullpx;
            }

            .shipment-id {
                height: 40px;
                width: 349px;
                // left: 0px;
                // top: 0px;
                border-radius: nullpx;
            }

            .invoice-number {
                height: 40px;
                width: 349px;
                // left: 0px;
                // top: 0px;
                border-radius: nullpx;
            }
        }
    }

    .third {
        .row-1 {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 50px;
            
            .fee-type {
                height: 40px;
                width: 349px;
                // left: 0px;
                // top: 25px;
                border-radius: 4px;
            }

            .credit-debit-note-amount {
                height: 40px;
                width: 349px;
                border-radius: 4px;
            }

            .kapture-id {
                height: 40px;
                width: 349px;
                // left: 397px;
                // right: 396px;
                // top: 25px;
                border-radius: 4px;
            }
        }

         .row-2 {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 50px;

            .remarks {
                height: 24px;
                width: 349px;
                // left: 0px;
                // top: 0px;
                border-radius: nullpx;
            }

            .note-narration {
                height: 24px;
                width: 349px;
                // left: 0px;
                // top: 0px;
                border-radius: nullpx;
            }
        }
    }

    .row-1-gst-fee-invoice-cn {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 60px;

        .input-field {
            height: 24px;
            width: 349px;
            // left: 0px;
            // top: 0px;
            border-radius: nullpx;
        }        
    }

    .row-2-gst-fee-invoice-cn::before {
        content: " ";
        display: block;
        border: 1px solid #F2F2F2;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .row-1-gst-service-invoice-cn {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 60px;
        .input-field {
            height: 24px;
            width: 349px;
            // left: 0px;
            // top: 0px;
            border-radius: nullpx;
        }  
    }

    .row-2-gst-service-invoice-cn {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 60px;
        
        .dropdown {
            .input-text {
            border: 1px solid @Iron;
            padding: 10px;
            min-height: 24px;
            width: 715px;
            border-radius: @BorderRadius;
            cursor: text;
            .chip-input {
                border: none;
                padding-top: 5px;
            }
            // ::v-deep .cn-dn-chips{
            //         border-radius: 4px;
            //     }
            }

            .message {
                margin-top: 7px;
                color: grey;
                font-size: x-small;
                white-space: nowrap;
                margin-bottom: 5px;
            }

            .bag-id {
                padding-top: 40px;
            }
        }
    }


    .second-container-gst-service-invoice-cn::before {
        content: " ";
        display: block;
        border: 1px solid #F2F2F2;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .tick-row {
        display: flex;
        .icon-ok {
            margin-left: auto;
        }
    }

    .tables-section {
        border: 1px solid #E0E0E0;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 15px;

        ::v-deep .outer-container {

            .title {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .first-header {
                font-size: 16px;
                font-weight: 600;
                color: #41434C;
            }
            .second-header {
                font-size: 12px;
                font-weight: 400;
                color: #41434C;
            }
            }
            .filter {
            position: inherit;
            }
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

::v-deep .page-header{
    .menu{
        display: none;
    }
}

.cn-dn-chips{
    ::v-deep .nitrozen-chip{
        border-radius: 4px;
    }
}
            
</style>
