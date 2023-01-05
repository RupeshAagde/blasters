<template>
    <div>
        <div class="table-container">
            <table class="list-table">
                <tr class="table-header-row" v-if="columns.length && columns.length">
                    <th
                        v-for="column in columns"
                        :key="column.value"
                        class="no-wrap"
                    >
                        <div class="row-content">
                            <span class="table-header">
                                {{ column.text }}
                            </span>
                        </div>
                    </th>
                    <th></th>
                </tr>  

                <template v-if="mod_items && mod_items.length">
                    <!-- === Item Table Row START ==== -->
                    <tr
                        v-for="(item, indx) in mod_items"
                        :key="item.bag_id"
                        :class="`line-break ${getPromoItemClass(indx,item)} bag-list-table`"
                    >
                            <td class="item-details-container" >
                                <div class="item-title-block" v-if="item.entity_type !== 'set'">
                                    <div 
                                        class="item-image" 
                                        v-if="item.item && item.item.images"
                                        @click="openImage([{
                                            image: item.item.images[0],
                                            name: item.item.name,
                                            variants: item.variants,
                                            sku: item.identifier
                                        }] )">
                                        <img :src="item.item.images[0]" class="item-logo" />
                                    </div>
                                    <div class="item-primary-information" v-if="item.item && item.item.brand && item.item.name">
                                        <div class="tooltip-top" :data-tooltip="item.item.name">
                                            <span class="item-name">{{item.item.brand}} | {{item.item.name}}</span>
                                        </div>
                                        <div class="nitro-chips tooltip-top" v-if="item.item.size" :data-tooltip="item.item.size">
                                            <nitrozen-chips 
                                                class="nitro-chip">
                                                {{ item.item.size }}
                                            </nitrozen-chips>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-title-block" v-if="item.entity_type === 'set'">
                                    <div 
                                        class="item-image" 
                                        v-if="
                                            item.products && 
                                            item.products[0] && 
                                            item.products[0].item && 
                                            item.products[0].item.images"
                                        @click="openImage([{
                                            image: item.products[0].item.images[0],
                                            name: item.products[0].item.name,
                                            size: item.article.size,
                                            sku: item.products[0].identifier
                                        }] )">
                                        <img :src="item.products[0].item.images[0]" class="item-logo" />
                                    </div>
                                    <div 
                                        class="item-primary-information" 
                                        v-if="
                                            item.products && 
                                            item.products[0] && 
                                            item.products[0].item && 
                                            item.products[0].item.brand && 
                                            item.products[0].item.name">
                                        <span class="item-name tooltip-top" :data-tooltip="item.products[0].item.name">
                                            {{item.products[0].item.brand}} | {{item.products[0].item.name}}
                                        </span>
                                        <div class="nitro-chips tooltip-top" v-if="item.article.size" :data-tooltip="item.article.size">
                                            <nitrozen-chips 
                                                class="nitro-chip">
                                                {{ item.article.size }}
                                            </nitrozen-chips>
                                        </div>
                                    </div>
                                </div>
                                <nitrozen-button
                                    v-if="item.__bag_promo_child_count"
                                    class="offer-products-btn"
                                    theme="secondary"
                                    v-flatBtn
                                    @click="toggleChildPromoBags(item.__bag_promo_id,indx+1)"
                                > {{item.__bag_promo_child_count}} Offer Product{{item.__bag_promo_child_count > 1 ? 's':''}} 
                                    <inline-svg class="collapse-icon" :src="mod_items[indx+1] && mod_items[indx+1].__bag_promo_id === item.__bag_promo_id ?'close-arrow':'open-arrow'"/>
                                </nitrozen-button>
                            </td>

                            <td>
                                <div class="seller-cell" v-if="item.entity_type === 'set'">
                                    <span>{{ findSetIdentifier(item) }}</span>
                                </div>
                                <div class="seller-cell" v-if="item.entity_type !== 'set'">
                                    <span 
                                        v-for="(identifier, key) in item.article.identifiers" 
                                        :key="identifier"
                                        class="identifier"
                                        :class="{'sku': key === 'sku_code', 'ean': key === 'ean'}">
                                        {{ snakeCaseToCaps(key) }}: {{ identifier }}
                                    </span>
                                </div>
                            </td>

                            <td v-if="currentStatus === 'placed'">
                                <span v-if="item.entity_type != 'set' && item.quantity" class="quantity-cell">{{ item.quantity }}</span>
                                <span v-if="item.entity_type == 'set'" class="quantity-cell">{{ item.quantity }}</span>
                            </td>

                            <td v-if="currentStatus === 'placed' &&
                                shipment &&
                                shipment.transition_config &&
                                shipment.transition_config.bag_confirmed &&
                                shipment.transition_config.bag_confirmed.can_break_entity &&
                                shipment.transition_config.bag_confirmed.can_break_entity == true &&
                                !readOnlyMode">
                                <span v-if="item.entity_type != 'set' && item.quantity" class="quantity-cell">{{ item.quantity - item.rejected }}</span>
                                <span v-if="item.entity_type == 'set'" class="quantity-cell">{{ item.quantity - item.rejected }}</span>
                            </td>

                            <td v-if="
                                currentStatus === 'placed' && 
                                shipment &&
                                shipment.transition_config &&
                                shipment.transition_config.bag_confirmed &&
                                shipment.transition_config.bag_confirmed.can_break_entity &&
                                shipment.transition_config.bag_confirmed.can_break_entity == true && 
                                !readOnlyMode" class="reject-qty">
                                <custom-input-number 
                                    class="qty-reject"
                                    :min="0"
                                    :max="item.quantity"
                                    :id="item.entity_type == 'set' ? item.products[0].bag_id : item.bag_id"
                                    :value="item.rejected"
                                    :allowNegative="false"
                                    @increment="increment($event, indx, item.entity_type == 'set')"
                                    @decrement="decrement($event, indx, item.entity_type == 'set')"
                                    @change="onChange($event, indx, item.entity_type == 'set')"
                                />
                            </td>

                            <td v-if="currentStatus !== 'placed'" class="quantity-cell">
                                <span v-if="item.quantity">{{ item.quantity }}</span>
                            </td>

                            <td>
                                <span class="quantity-cell" v-if="item.entity_type === 'set'">
                                    ₹{{ getSetPrice(item).toFixed(2) }}
                                </span>
                                <span class="quantity-cell" v-if="item.entity_type !== 'set' && item.gst_details && item.gst_details.brand_calculated_amount">
                                    <!-- ₹{{ (item.gst_details.brand_calculated_amount * (item.quantity - item.rejected)).toFixed(2) }} -->
                                    ₹{{ (item.gst_details.brand_calculated_amount * (item.quantity - item.rejected)).toFixed(2) }}
                                </span>
                            </td>

                            <td class="book-note-style">
                                <div @click="openBookInfo(item)" v-if="item.entity_type !== 'set' && item.meta">
                                    <inline-svg 
                                        :src="item.meta.custom_message ? 'book-note-present' : 'book-note'"
                                    />
                                </div>
                                <div 
                                    @click="openBookInfo(item)" 
                                    v-if="
                                        item.entity_type === 'set' && 
                                        item.products &&
                                        item.products[0] &&
                                        item.products[0].meta &&
                                        item.products[0].meta.custom_message
                                    ">
                                    <inline-svg 
                                        :src="item.products[0].meta.custom_message ? 'book-note-present' : 'book-note'"
                                    />
                                </div>
                            </td>
                    </tr>
                    <!-- === Item Table Row END ==== -->
                </template>
            </table>

          
            
        </div>
        
        <price-breakup :total="totalPrices" :prices="prices" :couponCode="couponCode" :shipment="shipment" />

        <transition name="slide">
            <template v-if="imageView">
                <div class="drawer-view" @click="close($event)">
                    <div class="drawer-container">
                        <bag-details
                            :imageData="imageData"
                        />
                    </div>
                </div>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="bookInfoView">
                <side-drawer @close="closeDetails()" :title="`More Information`">
                    <more-bag-info
                        :articleData="itemData"
                        :isSet="itemData.entity_type === 'set'"
                    ></more-bag-info>
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { 
    NitrozenChips,
    NitrozenButton, 
    flatBtn, 
    strokeBtn
} from '@gofynd/nitrozen-vue';

/* Component imports */
import CustomInputNumber from '@/components/common/adm-input-number-controls.vue';
import Accordion from '@/components/common/accordion.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import BagDetails from './bag-details.vue'
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import MoreBagInfo from './more-bag-info.vue';
import PriceBreakup from '@/pages/oms/bags-list/price-breakup.vue';

/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils';

export default {
    name: 'bags-list-table',
    props: [
        'items',
        'columns',
        'shipment',
        'readOnlyMode' 
    ],
    directives:{
        flatBtn, 
        strokeBtn
    },
    components: {
        MoreBagInfo,
        SideDrawer,
        BagDetails,
        NitrozenChips,
        NitrozenButton,
        InlineSvg,
        Accordion,
        'custom-input-number': CustomInputNumber,
        PriceBreakup
    },
    data() {
        return {
            isOpen: false,
            imageView: false,
            imageData: [],
            bookInfoView: false,
            itemData: {},
            prices: {},
            formattingItems:true,
            org_items:[],
            mod_items:[],
            promotional_bags_map:new Map()
        }
    },
    computed: {
       
        currentStatus() {
            return this.shipment.bag_status_history.slice(-1)[0].status;
        },
        rejectedQty() {
            let totalRejected = 0;
            totalRejected = this.items.reduce((sum, value) => {
                return sum + value.rejected;
            }, 0);
            return totalRejected;
        },
        finalQty() {
            let finalQuantity = 0;
            finalQuantity = this.items.reduce((sum, value) => {
                let bagQty = value.quantity - value.rejected;
                return sum + bagQty;
            }, 0);
            return finalQuantity;
        },
        totalPrices() {
            let total = 0;
            total = this.items.reduce((sum, item) => {
                let price = item.entity_type === 'set' ? item.financial_breakup.brand_calculated_amount : item.gst_details.brand_calculated_amount;
                let bagTotal = price * (item.quantity - item.rejected);
                return sum + bagTotal;
            }, 0);
            return total;
        },
        couponCode() {
            if(
                this.shipment &&
                this.shipment.coupon &&
                this.shipment.coupon.code
            ) {
                return this.shipment.coupon.code;
            }
            else if(
                !isEmpty(this.items[0]) &&
                !isEmpty(this.items[0].affiliate_bag_details) && 
                this.items[0].affiliate_bag_details.coupon_code
            ) {
                return this.items[0].affiliate_bag_details.coupon_code
            } 
            else {
                return '';
            }
        }
        
    },
    mounted() {
        this.collateItems()
        if(!isEmpty(this.shipment) && this.shipment.prices && !isEmpty(this.shipment.prices)) {
            this.prices = cloneDeep(this.shipment.prices);
        }
    },
    methods: {  
        isEmpty,
        collateItems(){
            /*
                Collation Algorithm for Formatting Bag Items
                --------------------------------------------
                @NOTE: Supports ONLY 1 applied promo

                Init variable promotional_bags Map();
                Init variable formatted_bags Array[];
                
                1. Loop Bag Items and  Segregate promotional bags
                    a. If Bag has applied_promos and promo_id
                        i. Identify if bag is Parent or Child
                            If Bag has parent_promo_bags
                                Mark Bag is child
                            Else
                                Mark Bag is parent
                        
                        ii. Add some more Meta (promo_id)

                        iii. Add/Update Data by promo_id
                            If we have promo_id in promotional_bags Map()
                                Get promo_id object
                                Add to promo_id object in parent and child key respectively
                            Else
                                Create a new key promo_id object in promotional_bags Map()
                                Add to promo_id object in parent and child key respectively
                    b. Else it a normal bag
                        Push bag to formatted_bags

                2. Get all parents out in Main Array - formatted_bags
                
                @TODO If too large bags we can add a loader/shimmer logic

            */

            this.formattingItems = false;
            this.org_items = this.items; // keeping the original reference

            // 1. Loop Bag Items and  Segregate promotional bags
            for(let bag of this.items){
                const bag_promo_id = bag.applied_promos && bag.applied_promos.length && bag.applied_promos[0].promo_id ? bag.applied_promos[0].promo_id : null;
                if(bag_promo_id){
                    const bag_promo_name = bag.applied_promos[0].promotion_name ? bag.applied_promos[0].promotion_name : null;
                    const bag_promo_type = bag.applied_promos[0].promotion_type ? bag.applied_promos[0].promotion_type : null;

                    // Add Meta to Promotional Bag
                    bag["__promo_parent"] = !Boolean(bag.parent_promo_bags && Object.keys(bag.parent_promo_bags).length);
                    bag["__bag_promo_id"] = bag_promo_id;

                    let __promo = {};
                    if(this.promotional_bags_map.has(bag_promo_id)){
                        __promo = this.promotional_bags_map.get(bag_promo_id);
                    }else{
                        __promo = {
                            promo_id: bag_promo_id,
                            promotion_name:bag_promo_name,
                            promotion_type:bag_promo_type,
                            parent:[],
                            child:[]
                        }
                    }
                    __promo[bag.__promo_parent?"parent":"child"].push(bag);
                    this.promotional_bags_map.set(bag_promo_id,__promo);
                }else{
                    this.mod_items.push(bag);
                }
            }

            // 2. Get all parents out in Main Array - this.mod_items
            for (const [_key, _val] of this.promotional_bags_map) {
                if(_val && _val.parent && _val.parent.length){
                    _val.parent[_val.parent.length-1]["__bag_promo_child_count"] =  _val.child.length; //Will serve count and also help in detecting last parent
                    this.mod_items = [..._val.parent,...this.mod_items]
                }
            }
            this.formattingItems = true;
            this.org_items = this.mod_items;
        },
        toggleChildPromoBags(promo_id, index){
            if(this.mod_items[index] && '__bag_promo_id' in this.mod_items[index] && (this.mod_items[index].__bag_promo_id == promo_id) && !this.mod_items[index].__promo_parent){
                // Remove Promo Item
                this.mod_items = this.org_items;
            }else{
                // Add Promo Item
                this.mod_items = this.org_items;
                let promo_child = this.promotional_bags_map.get(promo_id);
                this.mod_items = [...this.mod_items.slice(0, index),...promo_child.child,...this.mod_items.slice(index)];
            }
        },
        getPromoItemClass(index, item){
            let _classes = 'promo-item';
            if(item.__bag_promo_id){
                let hasPrev = this.mod_items[index-1];
                hasPrev = !!(hasPrev && hasPrev.__bag_promo_id && hasPrev.__bag_promo_id === item.__bag_promo_id);
                let hasNext = this.mod_items[index+1];
                hasNext = !!(hasNext && hasNext.__bag_promo_id && hasNext.__bag_promo_id === item.__bag_promo_id);

                if(hasPrev && hasNext){
                    _classes = `${_classes} promo-mid`;
                }else if(hasPrev && !hasNext){
                    _classes = `${_classes} promo-bottom`;
                }else if(!hasPrev && hasNext){
                    _classes = `${_classes} promo-top`;
                }
                if('__bag_promo_child_count' in item && item.__bag_promo_child_count){
                    _classes = `${_classes} promo-bottom-parent`;
                }
                if(!(item.__promo_parent)){
                    _classes = `${_classes} promo-child`;
                }
            }
                                
            return _classes;

        },
        openBookInfo(item) {
            this.bookInfoView = !this.bookInfoView;
            this.itemData = item;
        },
        closeDetails() {
            this.bookInfoView = false;
        },
        openImage(item_details) {
            this.imageView = !this.imageView;
            this.imageData = item_details;
        },     
        close: function (e) {
            e.stopPropagation();
            this.imageView = false;
        }, 
        increment(e, index, isSet=false) {
            let selectedBag = isSet ? this.items.find(bag => bag.products[0].bag_id === e ) : this.items.find(bag => bag.bag_id === e);
            if(selectedBag) {
                selectedBag.rejected += 1;
                this.$set(this.items, index, selectedBag);
                this.$emit('reject');
            } else {
                this.$snackbar.global.showError('Unable to increment the rejected quantity');
                console.error("Bag ID not found for incrementing");
            } 
        },
        decrement(e, index, isSet=false) {
            let selectedBag = isSet ? this.items.find(bag => bag.products[0].bag_id === e ) : this.items.find(bag => bag.bag_id === e);
            if(selectedBag) {
                selectedBag.rejected -= 1;
                this.$set(this.items, index, selectedBag);
                this.$emit('reject');
            } else {
                this.$snackbar.global.showError('Unable to increment the rejected quantity');
                console.error("Bag ID not found for incrementing");
            } 
        },
        onChange(e, index, isSet=false) {
            let selectedBag = isSet ? this.items.find(bag => bag.products[0].bag_id === e.id ) : this.items.find(bag => bag.bag_id === e.id);
            if(selectedBag) {
                selectedBag.rejected = +e.value;
                this.$set(this.items, index, selectedBag);
                this.$emit('reject');
            } else {
                this.$snackbar.global.showError('Unable to change the quantity');
                console.error("Bag ID not found for changing");
            }
        },
        snakeCaseToCaps(text) {
            return convertSnakeCaseToString(text).toUpperCase();
        },
        findSetIdentifier(item) {
            if(item.article) {
                let correctIdentifier = item.article.seller_identifier;
                if(correctIdentifier) {
                    let correctIdentifierKey = '';
                    for(let key in item.article.identifiers) {
                        if(item.article.identifiers[key] === correctIdentifier) {
                            correctIdentifierKey = key;
                            break;
                        }
                    }
                    if(correctIdentifierKey) return `${this.snakeCaseToCaps(correctIdentifierKey)}: ${correctIdentifier}`;
                    else return `${correctIdentifier}`;
                } else return null;
            } else return null;
        },
        getSetPrice(item) {
            let finalPrice = null;
            if(item.financial_breakup && item.financial_breakup.length) {
                finalPrice = item.financial_breakup.reduce((total, bag) => total + bag.brand_calculated_amount, 0);
            }
            return finalPrice;
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../../less/common.less';

.table-container {
    overflow-y: auto;
    box-sizing: border-box;
    max-height: 300px;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    background-color: #ffffff;
    position: relative;

    .list-table {
        border-collapse: collapse; 
        width: 100%;
        margin-bottom: 0px;
        font-family: Inter, sans-serif;
        font-size: 14px;

        .clickable {
            cursor: pointer;
        }

        .row-content {
            display: flex;
            align-items: center;

            .table-header {
                margin-right: 4px;
            }
        }
        
        .table-header-row {
            position: sticky;
            top: 0;
            z-index: 2;
            box-sizing: border-box;
            width: 1094px;
            height: 47.37px;
            background: #F6F6F6;
            cursor: default !important;
            /* colour/border */

            // border: 1px solid #E0E0E0;
            border-bottom: 1px solid #eeeeee;
            border-radius: 4px;
            // background: @Alabaster2;
            // color: @Black;

            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            /* identical to box height, or 142% */
            color: #41434C;
        }

        .footer {
            position: sticky;
            bottom: 0;
            z-index: 1;
            box-sizing: border-box;
            width: 1094px;
            height: 47.37px;
            background: #F6F6F6;
            /* colour/border */

            // border: 1px solid #E0E0E0;
            border-bottom: 1px solid #E0E0E0;
            border-radius: 4px;
            // background: @Alabaster2;
            // color: @Black;

            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            /* identical to box height, or 142% */
            color: #41434C;
        }

        tr:not(:first-child) {
            border-bottom: none;
            width: 1092px;
            height: 64px;
        }
        // tr:last-child {
        //     border-bottom: none;
        // }
        th:first-child {
            // width: 110px;
            padding-left: 24px;
        }
        th {
            position: sticky;
            top: 0;
            vertical-align: middle;
            text-align: left;
            // width: 52.43px;
            height: 17px;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            // font-size: 14px;
            font-size: 12px;
            line-height: 17px;
            /* identical to box height, or 142% */
            color: #41434C;
        }
        th:not(:first-child) {
            padding-left: 5px;
        }
        td {
            vertical-align: middle;
            text-align: left;
            padding: 12px 6px;

            &:first-child {
                padding-left: 24px;
            }
        }
        // tr.line-break td{
        //     position: relative;
        //     top: 0px;
        // }

        tr.line-break{
            position: relative;
            width:auto;
        }

        tr.line-break::after{
            content: '';
            position: absolute;
            bottom: 0px;
            left: 10px;
            right: 10px;
            height: 0.5px;
            background-color: rgb(235,235,235); 
        }

        tr.line-break last-child::after {
            display: none;
        }

        // tr.line-break first-child:after,
        // tr.line-break td:last-child:after {
        //     width: calc(100% - 20px);
        // }
        // tr.line-break td:first-child:after {
        //     right: 0px;
        //     left: auto;
        // }

        .item-image {
            position: relative;
            height: 46px;
            width: 46px;
            border: 0.8px solid #e1dede;
            border-radius: 4px;
            background: white;
            .item-logo {
                object-fit: contain;
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }

        



        .promo-mid:not(.promo-bottom-parent,.promo-child),
        .promo-top:not(.promo-bottom-parent,.promo-child){
            .item-image::before{
                content: '';
                position: absolute;
                width: 0px;
                height: 24px;
                left: 23px;
                top: 47px;
                border: 0.3px dashed #6678DD;
                z-index: 1;
            }
        }

        .promo-bottom-parent{
            td:not(:first-child){
                padding-bottom: 40px;
            }
            .item-image::before{
                content: '';
                position: absolute;
                width: 0px;
                height: 12px;
                left: 23px;
                top: 47px;
                border: 0.3px dashed #6678DD;
            }
        }


        .promo-child{
            .item-image {    
                height: 36px;
                width: 36px;
                margin: 5px;
            }
            .item-image::before{
                content: '';
                position: absolute;
                width: 0px;
                height: 34px;
                left: 18px;
                top: -35px;
                border: 0.3px dashed #6678DD;
            }
        }

        tr {
            font-size: 12px !important;
        }

        .item-details-container {
            display: flex;
            flex-direction: column;
            row-gap: 12px;
            .item-title-block{
                display: flex;
                column-gap: 10px;
            }
        }
        

        .seller-cell {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .identifier {    
                font-weight: 300;
            }

            // .sku {
            //     margin-bottom: 8px;
            // }

            // .ean {
            //     opacity: 0.6;
            // }
        }

        .quantity-cell{
            font-weight: 300;
        }

        .reject-qty {
            width: 60px;
            padding-right: 8px;
            
            ::v-deep .n-input {
                font-size: 12px;
                    height: 35px;
            }
        }

        .ascending {
            transform: rotate(180deg);
        }

        .footer {
            height: 34px !important;
            border-bottom: -1px;
        }
    }
}
.price-breakup-box {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    border: 1px solid #E0E0E0;
    border-radius: 4px 4px 0px 0px;
    margin: 1rem 0rem 0rem 0rem;
    // .filter-price {
    //     // position: absolute;
    //     right: 20px;
    // }
    .style-header {
        font-weight: 600;
        font-size: 14px;
        color: #41434C;
    }

    .filter-arrow-up {
        // margin-left: auto;
        transform: rotate(180deg);
    }

    .filter-arrow-down {
        margin-left: 10px;
        cursor: pointer;
    }

    .label {
        cursor: pointer;
    }
}
::v-deep .outer-container {
    // display: inline;
    align-items: stretch;
    font-weight: 600;
    font-size: 14px;

    .title {
        width: 0%;
    }

    .filter {
        position: relative;
        left: 594px;
        bottom: 6px;
    }
}
.headings-price-breakup {
    display: flex;
    align-items: center;
    // .price-breakup-details {
    //     border: 1px solid #E0E0E0;
    // }

    .style-header1 {
        font-weight: 400;
        font-size: 14px;
        color: #9B9B9B;
    }
}

.styling-font {
    font-weight: 600;
    font-size: 14px;
    color: #41434C;
}

.book-note-style {
    cursor: pointer;
    ::v-deep .inline-svg{
        margin-right: 24px;
    }
}
.item-primary-information {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .item-name, .item-size {
        font-weight: 300;
        font-size: 12px;
        line-height: 17px;
        // color: #4D4D4E;
        width: 142px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .nitro-chips {
        margin-top: 6px;
        display: flex;
        width: fit-content;
    }

    .nitro-chip {
        height: 20px;
        padding: 0 8px;
        margin: 0 6px 0 0;
        display: inline-block;
        cursor: default;
        background: #F6F6F6;
        border-radius: 24px;
        color: #41434c;
        font-size: 10px;
        line-height: 20px;
        vertical-align: middle;
        white-space: nowrap;
        font-family: Inter, sans-serif;
        // cursor: pointer;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        max-width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        border:#E0E0E0;
    }

    &.item-set {
        .nitro-chip {
            max-width: initial;
            width: auto;
            text-overflow: initial;
        }
    }
}

.accordion-arrow-down {
    padding-right: 10px; 
}

.hide {
    display: none;
}

.price-details {
    border: 1px solid #E0E0E0;
    border-top: none;
    // height: 100px;
    text-align: right;
    padding: 1.2rem 3rem 1.2rem 0rem;

    .styling-price-details {
        margin-bottom: 1rem;
    }
    
    .style-price-title {
        font-weight: 400;
        font-size: 12px;
        color: #9B9B9B;
        margin-right: 1rem;
    }

    .style-price {
        font-weight: 400;
        font-size: 12px;
        color: #41434C;
    }
}

.drawer-view{
    height: 100%;
    position: fixed;
    // top: 64px; // To expose header
    top:0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .drawer-container{
        background-color: #ffffff;
        position: absolute;
        right: 34%;
        top: 22%;
        min-width: 28%;
        // min-height: 50%;
        // overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgb(0 0 0 / 10%);
        border-radius: 4px;
        &::-webkit-scrollbar {
            display: none !important;
        }

        @media @mobile {
            position: fixed;
            width: 100%;
        }
    }
}

.offer-products-btn{
    width: 120px;
    height: 24px;
    font-weight: 400;
    font-size: 10px;
    padding: 0px;
    background: #DBE1FF;
    color: #2E31BE;
    border-radius: 4px;
    text-decoration: unset;
    z-index: 1;

    ::v-deep.collapse-icon{
        margin-left: 6px;
        width: 8px;
         svg{
            fill: #2E31BE!important;
        }
    }
    &:hover{
        color:#DBE1FF!important;
        ::v-deep.collapse-icon{
         svg{
            fill:#DBE1FF!important;
        }
    }
    }
}

tr.line-break.promo-top::after{
    display: none;
}
tr.line-break.promo-mid::after{
    display: none;
}

// .promo-bottom{
//     border-top:none;
// }


.bag-list-table {
    cursor: default !important;
}
.tooltip-top{
    display: inline-block;
    position: relative;
    --arrow-size: 6px;
    --arrow-size: 6px;
    &:hover{
        &::after, &::before {
            display: unset;
        }
    }
}

.tooltip-top::before{
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    top: -0.35rem;
    transform: translateX(-50%) translateY(calc(-100% - var(--arrow-size)));
    background-color: #333333;
    color: #F9F9F9;
    font-size: 11px;
    z-index: 2;
    padding: 8px 10px;
    border-radius: 0.5rem;
    width: max-content;
    line-height: 15px;
    max-width: 200px;
    display: none;
}
.tooltip-top::after{
    --translate-y: calc(var(--arrow-size) + 2px);
    content: '';
    border: var(--arrow-size) solid transparent;
    position: absolute;
    top: -0.25rem;
    left: 50%;
    transform: translateX(-50%) translateY(calc(-1 * var(--translate-y)));
    border-top-color: #333333;
    display: none;
}
</style>
