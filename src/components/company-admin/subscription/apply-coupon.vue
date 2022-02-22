<template>
    <div>
        <hr class="light-hr space" />
        <div class="coupon">
            <div class="alignment" v-if="!validCoupon">
                <div class="input">
                    <nitrozen-input
                        v-model="couponCode"
                        :label="'Have a coupon code?'"
                        placeholder="Enter Here"
                        @input="checkCoupon"
                    >
                    </nitrozen-input>
                </div>
                <div class="apply">
                    <nitrozen-button
                        theme="secondary"
                        v-strokeBtn
                        :disabled="showError || !couponCode"
                        @click="applyCoupon"
                    >
                        Apply
                    </nitrozen-button>
                </div>
            </div>
            <div class="invalid" v-if="showError">
                <adm-inline-svg
                    class="svg-icon"
                    src="Subtract"
                ></adm-inline-svg>
                <span class="invalid-text">Invalid Coupon</span>
            </div>
        </div>
        <div class="applied" v-if="validCoupon">
            <div class="c1">
                <div class="green">Coupon Code Applied!</div>
                <div class="code">{{ couponCode }}</div>
            </div>
            <div class="c2" @click="clearCoupon">
                <adm-inline-svg
                    class="svg-icon"
                    src="cross-black"
                ></adm-inline-svg>
            </div>
        </div>
        <div v-if="selectedPlan !== undefined">
             <div class="taxation">
            <div>Sub Total</div>
            <div>{{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: selectedPlan.currency
                }).format(selectedPlan.amount)}}</div>
        </div>  
            <div class="discount" v-if="validCoupon">
                <div>Discount</div>
                <div class="amount">
                    -{{
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: selectedPlan.currency,
                        }).format(discountValue)
                    }}
                </div>
            </div>

            <div class="taxation">
                <div>GST {{ selectedPlan.taxation.gst * 100 }}%</div>
                <div>
                    {{
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: selectedPlan.currency,
                        }).format(
                            gst ||
                                selectedPlan.taxation.gst * selectedPlan.amount
                        )
                    }}
                </div>
            </div>

            <div class="total">
                <div>Total</div>
                <div class="amount">
                    {{
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: selectedPlan.currency,
                        }).format(
                            amount ||
                                (1 + selectedPlan.taxation.gst) *
                                    selectedPlan.amount
                        )
                    }}
                </div>
            </div>
        </div>
        <hr class="light-hr" />
    </div>
</template>
<script>
import { debounce } from '@/helper/utils';
import BillingService from '@/services/billing.service';
import admInlineSVG from '@/components/common/adm-inline-svg';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'apply-coupon',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'adm-inline-svg': admInlineSVG,
    },
    props: {
        selectedPlan: {
            type: Object,
        },
    },
    data() {
        return {
            couponCode: '',
            showError: false,
            validCoupon: false,
            discountValue: '',
            amount: '',
            gst: '',
        };
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mounted() {
        this.discountValue = 0;
        this.validCoupon = false;
    },
    methods: {
        checkCoupon(e) {
            if (this.couponCode == '') {
                this.showError = false;
                return;
            }
            this.couponCode = this.couponCode.toUpperCase();
            this.debounceInput();
        },
        debounceInput: debounce(function () {
            let plan_id = this.selectedPlan._id;
            let company_id = this.$route.params.companyId;
            BillingService.getApplyCoupon({
                coupon_code: this.couponCode,
                plan: plan_id,
                company_id: company_id,
            })
                .then((data) => {
                    this.showError = !data.data.is_valid;
                    this.discountValue = data.data.discount_amount;
                })
                .catch((res) => {
                    if (this.couponCode == '') {
                        this.showError = false;
                        return;
                    }
                    this.showError = true;
                });
        }, 500),
        clearCoupon(event) {
            this.couponCode = '';
            this.validCoupon = false;
            this.discountValue = 0;
            if (event) {
                event.stopPropagation();
            }
        },
        applyCoupon(event) {
            this.gst =
                this.selectedPlan.taxation.gst *
                (this.selectedPlan.amount - this.discountValue);
            this.amount =
                (1 + this.selectedPlan.taxation.gst) *
                (this.selectedPlan.amount - this.discountValue);
            this.validCoupon = true;
            event.stopPropagation();
            this.$emit('emitCoupon', { coupon: this.couponCode });
        },
    },
};
</script>
<style lang="less" scoped>
.coupon {
    margin: 24px 0px 24px 0px;
    .alignment {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .input {
            width: 100%;
            margin-right: 14px
        }
        .apply {
            max-width: 87px;
        }
    }
    .invalid {
        display: flex;
        font-size: 12px;
        line-height: 17.19px;
        color: #eb5757;
        padding-top: 5px;
        .invalid-text {
            padding-left: 5px;
        }
    }
}
.applied {
    height: 65px;
    background-color: #ffffff;
    border: 0.5px dashed rgba(46, 49, 190, 0.3);
    box-sizing: border-box;
    border-radius: 4px;
    margin: 24px 0px 24px 0px;
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .c1 {
        .green {
            color: #219653;
            font-size: 12px;
            line-height: 17px;
        }
        .code {
            size: 15px;
            line-height: 25px;
        }
    }
}
::v-deep .n-button {
    width: 84px;
    background-color: #e7eeff;
}
.taxation {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    display: flex;
    align-items: center;
    color: #828282;
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    margin-top: 12px;
}
.light-hr {
    border: 1px solid rgba(0, 0, 0, 0.1);
}
.total {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
    color: #666666;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    .amount {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 140%;
        display: flex;
        align-items: center;
        text-align: right;
        color: #41434c;
    }
}
.discount {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 19.6px;
    letter-spacing: 0em;
    margin-top: 12px;
    text-align: left;
    color: #219653;
    display: flex;
    justify-content: space-between;
    .amount {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 19.6px;
        display: flex;
        align-items: center;
        text-align: right;
        color: #219653;
    }
}
.c2{
    cursor: pointer;
}
.space{
margin-top: 24px;
}
</style>