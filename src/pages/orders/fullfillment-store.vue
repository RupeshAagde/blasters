<template>
    <div class="address">
        <div class="title bold-sm">Store Information</div>
        <div class="address-info"><span>ID: </span>#{{ address.id }}</div>
        <div class="address-info"><span>Code: </span>{{ address.code }}</div>
        <div class="address-info"><span>Name: </span>{{ address.name }}</div>
        <div 
            class="address-info" 
            v-if=" 
                address &&
                address.brand_store_tags &&
                address.brand_store_tags.length 
            "
        >
            <span>Store Tag: </span>{{ address.brand_store_tags[0] }}
        </div>
        <div class="address-info">
            <span>Contact Name: </span>{{ address.contact_person }}
        </div>
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
            <span>Contact Phone: </span>{{ address.phone }}
            <!-- <adm-inline-svg class="make-a-call" src="call"></adm-inline-svg> -->
        </div>
        <div class="address-info store-address">
            <span>Address: </span>{{ store_address }}
        </div>
        <div v-if="comment">
            <div class="title bold-sm mt-sm mb-sm">Customer Notes</div>
            <div class="notes">{{ comment }}</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.notes{
    color: #9b9b9b;
    font-size: 12px;
}
.title {
    color: @Mako;
    font-size: 14px;
    margin-bottom: 5px;
}
.mt-sm{
    margin-top: 10px;
}
.mb-sm{
    margin-bottom: 10px;
}
.pt-sm{
    padding-top: 10px;
}
.address {
    .address-info {
        color: @DustyGray2;
        font-size: 12px;
        line-height: 22px;
        font-weight: 400;
        span {
            color: @DustyGray2;
            font-size: 12px;
            font-weight: 700;
        }
        // &.store-address {
        //     font-size: 12px;
        // }
    }
}
.make-a-call {
    cursor: pointer;
    display: inline-block !important;
    vertical-align: top;
    ::v-deep svg {
        width: 16px;
        height: 16px;
    }
}
</style>

<script>
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'company-fullfillment-store',
    components: {
        AdmInlineSvg
    },
    computed: {
        store_address() {
            const store_address = [
                this.address.address1,
                this.address.address2,
                this.address.area,
                this.address.city,
                this.address.state,
                this.address.country,
                this.address.pincode
            ];
            return store_address.filter(sa => sa).join(', ');
        },
        ...mapGetters({
           // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL
        }),
    },
    props: {
        address: {},
        comment:null
    },
    data() {
        return {};
    },
    methods: {
        // makeACall(phone) {
        //         this.$emit('call', { receiver: phone, title: 'Call Store' });
        // },
        checkReadRole() {
            const role = true
                // this.accessDetail &&
                // this.accessDetail.order_role &&
                // (this.accessDetail.order_role != 'read_only');
            return role;
        },
    }
};
</script>
