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
                        :class="`line-break ${getGroupItemClass(indx,item)} bag-list-table`"
                    >
                            <td class="item-details-container" >
                                <div class="item-title-block">
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
                                        <div class="item-name-container tooltip-top" :data-tooltip="item.item.name">
                                            <span class="item-name" @click="copyToClipboard($event, item.item.brand)">
                                                {{item.item.brand}} | 
                                                <span @click="copyToClipboard($event, item.item.name)">{{item.item.name}}</span>
                                            </span>
                                        </div>
                                        <div class="nitro-chips tooltip-top" v-if="item.item.size" :data-tooltip="item.item.size">
                                            <nitrozen-chips 
                                                class="nitro-chip">
                                                {{ item.item.size }}
                                            </nitrozen-chips>
                                        </div>
                                    </div>
                                </div>
                                <nitrozen-button
                                    v-if="item.__bag_group_child_count"
                                    class="offer-products-btn"
                                    theme="secondary"
                                    v-flatBtn
                                    @click="toggleChildGroupBags(item.group_id,indx+1)"
                                > {{item.__bag_group_child_count}} {{item.applied_promos && item.applied_promos.length ? `Offer`:'Group'}} Product{{item.__bag_group_child_count > 1 ? 's':''}} 
                                    <inline-svg class="collapse-icon" :src="mod_items[indx+1] && mod_items[indx+1].group_id === item.group_id ?'close-arrow':'open-arrow'"/>
                                </nitrozen-button>
                            </td>

                            <td>
                                <div class="seller-cell">
                                    <span 
                                        v-for="(identifier, key) in item.article.identifiers" 
                                        :key="identifier"
                                        class="identifier"
                                        :class="{'sku': key === 'sku_code', 'ean': key === 'ean'}"
                                        @click="copyToClipboard($event, identifier)">
                                        {{ snakeCaseToCaps(key) }}: <span class="pointer">{{ identifier }}</span>
                                    </span>
                                </div>
                            </td>

                            <td v-if="currentStatus === 'placed'">
                                <span class="quantity-cell">{{ item.quantity }}</span>
                            </td>

                            <td v-if="currentStatus === 'placed' &&
                                shipment &&
                                shipment.transition_config &&
                                shipment.transition_config.bag_confirmed &&
                                shipment.transition_config.bag_confirmed.can_break_entity &&
                                shipment.transition_config.bag_confirmed.can_break_entity == true &&
                                !readOnlyMode">
                                <span class="quantity-cell">{{ item.quantity - item.rejected }}</span>

                            </td>

                            <td v-if="
                                currentStatus === 'placed' && 
                                shipment &&
                                shipment.transition_config &&
                                shipment.transition_config.bag_confirmed &&
                                shipment.transition_config.bag_confirmed.can_break_entity &&
                                shipment.transition_config.bag_confirmed.can_break_entity == true && 
                                !readOnlyMode" class="reject-qty">
                                <div 
                                    class="group-cancellation" 
                                    v-if="isPartOfGroup(item) && !(mod_items[indx-1]&&item.group_id===mod_items[indx-1].group_id)">
                                    <nitrozen-checkbox
                                        :title="`Cancel all items of the same group by checking this checkbox`"
                                        v-if="isPartOfGroup(item) && !(mod_items[indx-1]&&item.group_id===mod_items[indx-1].group_id)"
                                        :value="item.group_selection"
                                        class="group-cancellation-checkbox"
                                        @change="onGroupSelectionToggle(item, indx)"
                                    />
                                    <nitrozen-tooltip
                                        :position="'top'"
                                        icon="help"
                                        class="questionmark-icon tool-tip-control"
                                    >
                                        <p> 
                                            You can cancel all items belonging to the same group by selecting this
                                            checkbox.
                                        </p>
                                    </nitrozen-tooltip>
                                </div>
                                <custom-input-number 
                                    v-if="!isPartOfGroup(item) && item.is_parent"
                                    class="qty-reject"
                                    :min="0"
                                    :max="item.quantity"
                                    :id="item.bag_id"
                                    :value="item.rejected"
                                    :allowNegative="false"
                                    @increment="increment($event, indx)"
                                    @decrement="decrement($event, indx)"
                                    @change="onChange($event, indx)"
                                />
                            </td>

                            <td v-if="currentStatus !== 'placed'" class="quantity-cell">
                                <span v-if="item.quantity">{{ item.quantity }}</span>
                            </td>

                            <td>
                                <span class="quantity-cell">
                                    ₹{{ formatPrice(item.financial_breakup.brand_calculated_amount * (item.quantity - item.rejected)) }}
                                </span>
                            </td>

                            <td class="book-note-style">
                                <div @click="openBookInfo(item)" v-if="item.meta">
                                    <inline-svg 
                                        :src="item.meta.custom_message ? 'book-note-present' : 'book-note'"
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
    NitrozenCheckBox, NitrozenChips, NitrozenButton, 
    flatBtn, strokeBtn
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
import { convertSnakeCaseToString, formatPrice, copyToClipboard } from '@/helper/utils';

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
        'nitrozen-checkbox': NitrozenCheckBox,
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
            group_bags_map: new Map()
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
                let price = item.financial_breakup.brand_calculated_amount;
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
        this.collateItems();
        if(!isEmpty(this.shipment) && this.shipment.prices && !isEmpty(this.shipment.prices)) {
            this.prices = cloneDeep(this.shipment.prices);
        }
    },
    methods: {  
        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000); 
        },
        isEmpty,
        formatPrice,
        isPartOfGroup(item){
            if(item && item.group_id && this.mod_items && this.mod_items.length){
                const _group = this.group_bags_map.get(item.group_id);
                const group_count = _group.child.length + _group.parent.length;
                return group_count > 1;
            }else{
                return false;
            }
        },
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
                const applied_promos = bag.applied_promos && bag.applied_promos.length ? bag.applied_promos:null;
                const bag_promo_id = applied_promos && applied_promos[0].promo_id ? applied_promos[0].promo_id : null;
                if(bag.group_id){
                    const bag_promo_name = applied_promos && applied_promos[0].promotion_name ? applied_promos[0].promotion_name : null;
                    const bag_promo_type = applied_promos && applied_promos[0].promotion_type ? applied_promos[0].promotion_type : null;
                    let __group = {};
                    if(this.group_bags_map.has(bag.group_id)){
                        __group = this.group_bags_map.get(bag.group_id);
                    } else {
                        __group = {
                            group_id:bag.group_id,
                            promo_id:bag_promo_id,
                            promotion_name:bag_promo_name,
                            promotion_type:bag_promo_type,
                            parent:[],
                            child:[]
                        }
                    }
                    __group[bag.is_parent?"parent":"child"].push(bag);
                    this.group_bags_map.set(bag.group_id,__group);
                    bag['group_selection'] = false;
                } else {
                    this.mod_items.push(bag);
                }
            }

            // 2. Get all parents out in Main Array - this.mod_items
            for (const [_key, _val] of this.group_bags_map) {
                if(_val && _val.parent && _val.parent.length){
                    _val.parent[_val.parent.length-1]["__bag_group_child_count"] =  _val.child.length; //Will serve count and also help in detecting last parent
                    this.mod_items = [..._val.parent,...this.mod_items];
                }
            }
            this.formattingItems = true;
            this.org_items = this.mod_items;
        },
        toggleChildGroupBags(bag_group_id, index){
            if(this.mod_items[index] && 'group_id' in this.mod_items[index] && (this.mod_items[index].group_id == bag_group_id) && !this.mod_items[index].is_parent){
                // Remove Promo Item
                this.mod_items = this.org_items;
            }else{
                // Add Promo Item
                this.mod_items = this.org_items;
                let group_child = this.group_bags_map.get(bag_group_id);
                this.mod_items = [...this.mod_items.slice(0, index),...group_child.child,...this.mod_items.slice(index)];
            }
        },
        getGroupItemClass(index, item){
            let _classes = 'group-item';
            if(item.group_id){
                let hasPrev = this.mod_items[index-1];
                hasPrev = !!(hasPrev && hasPrev.group_id && hasPrev.group_id === item.group_id);
                let hasNext = this.mod_items[index+1];
                hasNext = !!(hasNext && hasNext.group_id && hasNext.group_id === item.group_id);
                if(hasPrev && hasNext){
                    _classes = `${_classes} group-mid`;
                }else if(hasPrev && !hasNext){
                    _classes = `${_classes} group-bottom`;
                }else if(!hasPrev && hasNext){
                    _classes = `${_classes} group-top`;
                }
                if('__bag_group_child_count' in item && item.__bag_group_child_count){
                    _classes = `${_classes} group-bottom-parent`;
                }
                if(!(item.is_parent)){
                    _classes = `${_classes} group-child`;
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
        increment(e, index) {
            let selectedBag = this.items.find(bag => bag.bag_id === e);
            if(selectedBag) {
                selectedBag.rejected += 1;
                this.$set(this.items, index, selectedBag);
                this.$emit('reject');
            } else {
                this.$snackbar.global.showError('Unable to increment the rejected quantity');
                console.error("Bag ID not found for incrementing");
            } 
        },
        decrement(e, index) {
            let selectedBag = this.items.find(bag => bag.bag_id === e);
            if(selectedBag) {
                selectedBag.rejected -= 1;
                this.$set(this.items, index, selectedBag);
                this.$emit('reject');
            } else {
                this.$snackbar.global.showError('Unable to increment the rejected quantity');
                console.error("Bag ID not found for incrementing");
            } 
        },
        onChange(e, index) {
            let selectedBag = this.items.find(bag => bag.bag_id === e.id);
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

        /**
         * Method to handle the checking/unchecking of the checkbox for group items.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {Object} item The individual bag item where the checkbox has been toggled
         * @param {Number} index The index/position of the bag item.
         */
        onGroupSelectionToggle(item, index) {
            /** 
             * Fetch the group ID and whether the group items were selected or not 
             * BEFORE user clicked and changed the value of the checkbox.
             */
            let selectedGroupId = item.group_id;
            let beforeSelectionValue = item.group_selection;
            /**
             * Run through every item and make changes to
             * the group selection.
             */
            for(let item of this.items) {
                /** 
                 * If item is a part of group, we will make changes, else continue to next item.
                 */
                if(item.group_id === selectedGroupId) {
                    /**
                     * If the value BEFORE user clicked on checkbox was false, i.e.,
                     * the user just selected the entire group for cancellation,
                     * we will change its group_selection value and add the entire
                     * quantity to the rejected key.
                     * Else, we turn off the group_selection value and make the 
                     * rejected key's value as 0.
                     */
                    if(beforeSelectionValue === false) {
                        item.group_selection = true;
                        item.rejected = item.quantity;
                    } else {
                        item.group_selection = false;
                        item.rejected = 0;
                    }
                } else continue;
            }
            /**
             * If the user is changing the value to true, i.e.,
             * the user is selecting the entire group for cancellation,
             * we will show a warning telling the user that the entire
             * group is getting cancelled.
             */
            if(beforeSelectionValue === false) {
                this.$snackbar.global.showWarning(
                    `All items belonging to this group will be cancelled`,
                    3000
                );
            }
            /**
             * The following code is used for force setting and updating
             * the final quantity value in the table.
             */
            let selectedBag = this.items.find(bag => bag.bag_id === item.bag_id);
            if(selectedBag) {
                this.$set(this.items, index, selectedBag);
            } else {
                this.$snackbar.global.showError('Unable to change the quantity');
                console.error("Bag ID not found for changing");
            }
            /**
             * The following code will update the confirm/cancel button for
             * the shipment.
             */
            this.$emit('reject');
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../../less/common.less';

.pointer{
    cursor: pointer;
}

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
            cursor: pointer;
            
            .item-logo {
                object-fit: contain;
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }

        .group-item{
            .item-image{
                border: 0.1px solid #6678DD;
            }
        }

        .group-mid:not(.group-bottom-parent,.group-child),
        .group-top:not(.group-bottom-parent,.group-child){
            .item-image::before{
                content: '';
                position: absolute;
                width: 0px;
                height: 24px;
                left: 23px;
                top: 46px;
                border: 0.3px dashed #6678DD;
                z-index: 1;
            }
        }

        .group-bottom-parent{
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


        .group-child{
            .item-image {    
                height: 36px;
                width: 36px;
                margin: 5px;
            }
            .item-image::before{
                content: '';
                position: absolute;
                width: 0px;
                height: 33px;
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
            padding-right: 10px;
            
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

    .item-name-container {
        width: fit-content;
    }

    .item-name, .item-size {
        font-weight: 300;
        font-size: 12px;
        line-height: 17px;
        // color: #4D4D4E;
        display: inline-block;
        max-width: 142px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
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

tr.line-break.group-top::after{
    display: none;
}
tr.line-break.group-mid::after{
    display: none;
}

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

.group-cancellation {
    display: flex;
    justify-content: center;
    align-items: center;
    .group-cancellation-checkbox {
        margin-top: -20px;
    }
}
</style>
