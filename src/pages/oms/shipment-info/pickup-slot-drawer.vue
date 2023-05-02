<template>
    <div class="pickup-slot-drawer">
        <div class="nitrozen-dropdown-selection">
            <nitrozen-dropdown
                label="Choose Pickup Slot*"
                @change="changeSlotRange($event)"
                :items="pickUpSlotOptions"
                v-model="selectedSlotRange"
            ></nitrozen-dropdown>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';

/* Library import */
import isEmpty from 'lodash/isEmpty';

export default {
    name: "pickup-slot-drawer",
    props: {
       pickUpSlotOptions: Array,
    },
    data() {
        return {
            selectedSlotRange: '',
        }
    },
    mounted() {
        /** enableSubmit disables the button. So, if we are sending
         * true, it means we want to disable the submit button.
         */
        this.$emit("enableSubmit", true);  
    },
    components: {
        NitrozenDropdown,
    },
    methods: {
        changeSlotRange(value) {
            if(!isEmpty(this.selectedSlotRange)) {
                this.$emit("enableSubmit", false);
            }
        },
        sendSelectedSlots() {
            this.$emit("callPickupSlotApi", this.selectedSlotRange)
        },
    }

}
</script>

<style lang="less" scoped> 
.pickup-slot-drawer {
    .content-header {
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
        color: #9B9B9B;
        margin-bottom: 1rem;
    }
    .nitrozen-dropdown-selection {
        margin-top: 1rem;
        ::v-deep .nitrozen-dropdown-label {
            padding-bottom: 8px;
        }
    }
}
</style>