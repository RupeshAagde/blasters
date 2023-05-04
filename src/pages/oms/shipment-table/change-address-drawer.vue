<template>
    <div class="bank-details-drawer-head">
         <nitrozen-dropdown
            class="employee"
            label="Select Address Type"
            placeholder="Select Address Type"
            :items="addressTypes"
            v-model="selectedAddressType"
            @input="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Name*"
            type="text"
            :placeholder="`Customer`"
            v-model="name"
            @input="onValueChange('')"
        />

        <div class="email-address-box">
            <nitrozen-input
                class="search-input"
                label="Email"
                type="email"
                :placeholder="`Enter Email`"
                v-model="email"
                @input="onValueChange('email')"
            />
            <span v-if="email.length > 0 && invalidEmail" class="address-input-error">
                Please enter a valid email address
            </span>
        </div>

        <div class="phone-box">
            <nitrozen-input
                class="search-input"
                label="Phone*"
                type="tel"
                :placeholder="`Enter Phone Number`"
                v-model="phoneNumber"
                @input="onValueChange('phone')"
            />
            <span v-if="invalidPhone" class="address-input-error">
                Please enter valid 10 digit phone number
            </span>
        </div>
        
        <div class="pincode-box">
            <nitrozen-input
                class="search-input"
                label="Pincode*"
                type="tel"
                :placeholder="`Enter Pincode`"
                v-model="pincode"
                @input="onValueChange('pincode')"
            />
            <span v-if="invalidPincode" class="address-input-error">
                Please enter valid 6 digit pincode number
            </span>
        </div>
        

        <nitrozen-input
            class="search-input"
            label="City*"
            type="text"
            :placeholder="`Enter City`"
            v-model="city"
            @input="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="State*"
            type="text"
            :placeholder="`Enter State`"
            v-model="state"
            @input="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Area"
            type="text"
            :placeholder="`Enter Area`"
            v-model="area"
            @input="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Landmark"
            type="text"
            :placeholder="`Enter Landmark`"
            v-model="landmark"
            @input="onValueChange('')"
        />

        <nitrozen-input
            class="search-input"
            label="Address"
            type="textarea"
            :placeholder="`Enter address here`"
            v-model="address"
            :showTooltip="true"
            tooltipText="Enter your address"
            @input="onValueChange('')"
        />
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

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
            originalData: "",
            selectedAddressType: "",
            phoneNumber: "",
            pincode: "",
            state: "",
            validForm: false,
            invalidEmail: false,
            invalidPhone: false,
            invalidPincode: false
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        NitrozenInput
    },
    mounted(){
        if(this.shipment.delivery_details) {
            this.name = this.shipment.delivery_details.name || '';
            this.email = this.shipment.delivery_details.email || '';
            this.phoneNumber = this.shipment.delivery_details.phone || '';
            this.area = this.shipment.delivery_details.area || '';
            this.city = this.shipment.delivery_details.city || '';
            this.country = this.shipment.delivery_details.country || 'India';
            this.landmark = this.shipment.delivery_details.landmark || '';
            this.state = this.shipment.delivery_details.state || '';
            this.pincode = this.shipment.delivery_details.pincode || '';
            this.selectedAddressType = this.shipment.delivery_details.address_type || '';
            this.address = this.shipment.delivery_details.address1 || '';
            this.originalData = cloneDeep(this.shipment.delivery_details);
        }
    },
    methods: {

        onValueChange(inputType) {
            let emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            let numRegex = new RegExp(/^\d+$/);

            switch (inputType) {
                case 'email':
                    this.invalidEmail = !emailRegex.test(this.email);
                    break;
                case 'phone':
                    this.invalidPhone = !numRegex.test(this.phoneNumber) || this.phoneNumber.toString().length !== 10;
                    break;
                case 'pincode':
                    this.invalidPincode = !numRegex.test(this.pincode) || this.pincode.toString().length !== 6;
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

            this.validForm = (this.email.length > 0 && emailRegex.test(this.email)) ||
                (numRegex.test(this.phoneNumber) && 
                this.phoneNumber.toString().length === 10 && 
                numRegex.test(this.pincode) && 
                this.pincode.toString().length === 6);
    
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

.address-input-error {
    font-size: 12px;
    color: #E9783D;
}
</style>