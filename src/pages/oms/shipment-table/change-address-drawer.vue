<template>
    <div class="bank-details-drawer-head">
         <nitrozen-dropdown
            class="employee"
            label="Select Address Type"
            placeholder="Select Address Type"
            :items="addressTypes"
            v-model="selectedAddressType"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Name*"
            type="text"
            :placeholder="`Customer`"
            v-model="name"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Email"
            type="email"
            :placeholder="`Enter Email`"
            v-model="email"
            @change="onValueChange('email')"
        />

        <nitrozen-input
            class="search-input"
            label="Phone*"
            type="tel"
            :placeholder="`Enter Phone Number`"
            v-model="phoneNumber"
            @change="onValueChange('phone')"
        />
        
        <nitrozen-input
            class="search-input"
            label="Pincode*"
            type="tel"
            :placeholder="`Enter Pincode`"
            v-model="pincode"
            @change="onValueChange('pincode')"
        />

        <nitrozen-input
            class="search-input"
            label="City*"
            type="text"
            :placeholder="`Enter City`"
            v-model="city"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="State*"
            type="text"
            :placeholder="`Enter State`"
            v-model="state"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Area"
            type="text"
            :placeholder="`Enter Area`"
            v-model="area"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Landmark"
            type="text"
            :placeholder="`Enter Landmark`"
            v-model="landmark"
            @change="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Address"
            type="textarea"
            :placeholder="`Enter address here`"
            v-model="address"
            :showTooltip="true"
            tooltipText="Enter your address"
            @change="onValueChange('')"
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
        shipment: Object
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
                    text: "Office",
                    value: "office"
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
            state: "",
            validForm: false
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,        
        NitrozenInput,
    },
    mounted(){
        this.name = this.shipment.user.first_name + ' ' + this.shipment.user.last_name || '';
        this.email = this.shipment.user.email || '';
        this.phoneNumber = this.shipment.user.mobile || '';
        if(this.shipment.delivery_details){
            this.area = this.shipment.delivery_details.area || '';
            this.city = this.shipment.delivery_details.city || '';
            this.country = this.shipment.delivery_details.country || 'India';
            this.landmark = this.shipment.delivery_details.landmark || '';
            this.state = this.shipment.delivery_details.state || '';
            this.pincode = this.shipment.delivery_details.pincode || '';
            this.selectedAddressType = this.shipment.delivery_details.address_type || '';
            this.address = this.shipment.delivery_details.address || '';
        }
    },
    methods: {
    onValueChange(inputType) {

    let emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    let numRegex = new RegExp(/^\d+$/);

    switch (inputType) {
        case 'email':
            if (emailRegex.test(this.email)) {
            } else {
                this.$snackbar.global.showError('Please enter a valid email address');
            }
            break;
        case 'phone':
            if (numRegex.test(this.phoneNumber) && this.phoneNumber.toString().length === 10 ) {
            } else {
                this.$snackbar.global.showError('Please enter numbers only for phone number');
            }
            break;
        case 'pincode':
            if (numRegex.test(this.pincode) && this.pincode.toString().length === 6 ) {
            } else {
                this.$snackbar.global.showError('Please enter numbers only for pincode number');
            }
            break;
    }

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
            country: this.country,
            shipment_id: this.shipmentId
        };

        if(emailRegex.test(this.email) && numRegex.test(this.phoneNumber) && numRegex.test(this.pincode)){
            this.validForm = true
        } else {
            this.validForm = false
        }
    
        this.$emit('change', addressObj, this.validForm);
    
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