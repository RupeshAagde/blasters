<template>
    <div class="bank-details-drawer-head">
         <nitrozen-dropdown
            class="employee"
            label="Select Address Type"
            placeholder="Enter Account Number"
            @change="selectAddressType"
            :items="addressTypes"
            v-model="selectedAddressType"
        >
        </nitrozen-dropdown>

        <nitrozen-input
            class="search-input"
            label="Name*"
            type="text"
            :placeholder="`Customer`"
            v-model="name"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Email"
            type="text"
            :placeholder="`Enter Email`"
            v-model="email"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Phone*"
            type="text"
            :placeholder="`Enter Phone Number`"
            v-model="phoneNumber"
        ></nitrozen-input>
        
        <nitrozen-input
            class="search-input"
            label="Pincode*"
            type="text"
            :placeholder="`Enter Pincode`"
            v-model="pincode"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="City*"
            type="text"
            :placeholder="`Enter City`"
            v-model="city"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="State*"
            type="text"
            :placeholder="`Enter State`"
            v-model="state"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Area"
            type="text"
            :placeholder="`Enter Area`"
            v-model="area"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Landmark"
            type="text"
            :placeholder="`Enter Landmark`"
            v-model="landmark"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Address"
            type="textarea"
            :placeholder="`Enter address here`"
            v-model="address"
            :showTooltip="true"
            tooltipText="Enter your address"
        ></nitrozen-input>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: "change-address-drawer",
    props: {
    //    dpOptionsData: Object,
    },
    data() {
        return {
            selectedAddressType: "",
            name: "",
            email: "",
            phoneNumber: "",
            pincode: "",
            city: "",
            state: "",
            area: "",
            landmark: "",
            address: "",
            addressTypes: [
                {
                    text: "Home",
                    value: "home"
                },
                {
                    text: "Store",
                    value: "store"
                },
                {
                    text: "Gaav",
                    value: "gaav"
                },
            ]
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
    methods: {
        selectAddressType() {
            console.log("Selected bag stage:: :", this.selectedAddressType);
        },
    }
}
</script>

<style lang="less" scoped> 

.bank-details-drawer-head {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 70px;
}

</style>