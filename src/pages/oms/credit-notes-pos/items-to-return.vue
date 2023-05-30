<template>
    <div class="body-container">
        <div class="item-detail-wrapper" v-for="item in returnItems" :key="item.bag_id" >
            <div class="detail-container">
                <nitrozen-checkbox
                :checkboxValue="item.bag_id"
                v-model="selectedItem"
                @change="selectItem"
                class="checkbox-wrapper"
                ></nitrozen-checkbox>
                <div class="item-content-wrapper">
                    <div class="item-content-container">
                        <div class="item-image-container">
                            <img
                                class="item-img"
                                :src="item.item.images[0]" 
                                :alt="item.item.name">
                        </div>
                        <div>
                            <div class="title-content">{{ safeGet(item, 'item.name') }} </div>
                            <div class="item-content" v-if="item.article.identifiers.sku_code">SKU: {{ safeGet(item, 'article.identifiers.sku_code') }}</div>
                            <div class="item-content" v-if="item.article.identifiers.ean">EAN: {{ safeGet(item, 'article.identifiers.ean') }}</div>
                            <div class="item-content">Size: {{ safeGet(item, 'article.size') }}</div>
                            <div class="item-content">Item Code: {{safeGet(item, 'item.code') }}</div>
                            <div class="item-content">Quantity: {{safeGet(item, 'quantity') }}</div>
                            <div class="item-content" v-if="shipment.order.meta.currency.currency_code">Unit Price: {{amountFormat(item.financial_breakup.brand_calculated_amount,shipment.order.meta.currency.currency_code)}}</div>
                            <div class="item-content" v-if="item.entity_type==='set'">Set ID: {{ safeGet(item, 'set_id') }}</div>
                        </div>
                    </div>
                    <div>
                        <rejection-reason-box
                            v-if="enableRejectionReasonBox"
                            class="nitro-container"
                            :id="item.bag_id"
                            @bagReasonsAdded="bagReasonsAdded"
                            :itemQuantity="item.quantity"
                            :itemSelected="selectedItem"
                            :shipmentBags="returnItems"
                            :perUnitPrice="item.financial_breakup.brand_calculated_amount"
                            :sellerIdentifier="item.identifier"
                            :lineNumber="item.line_number"
                            :reasons="reasons"
                            :canBreakEntity="canBreakEntity"
                        ></rejection-reason-box>
                    </div>
                </div>
            </div>
            <div class="non-returnable" v-if="!item.can_return">Note: Item is not returnable</div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    NitrozenBadge,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import get from 'lodash/get';

/* Service imports */
import OrderService from '@/services/orders.service';

/* Component imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import rejectionReasonBox from './rejection-reason-box.vue';

/* Helper imports */

export default {
    name: 'return-side-panel',
    components: {
        NitrozenButton,
        NitrozenDropdown,
        NitrozenBadge,
        UktInlineSvg,
        rejectionReasonBox,
        'nitrozen-checkbox': NitrozenCheckBox,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    props: {
        returnItems: {
            type: Array,
        },
        shipment:{
            type: Object,
        }
    },
    data() {
        return {
            returnDetails:[],
            selectedItem: [],
            uniqueArray:[],
            reasons:[],
            canBreakEntity:true,
            enableRejectionReasonBox: false
        };
    },
    mounted(){
        this.fetchReasons();
        this.canEntityBreak();
    },
    methods: {
        canEntityBreak(){
            if(this.shipment && this.shipment.transition_config && this.shipment.transition_config.return_initiated 
            && this.shipment.transition_config.return_initiated.can_break_entity){
                this.canBreakEntity=true;
            }
            else {
                this.returnItems.forEach(item=>{
                    if(item.bag_id){
                        this.selectedItem.push(item.bag_id)
                    }
                })
                this.canBreakEntity=false;
                this.selectedItem;
            }
            this.enableRejectionReasonBox = true;
        },
        fetchReasons() {
            if(this.shipment && this.shipment.bags.length && this.shipment.status){
                OrderService.getReasons(this.shipment.shipment_id, this.shipment.bags[0].bag_id, this.shipment.status.status).then((res)=>{
                    if(res.data.success == true && res.data.reasons.length) {
                        this.reasons = res.data.reasons.map(reason => {
                            reason['text'] = reason.display_name;
                            reason['value'] = reason.id;
                            return reason;
                        });
                    }
                }).catch((err)=> {
                    console.error("Failed to get reasons for re-assign store ", err);
                })
            }
        },
        amountFormat(amount, currency) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        bagReasonsAdded(id, reason_id,reason_text,quantity, pricePerUnit, sellerIdentifier,lineNumber){
            let returnList=this.returnDetails.length;
            if(returnList==0){
            let obj={};
                obj.bag_id=id;
                obj.reason_id=reason_id;
                obj.reason_text=reason_text;
                obj.quantity=quantity;
                obj.per_unit_price = pricePerUnit;
                obj.seller_identifier = sellerIdentifier ;
                obj.line_number= lineNumber;
                this.returnDetails.push(obj);
            }
            else if(returnList>0){
                this.returnDetails.forEach(item=>{

                    if(item.bag_id!=id ){
                        let obj={};
                        obj.bag_id=id;
                        obj.reason_id=reason_id;
                        obj.reason_text=reason_text;
                        obj.quantity=quantity;
                        obj.per_unit_price = pricePerUnit;
                        obj.seller_identifier = sellerIdentifier;
                        obj.line_number= lineNumber;
                        this.returnDetails.push(obj);
                    }
                    else if(item.bag_id==id){
                        let obj={};
                        let bagIdIndex=this.returnDetails.findIndex(item => {
                            return item.bag_id == id;
                        });
                        if(bagIdIndex!=-1){
                            this.returnDetails.splice(bagIdIndex, 1);
                            obj.bag_id=id;
                            obj.reason_id=reason_id;
                            obj.reason_text=reason_text;
                            obj.quantity=quantity;
                            obj.per_unit_price = pricePerUnit;
                            obj.seller_identifier = sellerIdentifier;
                            obj.line_number= lineNumber;
                            this.returnDetails.push(obj);
                        }
                    }
                })
            }
             this.uniqueArray = this.returnDetails.filter((obj, index, self) => 
                index === self.findIndex((t) => (
                    t.bag_id === obj.bag_id
                ))
                );
                this.selectItem(this.selectedItem);
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        selectItem(item){
            if(this.uniqueArray.length && item.length && this.uniqueArray.length==item.length){
                let result = this.uniqueArray.filter(obj => item.includes(obj.bag_id));
                if(result.length==item.length){
                    this.$emit('selectedItems', result);
                }
            }
            else{
                this.$emit('selectedItems', []);
            }
        },
    }

}
</script>

<style scoped lang="less">

.item-detail-wrapper{
    padding: 24px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    margin-top: 16px;

    .detail-container{
        display: flex;
        justify-content: space-between;
    }
    .item-content-container{
        display: flex;
        justify-content: space-between;
    }
    .item-content-wrapper{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .item-image-container{
        margin-right: 15px;
    }
    .disable-item{
        background: #fff;
        opacity: .5;
    }
    .item-img{
        font-size: 12px;
        width: 74px;
        height: 91px;
    }

    .item-content{
        font-weight: 400;
        font-size: 12px;
        margin-top: 8px;
    }
    .title-content{
        font-weight: 600;
    }
    .non-returnable{
        color: #CD0909;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 12px;
    }

    @media @mobile{
        .item-content-wrapper{
            display: block;
        }
        .item-content-container{
            justify-content: start;
        }
        .checkbox-wrapper{
            width: 18px;
            height: 18px;
        }
        .item-image-container{
            margin-left: 15px;
        }
        }
}
</style>
