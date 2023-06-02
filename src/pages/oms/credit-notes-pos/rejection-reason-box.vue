<template>
    <div class="rejection-reason-box-container">
        <div class="title-content">Enter the quantity and specify the reason for return</div>
        <div class="selection-dropdowns return-quantity-wrapper">
            <div>
                <div>
                    <div class="rejection-reason-dropdown-label">Quantity</div>
                        <custom-input-number 
                            class="qty-reject"
                            :min="canBreakEntity?1:quantity"
                            :max="quantity"
                            :id="id"
                            :value="returnQuantity"
                            :allowNegative="false"
                            @increment="increment($event)"
                            @decrement="decrement($event)"
                            @change="onChange($event)"
                            :disabled="!canBreakEntity"
                        />
                </div>
            </div>
            <div>
                <div 
                    class="input-containers"
                    v-for="(item, index) in items"
                    :key="index">
                        <nitrozen-dropdown
                            class="nitro-dropdown-container advanced-filter-dropdown dropdown-number"
                            label="Select reason"
                            :items="reasons"
                            @change="onAddingReason"
                            v-model="item.reason"
                            placeholder="Select reason"
                            ref="dropdown-number"
                        ></nitrozen-dropdown>
                    <nitrozen-error class="error" v-if="errorMsg">
                        Please specify the reason for return
                    </nitrozen-error>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* Package imports */
import {
    NitrozenDropdown,
    NitrozenError,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import CustomInputNumber from '@/components/common/adm-input-number-controls.vue';

/* Helper imports */
import isEmpty from 'lodash/isEmpty';

export default {
    name: 'rejection-reason-box',
    components: {
        NitrozenDropdown,
        'nitrozen-error': NitrozenError,
        'custom-input-number': CustomInputNumber,
    },
    props: {
        id: [String, Number],
        reasons:{type: Array},
        itemQuantity:[String, Number],
        itemSelected:{type: Array},
        perUnitPrice:{String, Number},
        shipmentBags: {type: Array},
        sellerIdentifier:{String, Number},
        lineNumber:{String, Number},
        canBreakEntity:{type: Boolean}
    },
    data() {
        return {
            errorMsg:false,
            items: [
                {
                    reason: null,
                }
            ],
            returnQuantity: this.canBreakEntity?1:this.itemQuantity,
            quantity: this.itemQuantity,
        };
    },
    watch:{
        itemSelected(){
            this.selectedOrder();
        }
    },
    mounted() {
            if(document){
                let ele=document.querySelector(".change-bag-state-container");
                    if(ele){
                        ele.addEventListener('click', this.checkOutsideClick);
                    }
            }
    },
    beforeDestroy() {
        // remove listener
        document.removeEventListener('click', this.checkOutsideClick);
    },
    methods: {
        checkOutsideClick(event) {
            let parentDropdown = event.target.closest('.advanced-filter-dropdown');
            if(parentDropdown) {
                let classList = Array.from(parentDropdown.classList);
                let selectedRef = null;
                for(let className of classList) {
                    if(className.includes('dropdown-number')) {
                        selectedRef = className;
                        break;
                    }
                }
                if(selectedRef) {
                    for(let refId in this.$refs) {
                        if(refId.includes('dropdown-number') && refId !== selectedRef) {
                            if(Array.isArray(this.$refs[refId])) {
                                this.$refs[refId][0].showOptions = false;
                            } else {
                                this.$refs[refId].showOptions = false;
                            }
                        }
                    }
                }
            } else {
                for(let refId in this.$refs) {
                    if(refId.includes('dropdown-number') && !isEmpty(this.$refs[refId])) {
                        if(Array.isArray(this.$refs[refId]) && this.$refs[refId]) {
                            this.$refs[refId][0].showOptions = false;
                        } else if(this.$refs[refId]) {
                            this.$refs[refId].showOptions = false;
                        }
                    }
                }
            }
        },
        decrement(e) {
            let reasonId=this.items.length?this.items[0].reason:false;
            let selectedBag = this.shipmentBags.find(bag => bag.bag_id === e);
            if(selectedBag && this.returnQuantity>0) {
                this.returnQuantity -= 1;
                if(reasonId){
                    return this.onAddingReason();
                }
            } else {
                console.error("Bag ID not found for decrementing");
            } 
        },
        increment(e) {
            let reasonId=this.items.length?this.items[0].reason:false;
            let selectedBag = this.shipmentBags.find(bag => bag.bag_id === e);
            if(selectedBag) {
                this.returnQuantity += 1;
                if(reasonId){
                    return this.onAddingReason();
                }
            } else {
                console.error("Bag ID not found for incrementing");
            } 
        },
        onChange(e) {
            let reasonId=this.items.length?this.items[0].reason:false;
            let selectedBag = this.shipmentBags.find(bag => bag.bag_id === e.id);
            if(selectedBag) {
                this.returnQuantity = +e.value;
                if(reasonId){
                    return this.onAddingReason();
                }
            } else {
                this.$snackbar.global.showError('Unable to change the quantity');
                console.error("Bag ID not found for changing");
            }
        },
        onAddingReason(){
                let reasonArr=this.reasons.filter(data=>data.value==this.items[0].reason)
                let reason_text=reasonArr[0].text;
                let reasonId=this.items[0].reason;
                this.errorMsg=false;
                if(!this.errorMsg){
                     this.$emit('bagReasonsAdded', this.id, reasonId,reason_text,this.returnQuantity,this.perUnitPrice, this.sellerIdentifier,this.lineNumber);
                }
        },
        selectedOrder(){
            if(this.itemSelected.length<1){
                return false;
            }
            this.itemSelected.forEach(item=>{
                if(item==this.id && typeof this.items[0].reason=='object'){
                    return this.errorMsg=true;
                }
            })
        },
    }

}
</script>

<style scoped lang="less">
.rejection-reason-box-container{
        width: 340px;
        margin-right: 12px;
        @media @mobile{
            width: auto;
        }
    }
    .quantity{
        font-weight: 600;
        font-size: 16px;
        margin-left: 7px;
        margin-right: 7px;
    }

    .select-quantity-container{
        margin-top: 16px;
        display: flex;
        align-items: center;
    }

    .return-quantity-wrapper{
        display: grid;
        grid-template-columns: 25% 75%;
        column-gap: 1rem;
    }

    .update-item-quantity{
        border: 1px solid #E0E0E0;
        color: #B8B8B8;
        cursor: pointer;
        border-radius: 50%;
        height: 38px;
        width: 38px;
        display: flex;
        align-items: center;
        justify-content: center;

        span{
        font-size: 25px;
        margin-top: -5px;
        }
    }
    .mr-40{
        .qty-reject{
            margin-top: 10px;
        }
    }
    .rejection-reason-dropdown-label {
        color: #9b9b9b;
        font-family: Inter,sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 21px;
    }
    @media @mobile{
        .rejection-reason-box-container{
            margin-top: 10px;
        }
    }
</style>
