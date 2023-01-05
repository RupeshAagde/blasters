<template>
    <div class="rejection-reason-container">
        <div class="remaining-alert alert" v-if="remainingQuantity > 0">
            Rejection reason required for {{ remainingQuantity }} out of {{ total_quantity }} qty
        </div>
        <div class="resolved-alert alert" v-else-if="remainingQuantity === 0 && allReasonsAdded">
            Rejection reason added for all the quantities
        </div>
        <div class="alert irregular-qty" v-if="irregularQtyAdded">
            You have added more items for rejection than available items.
        </div>

        <div class="headers">
            <span>Quantity</span>
            <span>Rejection Reason</span>
        </div>

        <div 
            class="input-containers"
            v-for="(item, index) in items"
            :key="index">
            <nitrozen-input
                class="nitro-input-container"
                :max="item.max"
                :min="0"
                :type="'number'"
                @change="onQuantityChange($event, item)"
                v-model="item.quantity"
                :disabled="full_cancellation"
            ></nitrozen-input>
            <nitrozen-dropdown
                class="nitro-dropdown-container"
                label="Filters"
                :items="reasons"
                @change="onAddingReason"
                v-model="item.reason"
                placeholder="Select reason"
            ></nitrozen-dropdown>
            <div 
                class="delete-container"
                @click="deleteInputBox(index)"
                v-if="items.length > 0 && index > 0">
                <adm-inline-svg :src="'delete-bin'"></adm-inline-svg>
            </div>
        </div>

        <div class="add-qty-btn-container">
            <nitrozen-button
                class="container-add-qty-btn"
                theme="secondary"
                @click="addInputs"
                :disabled="(remainingQuantity <= 0 && allReasonsAdded) || (items.length === total_quantity) || full_cancellation"
            >
                + Add Quantity
            </nitrozen-button>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Helper imports */
import { cancellationReasons } from '@/pages/oms/fixtures/cancellation-reasons.js';
import AdmInlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'rejection-reason',
    props: {
        total_quantity: Number,
        rejected_quantity: Number,
        id: [String, Number],
        full_cancellation: Boolean,
        isSet: Boolean
    },
    components: {
        AdmInlineSvg,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInput
    },
    computed: {
        remainingQuantity() {
            let addedItems = this.items.reduce((total, item) => {
                let quantity = item.reason !== null ? item.quantity : 0;
                return total + quantity;
            }, 0);
            return this.total_quantity - addedItems;
        },
        allReasonsAdded() {
            return this.items.every(item => item.reason !== null);
        },
        irregularQtyAdded() {
            return this.remainingQuantity < 0;
        }
    },
    data() {
        return {
            items: [
                {
                    quantity: this.full_cancellation ? this.total_quantity : 0,
                    reason: null,
                    max: this.total_quantity
                }
            ],
            reasons: cloneDeep(cancellationReasons).store_manager
        }
    },
    methods: {
        addInputs() {
            this.items.push({
                quantity: 0,
                reason: null,
                max: this.remainingQuantity
            })
        },
        deleteInputBox(index) {
            this.items.splice(index, 1);
            this.$emit('bagReasonsAdded', false);
        },
        onAddingReason() {
            if(this.remainingQuantity === 0 && this.allReasonsAdded) {
                this.$emit('bagReasonsAdded', true, this.id, this.items);
            } else if(this.remainingQuantity === 0 && !this.allReasonsAdded) {
                let emptyInputs = this.items.some(item => item.quantity === 0 || item.reason === null);
                if(emptyInputs) {
                    this.items = this.items.filter(item => item.reason !== null);
                }
            } else if(this.remainingQuantity < 0) {
                this.$snackbar.global.showError('You have added more items for rejection than the total number of items available');
            } else {
                this.$emit('bagReasonsAdded', false);
            }
        },
        onQuantityChange(event, item) {
            if(event.target.value >= 0) {
                if(this.remainingQuantity === 0 && this.allReasonsAdded) {
                    let emptyInputs = this.items.some(item => item.quantity === 0 || item.reason === null);
                    if(emptyInputs) {
                        this.items = this.items.filter(item => item.quantity !== 0 && item.reason !== null);
                    }
    
                    this.$emit('bagReasonsAdded', true, this.id, this.items);
                } else {
                    this.$emit('bagReasonsAdded', false);
                }
            } else {
                item.quantity = 0;
                this.$snackbar.global.showError('You cannot add negative values for the number of items', { duration: 3000 });
            }
        }
    }
}
</script>

<style lang="less" scoped>
.rejection-reason-container {
    color: #41343C;

    .alert {
        padding: 6px 15px;
        font-size: 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        width: fit-content;

        &.remaining-alert,
        &.irregular-qty {
            background: #FFE7E7;
        }

        &.resolved-alert {
            background: #F2FFF7;
        }
    }

    .headers,
    .input-containers {
        display: grid;
        grid-template-columns: 1fr 3fr 24px;
        column-gap: 4%;

        .nitrozen-dropdown-label {
            display: none;
        }
    }

    .headers {
        font-size: 12px;
        color: #9B9B9B;
        font-weight: 400;
        margin-bottom: 8px;
    }

    .input-containers {
        margin-bottom: 8px;
        align-items: center;

        &:last-child {
            margin-bottom: 0;
        }

        ::v-deep .nitrozen-dropdown-label {
            display: none;
        }

        .delete-container {
            cursor: pointer;
        }

        ::v-deep .n-input,
        ::v-deep .nitrozen-select__trigger {
            border-radius: 4px;
        }
    }

    .add-qty-btn-container {
        ::v-deep .n-button-content {
            font-size: 12px;
            font-weight: 600;
        }
    }
}
</style>
