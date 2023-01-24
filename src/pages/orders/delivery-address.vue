<template>
    <div class="address">
        <div class="title bold-sm">Shipping Information</div>
        <div class="address-info">{{ address.name }}</div>
        <!-- <div
            v-if="address.phone && checkReadRole()"
            class="address-info"
            @click="makeACall(address.phone)"
            title="Click to call"
        > -->
        <div
            v-if="address.phone && checkReadRole()"
            class="address-info"
        >
            {{ address.phone }}
            <!-- <adm-inline-svg class="make-a-call" src="call"></adm-inline-svg> -->
        </div>
        <div class="address-info">{{ customer_address }}</div>
    </div>
</template>

<style lang="less" scoped>
.title {
    color: @Mako;
    font-size: 14px;
    margin-bottom: 12px;
}
.address {
    .address-info {
        color: #9b9b9b;
        font-size: 14px;
        line-height: 22px;
    }
}
.make-a-call {
    cursor: pointer;
    display: inline-block !important;
    ::v-deep svg {
        width: 16px;
        height: 16px;
    }
}
</style>

<script>
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
// import { GET_EMPLOYEE_ACCESS_DETAIL } from '@/store/getters.type';
import { mapGetters } from 'vuex';

export default {
    name: 'company-shipment-address',
    components: {
        AdmInlineSvg
    },
    props: {
        address: {}
    },
    computed: {
        customer_address() {
            const customer_address = [
                this.address.address1,
                this.address.address2,
                this.address.area,
                this.address.city,
                this.address.state,
                this.address.country,
                this.address.pincode
            ];
            return customer_address.filter(sa => sa).join(', ');
        },
        ...mapGetters({
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL
        }),
    },
    data() {
        return {};
    },
    methods: {
        // makeACall(phone) {
        //         this.$emit('call', { receiver: phone, title: 'Call Customer' });
        // },
        checkReadRole() {
            const role = true;
                // this.accessDetail &&
                // this.accessDetail.order_role &&
                // (this.accessDetail.order_role != 'read_only');
            return role;
        },
    }
};
</script>
