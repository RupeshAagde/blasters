<template>
    <div class="blaster-list-card-container card-list-wrapper" v-if="sellerRequest">
        <div class="card-content-section">
            <div >
                Reason: {{ sellerRequest.reason }}
            </div>
            <div class="card-content-line-2">
                Created at : {{ toDateTimeString(sellerRequest.created_at) }}
            </div>
                <div
                    class="card-content-line-3"
                    v-if="sellerRequest.status !== 'pending'"
                >
                    <span v-if="sellerRequest.status === 'approved'"
                        >Published</span
                    >
                    <span v-if="sellerRequest.status === 'cancelled'"
                        >Rejected</span
                    >
                    On: {{ toDateTimeString(sellerRequest.modified_at) }}
                </div>
        </div>
        <div class="rightside-card-section">
            <div>
                <nitrozen-button theme="secondary" @click="viewDetailsDialog()">View Details</nitrozen-button>
            </div>

        <!--Confirmation dailog -->
        <nitrozen-dialog ref="view-details-dialog" title="Plan Details">
            <template slot="body">
                <div>
                        <div class="interval">
                            <div class="plan-title">
                                <img src='/public/assets/admin/svgs/plan-downgrade.svg' alt="plan Downgrade"/>
                                <span>Plan Downgrade</span>
                            </div>
                            <div class="upgrade-details">
                                <div class="previous-plan">{{safeGet(this.currentActivePlan,"subscription.plan_data.name")}}</div>
                                <img src='/public/assets/admin/svgs/arrow_right_alt.svg' alt="arrow right"/>
                                <div class="new-plan">{{this.planName}}</div>
                            </div>
                        </div>
                        <p class="plan-details" v-if="sellerRequest.status == 'pending'" >As a result of this, plan for the Seller will be downgraded to Plan {{this.planName}} from Next Billing cycle.</p>
                        <p class="plan-details green" v-if="sellerRequest.status == 'approved'">Current plan for the Seller will be downgraded to Plan {{this.planName}} from Next Billing cycle.</p>
                    </div>
            </template>
            <template slot="footer" v-if="sellerRequest.status == 'pending'">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        theme="secondary"
                        @click="updateSubscription('cancelled')"
                        v-strokeBtn
                        >Reject
                    </nitrozen-button>
                    <nitrozen-button
                        theme="secondary"
                        class="mr-24"
                        @click="updateSubscription('approved')"
                        v-flatBtn
                        ref="delete-btn"
                        >Approve
                    </nitrozen-button>
                </div>
            </template>
        </nitrozen-dialog>
        <div class="card-badge-section">
            <nitrozen-badge
                v-if="sellerRequest.status === 'pending'"
                state="warn"
            >
                Pending
            </nitrozen-badge>
            <nitrozen-badge
                v-if="sellerRequest.status === 'cancelled'"
                state="error"
            >
             Cancelled
            </nitrozen-badge>
            <nitrozen-badge
                v-if="sellerRequest.status === 'approved'"
                state="success"
            >
             Approved
            </nitrozen-badge>
        </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.rightside-card-section{
    display: flex;
    align-items: center;
}
.card-list-wrapper {
    cursor: default;
}
.interval{
        margin-top:16px;
        display: flex;
        justify-content: space-between;
        width:100%;
        padding: 17px;
        margin-bottom:12px;
        background: #E7EEFF;
        border: 1px solid #2E31BE;
        box-sizing: border-box;
        border-radius: 4px;
        .plan-title{
            font-weight: 600;
            font-size: 16px;
            line-height: 140%;
            color: #666666;
            align-items: center;
            display: flex;
            span{
                margin-left: 12px;
            }
            @media @mobile{
                font-size: 14px;
            }
        }
        .upgrade-details{
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: 22px;
            letter-spacing: 0em;
            text-align: right;
            color: #41434C;
            display: flex;
            align-items: center;

            img{
                margin-left: 12px;
                margin-right: 12px;
            }
            @media @mobile{
                font-size: 14px;
            }
        }
    }
    .plan-details{
        color: @Required;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 140%;
        &.green {
            color: @Profit;
        }
    }

</style>

<script>
import moment from 'moment';
import inlineSvg from '@/components/common/inline-svg.vue';
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { GET_CURRENT_ACTIVE_SUBSCRIPTION } from '@/store/getters.type';
import BillingSubscriptionService from '../../services/billing.service';
import { mapGetters } from 'vuex';
import get from 'lodash/get';

export default {
    name: 'seller-request-card',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'inline-svg': inlineSvg,
        'nitrozen-dialog': NitrozenDialog
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        sellerRequest: {
            type: Object
        }
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data(){
        return{
            planDetails:null,
            planName:''
        }
    },
    computed:{
        ...mapGetters({
            currentActivePlan: GET_CURRENT_ACTIVE_SUBSCRIPTION
        }),

    },
    mounted(){
        this.getDetailPlans();
    },
    methods: {
        viewDetailsDialog(data) {
            this.$refs['view-details-dialog'].open({
                width: '650px',
                height: '300px',
                showCloseButton: true,
            });
        },
        updateSubscription(status) {
            this.$refs['view-details-dialog'].close();
            this.$emit('updateStatus', status);
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        getDetailPlans(){
            BillingSubscriptionService.getAvailablePlansDetailed(
                'fynd-platform'
            )
                .then(res => {
                     this.planDetails=res.data
                    
                })
                .then(()=>{
                    this.planName=this.getDowngraadePlanName();
                }
                )
                .catch(err=>{
                    console.log(err)
                })
        },
        getDowngraadePlanName(){
            if(this.planDetails){
        let planName=this.planDetails.plans.filter((plan) => plan._id === this.sellerRequest.plan_id)
            return planName[0].name
            }
        }

    }
};
</script>
