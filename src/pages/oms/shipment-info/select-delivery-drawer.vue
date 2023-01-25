<template>
    <div class="select-dp-drawer">
        <div v-for="(dp, index) in dpArray"
            :key="index"
            :class="selectedDp == dp.value ? 'selected-delivery-card' : 'delivery-partner-card'"
            @click="changeEvent($event, dp.value)"
        >
            <div class="header-delivery-card">
                <div class="left-header">
                    <input 
                        class="radio-button"
                        type="radio"
                        name="name"
                        :value="dp.value"
                        v-model="selectedDp"
                        @change="changeEvent($event, dp.value)"
                        
                    />
                    <label class="dp-name">
                        {{ dp.text }}
                    </label>
                </div>
                <div :class="selectedDp == dp.value ? 'selected-right-header' : 'right-header'" v-if="dp.type">
                    <div :class="selectedDp == dp.value ? 'selected-header-tag' : 'right-header-tag'">
                        <span>{{ dp.type }}</span> 
                        <!-- @NOTE: Do not delete the following lines. They are for posterity. -->
                        <!-- <inline-svg :class="selectedDp == dp.value ? 'selected-svg' : ''" src="fastest-icon" v-if="dp.type == 'Fastest'"></inline-svg>
                        <inline-svg :class="selectedDp == dp.value ? 'selected-svg' : ''" src="rupee-sign" v-if="dp.type == 'Best Value'"></inline-svg> -->
                        <inline-svg :class="selectedDp == dp.value ? 'selected-svg' : ''" src="thumbs-up" v-if="dp.type == 'Recommended'"></inline-svg>
                    </div>
                    
                </div>
            </div>
            <div class="body-delivery-card">
                <div class="delivery-date">
                    <p :class="selectedDp == dp.value ? 'selected-common-css' : 'common-css-top'">Estimated Delivery Date</p>
                    <span class="common-css-bottom">{{ dp.estimated_delivery_date }}</span>
                </div>
                <div class="shipping-charges">
                    <p :class="selectedDp == dp.value ? 'selected-common-css' : 'common-css-top'">Estimated Shipping Charges</p>
                    <span class="common-css-bottom">₹ {{  dp.estimated_shipping_charges.toFixed(2) }}</span>
                </div>
            </div>
        </div>
        <div class="no-content">
            <adm-no-content
                helperText="No delivery partner found"
                v-if="!dpArray.length"
            ></adm-no-content>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

/* Package imports */
import moment from 'moment';

export default {
    name: "delivery-partner",
    props: {
       dpOptionsData: Object,
    },
    data() {
        return {
            dpArray: [],
            selectedDp: '',
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
    },
    mounted() {
        this.selectedDp = this.dpOptionsData.parent_dp_id;

        if(this.checksInDpOptions) {
            for(let item in this.dpOptionsData.dp_options) {
            let copyItem = {};
            copyItem['text'] = this.dpOptionsData.dp_options[item].display_name ? this.dpOptionsData.dp_options[item].display_name : this.dpOptionsData.dp_options[item].name;
            copyItem['value'] = this.dpOptionsData.dp_options[item].internal_account_id;
            copyItem['estimated_shipping_charges'] = this.dpOptionsData.dp_options[item].dp_shipping_charges;
            copyItem['estimated_delivery_date'] = this.getDates(this.dpOptionsData.dp_options[item].dp_tat.max);
            copyItem['type'] = this.getTypes(item) || '';
            this.dpArray.push(copyItem)
            }
        }
        else {
            this.$emit('disableSubmit', true);
        }
    },
    computed: {
        checksInDpOptions() {
            for(let item in this.dpOptionsData.dp_options) {
                if(this.dpOptionsData &&
                    this.dpOptionsData.dp_options &&
                    this.dpOptionsData.dp_options[item].internal_account_id &&
                    this.dpOptionsData.dp_options[item].dp_shipping_charges &&
                    this.dpOptionsData.dp_options[item].dp_tat &&
                    this.dpOptionsData.dp_options[item].dp_tat.max) 
                    {
                        return true;
                }
                else {
                    return false;
                }
            }
        }
    },
    methods: {
        changeEvent(e, selectedValue) {
            this.selectedDp = selectedValue;
        },
        // convertDateToNormalFormat(d) {
        //     return moment(d).add(new Date().getTimezoneOffset(), 'minutes').format('DD/MM/YYYY');
        // },
        getDates(maxSeconds) {
            let duration = moment.duration(maxSeconds, 'seconds');
            let estimatedDate = moment().add(duration, 'days').format('DD/MM/YYYY');
            return estimatedDate;
        },
        getTypes(dp) {
            let type = "Recommended";
            if(this.dpOptionsData.parent_dp_id == dp) {
                return type;
            }
        },
        sendSelectedDp(){
            this.$emit('makePostRequest', this.selectedDp);
        }
    }

}
</script>

<style lang="less" scoped> 
.select-dp-drawer {
    position: relative;
}

.delivery-partner-card {
    height: 60px;
    background: #FFFFFF;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 16px;
    cursor: pointer;
    
}
.header-delivery-card {
    display: flex;
    // padding-top: 16px;
    // padding-left: 16px;
    justify-content: space-between;
    align-items: flex-end;
}
.left-header {
    display: flex;
    align-items: flex-end;
    gap: 12px;
}
input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: #2E31BE;
}
.dp-name {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #41434C;
}
.right-header {
    box-sizing: border-box;
    background: #DBE1FF;
    border-radius: 200px;  
}
.right-header-tag {
    display: flex;
    gap: 4px;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: #2E31BE;
    padding: 4px 8px 4px 8px;
}
.body-delivery-card {
    display: flex;
    gap: 32px;
    padding: 10px 0px 0px 36px;
    
}
.common-css-top {
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: #868686;
}
.common-css-bottom {
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    color: #757575;
}
.selected-delivery-card {
    border: 1px solid #2E31BE;
    height: 60px;
    background: #E7EEFF;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 16px;
    cursor: pointer;
}
.selected-right-header {
    box-sizing: border-box;
    background: #2E31BE;
    border-radius: 200px; 
}
.selected-header-tag {
    display: flex;
    gap: 4px;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: #FFFFFF;
    padding: 4px 8px 4px 8px;
}
.selected-svg {
    ::v-deep svg {
        path {
            fill: #FFFFFF;
        }
    }
}
.selected-common-css {
    color: #2E31BE;
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
}

.no-content {
    width: 100%;

    .page-error {
        width: unset;
    }
}
</style>