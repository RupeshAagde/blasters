<template>
    <div class="bank-details-drawer-head">
         <nitrozen-dropdown
            class="employee"
            label="Select Address Type"
            placeholder="Enter Account Number"
            :items="addressTypes"
            v-model="selectedAddressType"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Name*"
            type="text"
            :placeholder="`Customer`"
            v-model="name"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Email"
            type="email"
            :placeholder="`Enter Email`"
            v-model="email"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Phone*"
            type="text"
            :placeholder="`Enter Phone Number`"
            v-model="phoneNumber"
            @change="onValueChange"
        />
        
        <nitrozen-input
            class="search-input"
            label="Pincode*"
            type="text"
            :placeholder="`Enter Pincode`"
            v-model="pincode"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="City*"
            type="text"
            :placeholder="`Enter City`"
            v-model="city"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="State*"
            type="text"
            :placeholder="`Enter State`"
            v-model="state"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Area"
            type="text"
            :placeholder="`Enter Area`"
            v-model="area"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Landmark"
            type="text"
            :placeholder="`Enter Landmark`"
            v-model="landmark"
            @change="onValueChange"
        />

        <nitrozen-input
            class="search-input"
            label="Address"
            type="textarea"
            :placeholder="`Enter address here`"
            v-model="address"
            :showTooltip="true"
            tooltipText="Enter your address"
            @change="onValueChange"
        />
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';

/* Components import */
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: "change-address-drawer",
    props: {
        shipmentId: String
    },
    data() {
        return {
            address: "",
            addressTypes: [
                {
                    text: "Home",
                    value: "home"
                },
                {
                    text: "Store",
                    value: "store"
                }
            ],
            area: "",
            city: "",
            country: 'India',
            email: "",
            landmark: "",
            name: "",
            selectedAddressType: "",
            phoneNumber: "",
            pincode: "",
            state: ""
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,        
        NitrozenInput,
    },
    methods: {
        onValueChange() {
            let addressObj = {
                name: this.name,
                phone: this.phoneNumber,
                email: this.email,
                area: this.area,
                landmark: this.landmark,
                city: this.city,
                address: this.address,
                pincode: this.pincode,
                state: this.state,
                address_type: this.selectedAddressType,
                address_category: this.selectedAddressType,
                country: this.country,
                shipment_id: this.shipmentId
            };

            this.$emit('change', addressObj);
        }
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

.employee {
    ::v-deep .nitrozen-select__trigger {
        font-size: 12px;
    }
}
</style>