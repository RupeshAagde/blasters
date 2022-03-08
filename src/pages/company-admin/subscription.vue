<template>
    <div>
        <div class="flex width-100">
            <div class="flex-1 page-container m-r-12">
                <div class="width-100">
                    <div class="flex">
                        <div class="flex-1 title">
                            Current Subscription
                        </div>
                        <div class="flex-1 text-right">
                            <nitrozen-button
                                v-if="currentPlanDetailed"
                                id="side-link"
                                :theme="'secondary'"
                                @click="openCurrentPlanDetailsModal"
                            >
                                View Details
                            </nitrozen-button>
                        </div>
                    </div>
                    <div
                        v-if="
                            currentActivePlan &&
                                currentActivePlan.is_enabled &&
                                currentActivePlan.subscription &&
                                currentActivePlan.subscription.plan_data
                        "
                        class="flex"
                    >
                        <div
                            v-if="currentActivePlan.subscription.is_active"
                            class="current-active-plan plan-container flex-1"
                        >
                            <div class="plan-bolder">
                                Current active plan:
                                {{
                                    currentActivePlan.subscription.plan_data
                                        .name
                                }}
                            </div>
                            <div
                                class="plan-thin"
                                v-if="
                                    !safeGet(
                                        currentActivePlan,
                                        'subscription.plan_data.is_trial_plan'
                                    )
                                "
                            >
                                Pricing:
                                {{
                                    amountFormat(
                                        currentActivePlan.subscription.plan_data
                                    )
                                }}
                                /
                                {{
                                    recurringText(
                                        currentActivePlan.subscription.plan_data
                                            .recurring.interval_count,
                                        currentActivePlan.subscription.plan_data
                                            .recurring.interval
                                    )
                                }}
                            </div>
                            <div class="plan-thin">
                                Next billing date:
                                {{
                                    currentActivePlan.subscription
                                        .current_period.end | getDateString
                                }}
                            </div>
                            <div class="plan-thin" v-if="trialDaysLeftString">
                                {{ trialDaysLeftString.text }}
                            </div>
                            <div class="plan-thin" v-if="currentActivePlan.subscription.meta && currentActivePlan.subscription.meta.comment">
                                Comment:
                                {{
                                    currentActivePlan.subscription.meta.comment
                                }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="
                            currentActivePlan &&
                                !currentActivePlan.is_enabled &&
                                currentActivePlan.subscription &&
                                !currentActivePlan.subscription.is_active
                        "
                        class="activation"
                    >
                    <div class="activate-but">
                         <nitrozen-button
                                :theme="'secondary'"
                                @click="onOpenChangePlanDialog"
                            >
                                Activate Plan
                            </nitrozen-button>
                        </div>
                        <div class="flex-1 current-inactive-plan">
                            Your current subscription for the
                            {{ currentActivePlan.subscription.plan_data.name }}
                            plan is inactive.
                        </div>
                        
                    </div>
                    <div
                        v-if="
                            currentActivePlan &&
                                !currentActivePlan.is_enabled &&
                                !currentActivePlan.subscription
                        "
                        class="flex-1 under-trial-plan"
                    >
                        Currently under the trial plan.
                    </div>
                    <div class="flex">
                        <div class="flex-1">
                            <nitrozen-button
                                v-if="currentActivePlan.is_enabled"
                                id="side-link"
                                :theme="'secondary'"
                                @click="onOpenChangePlanDialog"
                            >
                                Change Plan
                            </nitrozen-button>
                        </div>
                        <div class="flex-1 text-right">
                            <nitrozen-button
                                v-if="currentActivePlan.is_enabled"
                                id="side-link"
                                :theme="'secondary'"
                                @click="onOpenCancelSubscription"
                            >
                                Cancel Subscription
                            </nitrozen-button>
                        </div>
                    </div>
                </div>
                
                

                <nitrozen-dialog
                    id="view-plan-details"
                    ref="view_plan_details"
                    title="Plan Details"
                >
                    <template slot="body" name="body">
                        <div class="plan-info m-b-24" v-if="currentPlanDetailed">
                            <div class="plan-bolder">
                                Plan Name: {{ currentPlanDetailed.name }}
                            </div>
                            <div class="plan-thin">
                                Pricing:
                                {{ amountFormat(currentPlanDetailed) }}
                                /
                                {{
                                    recurringText(
                                        currentPlanDetailed.recurring
                                            .interval_count,
                                        currentPlanDetailed.recurring.interval
                                    )
                                }}
                            </div>
                        </div>
                        <plan-rows :plan="currentPlanDetailed"></plan-rows>
                    </template>
                    <template slot="footer" name="footer"
                        ><div></div
                    ></template>
                </nitrozen-dialog>
            </div>
            <div class="flex-1 page-container m-l-12 m-r-0">
                <div v-if="collection_method">
                    <div class="title">
                        Collection Method
                    </div>
                    <div>
                        <div>
                            <nitrozen-radio
                                class="m-b-12"
                                :name="'charge_automatically'"
                                :radioValue="'charge_automatically'"
                                v-model="collection_method"
                            >Charge automatically</nitrozen-radio>
                            <nitrozen-radio
                                class="m-b-24"
                                :name="'send_invoice'"
                                :radioValue="'send_invoice'"
                                v-model="collection_method"
                            >Send Invoice</nitrozen-radio>
                        </div>
                        <div>
                            <nitrozen-button
                                theme="secondary"
                                v-strokeBtn
                                @click="updateCollectionMethod"
                                >Update</nitrozen-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <nitrozen-dialog
                ref="confirm_cancel_subscription"
                title="Confirm"
                @close="onCloseCancelSubscription"
            >
                <template slot="body" name="body"
                    >Are you sure you want to cancel subscription?</template
                >
            </nitrozen-dialog>

            <nitrozen-dialog
                ref="change_plan_dialog"
                title="Change Plan"
            >
            <template slot="header">
                    <div class="capitalize">Change Plan</div>
                </template>
               <template slot="header">
                    <div class="cross" @click="onCancelActivatePlan">
                        <inline-svg :src="'cross-black'"></inline-svg>
                    </div>
                </template>

                <template slot="body" name="body"
                    >
                    <nitrozen-dropdown
                        ref="type-search"
                        :searchable="true"
                        class="datatype-dropdown"
                        :items="plansListDropdownItems"
                        v-model="selectedForChange"
                        @change="changePlanDropdown"
                        @searchInputChange="searchPlans"
                        :placeholder="'Search Plans'"
                    ></nitrozen-dropdown>
                    <nitrozen-error class="bottom-space" v-if="selectedForChangeError">
                        Please select valid plan
                    </nitrozen-error> 
                    <apply-coupon ref="add-coupon" :selectedPlan="selectedPlan" @emitCoupon="getCouponValue($event)" ></apply-coupon> 
                    <nitrozen-input
                        class="search m-t-24"
                        type="textarea"
                        label="Comment"
                        placeholder="Enter Comment"
                        v-model="planChangeComment"
                    ></nitrozen-input>  

                </template
                >
                <template slot="footer" name="footer">
                    <nitrozen-button
                        class="m-r-12"
                        theme="secondary"
                        v-flatBtn
                        @click="onActivatePlan"
                        >Activate Plan</nitrozen-button>
                    <nitrozen-button
                        theme="secondary"
                        v-strokeBtn
                        @click="onCancelActivatePlan"
                        >Cancel</nitrozen-button>
                </template>
            </nitrozen-dialog>
        </div>
        <div class="width-100">
            <div class="page-container display-block">
                <div class="title">
                    Credit Balance
                </div>
                <div class="m-b-24 flex">
                    <div class="flex-1 balance-amount" v-if="this.subscriber && this.subscriber.hasOwnProperty('credit_balance')">
                        {{ amountFormat({currency:"INR",amount:this.subscriber.credit_balance}) }}
                    </div>
                    <nitrozen-button
                        class="adjust-credit-btn"
                        :theme="'secondary'"
                        v-strokeBtn
                        @click="openCreditAdjustmentModal"
                    >Credit Adjustment</nitrozen-button>
                </div>
                <div>
                    <div class="title">Past Transactions</div>
                    <div class="m-b-24 flex gap-24">
                        <nitrozen-input
                            @input="debouncedFetch"
                            class="flex-1"
                            placeholder="Search by Credit Transaction ID"
                            :showSearchIcon="true"
                            v-model="filters.transaction_id"
                        ></nitrozen-input>
                        <nitrozen-input
                            @input="debouncedFetch"
                            class="flex-1"
                            placeholder="Search by Unique Transaction Reference(UTR)"
                            :showSearchIcon="true"
                            v-model="filters.search_unique_transaction_reference"
                        ></nitrozen-input>
                        <date-picker
                            v-on:input="e => debouncedFetch()"
                            class="flex-1"
                            :useNitrozenTheme="true"
                            :date_format="
                                'YYYY-MM-DD'
                            "
                            :range="true"
                            :picker_type="'datetime'"
                            v-model="filters.transaction_date"
                            :not_before="
                                new Date(0).toISOString()
                            "
                            :not_after="
                                new Date().toISOString()
                            "
                            :placeholder="
                                'Enter transaction date range'
                            "
                        />
                    </div>
                    <shimmer v-if="isLoading" :count="4"></shimmer>
                    <div v-if="creditTransactions && creditTransactions.items && creditTransactions.items.length">
                        <div v-for="(creditTransaction,index) in creditTransactions.items" :key="index">
                            <credit-transaction-card :creditTransaction="creditTransaction"></credit-transaction-card>
                        </div>
                        <nitrozen-pagination
                            id="credit-transaction-pagination"
                            name="Past transactions"
                            v-model="creditTransactionPagination"
                            @change="creditTransactionPaginationChange"
                            :pageSizeOptions="[5, 10, 20, 50]"
                        ></nitrozen-pagination>
                    </div>
                    <ukt-not-found v-else :title="'No results found'"></ukt-not-found>
                </div>
            </div>
        </div>
        <credit-balance-modal
            ref="credit-balance-modal"
            @closeCreditBalanceModal="closeCreditBalanceModal"
            :subscriber="subscriber"
        >

        </credit-balance-modal>
    </div>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import { debounce } from '@/helper/utils';
import datePicker from '../../components/common/date-picker.vue';
import { mapGetters } from 'vuex';
import BillingSubscriptionService from '../../services/billing.service';
import planRows from './plan-rows.vue';
import { GET_CURRENT_ACTIVE_SUBSCRIPTION } from '@/store/getters.type';
import CreditBalanceModal from '../../components/company-admin/subscription/credit-balance-modal.vue'
import {
    FETCH_COMPANY_SUBSCRIPTION_LIMITS,
    FETCH_CURRENT_ACTIVE_SUBSCRIPTION
} from '@/store/action.type';
import {
    NitrozenButton,
    NitrozenError,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDialog,
    NitrozenPagination,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import moment from 'moment';
import CreditTransactionCard from "@/components/company-admin/subscription/credit-transaction-card.vue"
import loader from '@/components/common/loader';
import uktNotFound from '../../components/common/ukt-not-found.vue';
import shimmer from '../../components/common/shimmer.vue';
import applyCoupon from '../../components/company-admin/subscription/apply-coupon.vue';
import inlinesvg from '../../components/common/inline-svg.vue';

export default {
    name: 'adm-company-subscription',
    components: {
        loader,
        'nitrozen-error':NitrozenError,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-pagination':NitrozenPagination,
        'credit-transaction-card':CreditTransactionCard,
        'plan-rows':planRows,
        'credit-balance-modal':CreditBalanceModal,
        'date-picker':datePicker,
        'shimmer':shimmer,
        'ukt-not-found':uktNotFound,
        'apply-coupon': applyCoupon,
        'inline-svg': inlinesvg,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props:{
        companyProfile:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    computed:{
        ...mapGetters({
            currentActivePlan: GET_CURRENT_ACTIVE_SUBSCRIPTION
        }),
        plansListDropdownItems(){
            let arr = [];
            arr = this.plansList.map(ele=>{
                return {
                    text: `${ele.name} - ${this.amountFormatNoDecimal(ele)} / ${this.toTitleCase(ele.recurring.interval)}`,
                    value: ele._id
                }
            })
            return arr;
        },
        trialDaysLeftString() {
            let currentActivePlan = this.currentActivePlan;
            if (
                get(currentActivePlan, 'is_enabled') &&
                get(
                    currentActivePlan,
                    'subscription.plan_data.is_trial_plan'
                ) &&
                get(currentActivePlan, 'subscription.trial.end')
            ) {
                let endDate = new Date(
                    currentActivePlan.subscription.trial.end
                );
                let today = new Date();
                var Difference_In_Days = (start, end) => {
                    return Math.ceil(
                        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
                    );
                };
                let daysLeft = Difference_In_Days(today, endDate);
                if (daysLeft < 1) {
                    return null;
                }
                let daysString =
                    daysLeft > 1 ? `${daysLeft} days` : `${daysLeft} day`;

                let text = `Your trial plan will expire in ${daysString}`;
                if (daysLeft <= 0) {
                    text = 'Your trial plan has expired';
                }

                let trialStartDate = new Date(
                    currentActivePlan.subscription.trial.start
                );
                let trialEndDate = new Date(
                    currentActivePlan.subscription.trial.end
                );

                let totalTrialPeriodInDays = Difference_In_Days(
                    trialStartDate,
                    trialEndDate
                );
                let styleClasses = [];
                if (daysLeft < totalTrialPeriodInDays / 4) {
                    styleClasses = ['expire-color'];
                }
                return {
                    text,
                    styleClasses
                };
            } else {
                return null;
            }
        }
        ,
        selectedPlan(){
            let plan = this.plansList.find((obj)=>{ return obj._id == this.selectedForChange})
            return plan;
        }

    },
    filters: {
        getDateString: function(value) {
            return moment(value).format('MMMM Do YYYY');
        },
    },
    data(){
        return {
            currentPlan:"",
            plansList: [],
            selectedForChange:"",
            selectedForChangeError:false,
            planChangeComment:"",
            isLoading:false,
            currentPlan:"",
            plansList: [],
            slectedForChange:"",
            planChangeComment:"",
            currentPlanDetailed: null,
            company_id: this.$route.params.companyId,
            collection_method: null,
            companyId: this.$route.params.companyId,
            creditTransactions: null,
            creditTransactionPagination:{
                total: 0,
                current: 1,
                limit: 10
            },
            subscriber:null,
            filters:{
                search_unique_transaction_reference:"",
                transaction_id:"",
                transaction_date:null
            },
            couponCode: '',
        }
    },
    mounted(){
        this.$store
                .dispatch(FETCH_CURRENT_ACTIVE_SUBSCRIPTION, {
                    params: {
                        unique_id: this.company_id,
                        product_suite: 'fynd-platform',
                        type: 'company'
                    }
                }).then((val)=>{
                    this.currentPlan=val.subscription;
                })
        let pArr = []
        this.fetchPlans("");
        if(this.$route.query && this.$route.query.subscriptionFilters){
            this.filters = JSON.parse(this.$route.query.subscriptionFilters)
        }
        this.fetchPlans("");
        pArr.push(
            BillingSubscriptionService.getAvailablePlansDetailed(
                'fynd-platform'
            )
                .then(res => res.data)
                .then(data => {
                    this.plans = data.plans;
                    return this.fetchCurrentActivePlan();
                })
                .then(() => {
                    let current_plan_id = get(
                        this,
                        'currentActivePlan.subscription.plan_id'
                    );
                    if (current_plan_id) {
                        return this.fetchPlanDetailed(current_plan_id).then(
                            ({ data }) => {
                                this.currentPlanDetailed = data;
                            }
                        );
                    }
                    
                })
                .then(()=>{
                    if(this.safeGet(this.currentActivePlan,"subscription.collection_method")){
                        this.collection_method = this.currentActivePlan.subscription.collection_method
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        );

        pArr.push(
            this.fetchCreditTransactions()
        )
        pArr.push(
            this.fetchCustomerDetails()
            .then(({data})=>{
                this.subscriber = data
            })
        )
        

        Promise.all(pArr)
        .catch(err=>{
            console.log(err)
        })
    },
    methods:{
        changePlanDropdown(){
        this.selectedForChangeError=false;
        this.$refs['add-coupon'].clearCoupon();
        },
        debouncedFetch: debounce(function(e) {
            this.$router.replace({
                name: 'company-details',
                query: {
                    ...this.$route.query,
                    subscriptionFilters: JSON.stringify(this.filters)
                }
            }).catch(() => {});
            
            this.fetchCreditTransactions();
        }, 700),
        creditTransactionPaginationChange(e){
            this.creditTransactionPagination.current = e.current
            this.creditTransactionPagination.limit = e.limit
            this.fetchCreditTransactions()
        },
        closeCreditBalanceModal(e){
            if(e && e.creditAdjustment && e.creditAdjustment.success){
                let pArr = []
                pArr.push(
                    this.fetchCreditTransactions()
                )
                pArr.push(
                    this.fetchCustomerDetails()
                    .then(({data})=>{
                        this.subscriber = data
                    })
                )
                

                Promise.all(pArr)
                .catch(err=>{
                    console.log(err)
                })
                
            }
        },
        openCreditAdjustmentModal(){
            this.$refs["credit-balance-modal"].open()
        },
        onOpenCancelSubscription() {
            this.$refs['confirm_cancel_subscription'].open({
                width: '400px',
                positiveButtonLabel: 'Yes',
                negativeButtonLabel: 'No',
                neutralButtonLabel: false
            });
        },
        onActivatePlan(){
            if(!this.selectedForChange){
                return this.selectedForChangeError=true;
            }else {
                // if(this.currentPlan.plan_id===this.selectedForChange){
                //     this.selectedForChange="";
                //     this.planChangeComment="";
                //     return this.$snackbar.global.showError(`You are already subsribed to ${this.currentPlan.plan_data.name}`,{duration: 2000});
                // }
                this.activatePlan(this.selectedForChange);
                this.$refs['change_plan_dialog'].close();    
            }
        },
        onCancelActivatePlan(){
            this.$refs['change_plan_dialog'].close()
        },
        onOpenChangePlanDialog() {
            this.selectedForChangeError=false;
            this.selectedForChange="";
            this.$nextTick(()=>{
                this.$refs['type-search'].selectItem(null, {})
                this.$refs['change_plan_dialog'].open({
                width: '650px',
                height: '650px',
                positiveButtonLabel: 'Activate Plan',
                negativeButtonLabel: 'Cancel',
                neutralButtonLabel: false
            });
            });
            this.$refs['add-coupon'].clearCoupon();

        },
        onCloseCancelSubscription(optionSelected) {
            if (optionSelected == 'Yes') {
                this.cancelSubscription(this.company_id);
            }
        },
        onCloseChangePlan(optionSelected){
            if(optionSelected.toLowerCase().includes('activate')){
                if(this.currentPlan.plan_id===this.slectedForChange){
                    this.slectedForChange="";
                    this.planChangeComment="";
                    return this.$snackbar.global.showError(`You are already subsribed to ${this.currentPlan.plan_data.name}`,{duration: 2000});
                }
                this.activatePlan(this.slectedForChange);    
            }else{
                this.slectedForChange="";
                this.planChangeComment="";
            }
        },
        cancelSubscription(company_id){
            let subscription_id = this.safeGet(this.currentActivePlan,'subscription._id')
            if(!subscription_id){
                return
            }
            let payload = {
                "unique_id": this.companyId,
                "type": "company",
                "product_suite": "fynd-platform",
                "subscription_id": subscription_id
            }
            
            return BillingSubscriptionService.cancelSubscription(this.companyId,payload)
            .then(({data})=>{
                if(data.success){
                    return this.$store
                    .dispatch(FETCH_CURRENT_ACTIVE_SUBSCRIPTION, {
                        params: {
                            unique_id: this.company_id,
                            product_suite: 'fynd-platform',
                            type: 'company'
                        }
                    }).then(()=>{
                        this.$snackbar.global.showSuccess('Subscription has been cancelled successfully',{duration: 2000});
                    })
                }
                else{
                    this.$snackbar.global.showError('Failed to cancel subscription',{duration: 2000});
                }
            })
            .catch(err=>{
                this.$snackbar.global.showError('Failed to cancel subscription',{duration: 2000});
            })

        },
        updateCollectionMethod(){
            let data = {
                collection_method: this.collection_method
            }
            let subscription_id = this.safeGet(this.currentActivePlan,'subscription._id')
            if(!subscription_id){
                return
            }
            return BillingSubscriptionService.updateSubscriptionById(this.companyId,subscription_id,data)
            .then(()=>{
                this.$snackbar.global.showSuccess('Collection method updated successfully',{duration: 2000});
            })
            .catch(err=>{
                this.$snackbar.global.showError('Failed to updated collection method',{duration: 2000});
            })
        },
        fetchCreditTransactions(){
            this.isLoading = true
            let filters = {}
            if(this.filters.search_unique_transaction_reference){
                filters["$or"] = filters["$or"] || {}
                filters["$or"] = [
                    { "payment.unique_transaction_reference": { $regex:this.filters.search_unique_transaction_reference ,$options:"ig"}},
                ]
            }
            if(this.filters.transaction_id && this.filters.transaction_id.length >= 24){
                filters["$or"] = filters["$or"] || {}
                filters["$or"] = [
                    { "_id": this.filters.transaction_id},
                ]
            }

            let transaction_dates = this.filters.transaction_date || []
            transaction_dates = transaction_dates.filter(a=>!!a)
            if(transaction_dates && transaction_dates.length == 2){
                filters["$and"] = filters["$and"] || {}
                filters["$and"] = [
                    { "created_at": {
                        $gte: this.filters.transaction_date[0],
                        $lte: this.filters.transaction_date[1],
                    }},
                ]
            }

            return BillingSubscriptionService.getCreditTransactions({
                params:{
                    unique_id: this.company_id,
                    product_suite: 'fynd-platform',
                    type: 'company',
                    page_size: this.creditTransactionPagination.limit,
                    page_no: this.creditTransactionPagination.current,
                    sort: JSON.stringify({ created_at: -1 }),
                    query: JSON.stringify(filters)
                }
            })
            .then((res)=>{
                this.isLoading = false
                this.creditTransactionPagination = {
                    total: res.data.total,
                    current: res.data.page,
                    limit: res.data.limit
                }
                this.creditTransactions = res.data
                return res
            })
        },
        fetchCustomerDetails(){
            return BillingSubscriptionService.getSubscriberDetails({
                params:{
                    unique_id: this.company_id
                }
            })
        },
        fetchPlanDetailed(id) {
            return BillingSubscriptionService.getPlanDetailsById(id);
        },
        getCouponValue({coupon}){
        this.couponCode = coupon; 
        },
        activatePlan(plan_id){
            let payload = {
                "unique_id": this.companyId,
                "type": "company",
                "product_suite": "fynd-platform",
                "plan_id": plan_id,
                "meta":{
                    "comment":this.planChangeComment
                },
                "coupon": this.couponCode
            }
            
            return BillingSubscriptionService.activatePlan(this.companyId,payload)
            .then(({data})=>{
                this.selectedForChange="";
                this.planChangeComment="";
                if(data.success){
                    return this.$store
                    .dispatch(FETCH_CURRENT_ACTIVE_SUBSCRIPTION, {
                        params: {
                            unique_id: this.company_id,
                            product_suite: 'fynd-platform',
                            type: 'company'
                        }
                    }).then((val)=>{
                        this.currentPlan=val.subscription;
                        this.$snackbar.global.showSuccess('Subscription has been changed successfully',{duration: 2000});
                    })
                }
                else{
                    this.$snackbar.global.showError('Failed to change subscription',{duration: 2000});
                }
            })
            .catch(err=>{
                this.$snackbar.global.showError('Failed to change subscription',{duration: 2000});
            })
           
            

        },
        searchPlans(e){
            if (e && e.text) {
                debounce(() => {
                    this.fetchPlans(e.text);
                }, 400)();
            }else {
                this.selectedForChange="";
                this.fetchPlans("")
                this.$refs['add-coupon'].clearCoupon();
            }

        },
        fetchPlans(searchText){
            return BillingSubscriptionService.getPlans({
                name:searchText,
                page_size: 50,
            })
                .then(({ data }) => {
                    this.loading = false;
                    this.plansList = data.items;
                })
                .catch((err) => {
                    // console.log(err);
                    this.pageError = true;
                });
        },
        openCurrentPlanDetailsModal() {
            this.$refs['view_plan_details'].open({
                width: '750px',
                height: '675px',
                showCloseButton: true,
                dismissible: true
            });
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency
            }).format(plan.amount);
        },
        amountFormatNoDecimal(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(plan.amount);
        },
        recurringText(interval_count, interval) {
            if (interval_count == 1) {
                return `per ${interval}`;
            }
            return `per ${interval_count} ${interval}`;
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        fetchCurrentActivePlan() {
            return this.$store
                .dispatch(FETCH_CURRENT_ACTIVE_SUBSCRIPTION, {
                    params: {
                        unique_id: this.company_id,
                        product_suite: 'fynd-platform',
                        type: 'company'
                    }
                })
                .then(() => {
                    let currentPlanId = get(
                        this.currentActivePlan,
                        'subscription.plan_id'
                    );
                    if (currentPlanId) {
                        this.plans = this.plans.map(plan => {
                            plan.is_current_active_plan = false;
                            return plan;
                        });

                        let currentPlan = this.plans.find(
                            plan => plan._id == currentPlanId
                        );

                        if (!currentPlan) {
                            this.isCurrentPlanCustomPlan = true;
                        } else {
                            currentPlan.is_current_active_plan = true;
                        }
                    }

                    let is_trial_plan = get(
                        this.currentActivePlan,
                        'subscription.plan_data.is_trial_plan',
                        true
                    );
                    if (!is_trial_plan) {
                        this.selectedPlanId = get(
                            this.currentActivePlan,
                            'subscription.plan_id',
                            null
                        );
                    }
                    return this.$store.dispatch(FETCH_COMPANY_SUBSCRIPTION_LIMITS,{company_id:this.company_id});
                });
        },
        toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
        }
    }
}
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.adjust-credit-btn{
    width: 200px;
}
.balance-amount{
    font-size: 30px;
    font-weight: 900;
    color: #2e35be;
}
.plan-info {
    padding: 14px;
    border-radius: 5px;
    border: 1px solid lightgray;
    line-height: 24px;
}
.background-white{
    background: white;
}

.plan-bolder {
    font-weight: 500;
    font-size: 15px;
}
.plan-thin {
    font-weight: 400;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    color: #696969;
}
.display-block{
    display: block!important;
}
.page-container {
    display: flex;
    margin-bottom: 24px;
    flex-direction: column;
    box-sizing: border-box;
    margin-top:0px;
    margin-left:0px;
    #side-link {
        position: relative;
        top: -3px;
        ::v-deep .n-button-content {
            height: auto;
        }
    }
    .current-inactive-plan {
        color: #fa3f4d;
        border: 1px solid #fa3f4d;
        padding: 14px;
        border-radius: 5px;
        display: inline-block;
    }
    .under-trial-plan {
        color: #2E31BE;
        border: 1px solid #2E31BE;
        padding: 14px;
        border-radius: 5px;
        display: inline-block;
    }
    .current-active-plan {
        padding: 14px;
        border-radius: 5px;
        border: 1px solid lightgray;
    }
    .plan-container {
        line-height: 24px;
    }
}
.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.title {
    color: @Mako;
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    margin-bottom: 24px;
}
.radio-inline {
    margin-top: 12px;
    display: inline-block;
    margin-right: 24px;
}
.cursor-pointer {
    cursor: pointer;
}
.inline-block{
    display: inline-block;
}
.link {
    cursor: pointer;
    color: #2E31BE;
    font-size: 12px;
    font-family: Inter, sans-serif;
}
.danger {
    color: #fa3f4d;
}
.form-field {
    margin-bottom: 24px;
}
.float-right{
    float:right;
}
.gap-24{
    gap:24px;
}
.flex-end {
    align-items: flex-end;
}

.align-items-center {
    align-items: center;
}
.align-self-center {
    align-self: center;
}
.justify-content-flex-end{
    justify-content: flex-end;
}
.hidden {
    visibility: none;
}
.flex {
    display: flex;
    .flex-1 {
        flex: 1;
    }
    .flex-2 {
        flex: 2;
    }
    .flex-3 {
        flex: 3;
    }
    .flex-4 {
        flex: 4;
    }
}
.m-r-24 {
    margin-right: 24px;
}
.m-t-24 {
    margin-top: 24px;
}
.m-b-24 {
    margin-bottom: 24px;
}
.m-l-24 {
    margin-left: 24px;
}

.m-r-12 {
    margin-right: 12px;
}
.m-t-12 {
    margin-top: 12px;
}
.m-b-12 {
    margin-bottom: 12px;
}
.m-l-12 {
    margin-left: 12px;
}

.p-r-12 {
    padding-right: 12px;
}
.p-t-12 {
    padding-top: 12px;
}
.p-b-12 {
    padding-bottom: 12px;
}
.p-l-12 {
    padding-left: 12px;
}

.m-r-0 {
    margin-right: 0px;
}
.m-t-0 {
    margin-top: 0px;
}
.m-b-0 {
    margin-bottom: 0px;
}
.m-l-0 {
    margin-left: 0px;
}

.width-50 {
    width: 50%;
    @media @mobile{
        width: 100%;
    }
}
.width-100 {
    width: 100%;
}
.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}
.box-sizing-border-box{
    box-sizing: border-box;
}
.from-container {
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    padding: 24px;
    @media @mobile{
        padding: 0;
    }
    .container {
        position: relative;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
        flex-direction: column;
        border: 1px solid #f9f9f9;
        padding: 24px;
        margin-bottom: 24px;
        .field-wrap {
            width: 100%;
            margin-bottom: 12px;
        }
        .remove {
            position: absolute;
            right: 0;
            top: 9px;
        }
    }
    .default {
        background: #f9f9f9;
    }
}
.bold-link {
    color: #2E31BE;
    text-align: right;
    cursor: pointer;
    margin-bottom: 0px;
    margin-top: 12px;
    font-weight: 700;
    font-size: 13px;
}


.activation{
    display: flex;
    flex-direction: column-reverse;
    
}
.activate-but{
margin-top: 24px;
}
</style>