<template>
    <div class="panel">
        <page-header
            title="General Configuration"
            @backClick="
                $router.push({
                    path: '/administrator/support/category-listing',
                })
            "
        >
        </page-header>
        <div class="container">
            <div class="input">
                <div class="field">
                    <nitrozen-input
                        class="number-input"
                        v-model="phoneNumber"
                        label="Phone Number"
                    ></nitrozen-input>
                    <!-- <nitrozen-error
                        @input="onChange($event)"
                        class="error"
                        :style="{
                            visibility:
                                phoneNumber && !validatePhone
                                    ? 'visible'
                                    : 'hidden',
                        }"
                        >{{
                            'Please enter a valid 10 digit phone number'
                        }}</nitrozen-error
                    > -->
                    <nitrozen-input
                        class="email-input"
                        v-model="email"
                        label="Email"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="error"
                        :style="{
                            visibility:
                                email && !validateEmail(email)
                                    ? 'visible'
                                    : 'hidden',
                        }"
                        >{{ 'Please enter a valid email ID' }}</nitrozen-error
                    >
                </div>
            </div>
            <div class="toggle-container">
                <div class="show-toggle">
                    <label class="label-text"> Show Contact Info </label>
                    <nitrozen-toggle-btn
                        v-model="contactInfoStatus"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="show-toggle">
                    <label class="label-text"> Show Ticket Listing </label>
                    <nitrozen-toggle-btn
                        v-model="ticketListingStatus"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="show-toggle">
                    <label class="label-text"> Allow Ticket Creation </label>
                    <nitrozen-toggle-btn
                        v-model="ticketCreationStatus"
                    ></nitrozen-toggle-btn>
                </div>
            </div>
            <div class="btn-container">
                <nitrozen-button
                    class="save-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="save()"
                >
                    Save
                </nitrozen-button>
            </div>
        </div>
    </div>
</template>
<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    NitrozenToggleBtn,
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import emailValidator from 'email-validator';
import SupportService from '../../../services/support.service';
export default {
    name: 'general-Configuration',
    components: {
        NitrozenButton,
        'nitrozen-error': NitrozenError,
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-input': NitrozenInput,
    },
    data() {
        return {
            phoneNumber: '',
            email: '',
            contactInfoStatus: false,
            ticketListingStatus: false,
            ticketCreationStatus: false,
            // validatePhone: true,
        };
    },
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        // onChange(e) {
        //     var reg = new RegExp('(0|91([- ]?))?[0-9]{10}').test(e);
        //     console.log(reg, '>>reg');
        //     this.validatePhone = reg;
        // },
        validateEmail(email) {
            return emailValidator.validate(String(email).toLowerCase().trim());
        },
        save() {
            let data = {
                support_phone: this.phoneNumber,
                support_email: this.email,
                show_contact_info: this.contactInfoStatus,
                show_ticket_listing: this.ticketListingStatus,
                allow_ticket_creation: this.ticketCreationStatus,
            };
            SupportService.GeneralConfig(data)
                .then(() => {
                    this.$snackbar.global.showSuccess(
                        'Setting changes successfully'
                    );
                })
                .catch(() => {
                    this.$snackbar.global.showError('Fails to change setting');
                });
        },
        getGeneralConfiguration() {
            SupportService.getGeneralConfig()
                .then((response) => {
                    this.contactInfoStatus = response.data.show_contact_info;
                    this.ticketListingStatus =
                        response.data.show_ticket_listing;
                    this.ticketCreationStatus =
                        response.data.allow_ticket_creation;
                })
                .catch((err) => {
                    console.log(err, '>>err');
                });
        },
    },
};
</script>
<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.container {
    position: relative;
    background-color: white;
    margin: 5% 22% 35% 22%;
    padding: 24px;
    top: 56.5px;
}
.input {
    position: relative;
    // margin-top: 16px;
}
.number-input {
    width: 350px;
}
.email-input {
    width: 350px;
}
.field {
    display: flex;
    flex-direction: column;
}
.btn-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
.toggle-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-top: -24px;
}
.label-text {
    padding: 6px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #9b9b9b;
}
.show-toggle {
    display: flex;
    margin-top: 24px;
}
</style>
