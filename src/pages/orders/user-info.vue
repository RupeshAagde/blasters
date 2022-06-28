<template>
    <div class="user">
        <div class="title bold-sm">Customer Details</div>
        <div class="user-info">{{ fullName }}</div>
        <!-- <div
            v-if="user.mobile && checkReadRole()"
            class="user-info"
            @click="makeACall(user.mobile)"
            title="Click to call"
        > -->
        <div
            v-if="user.mobile && checkReadRole()"
            class="user-info"
        >
            {{ user.mobile }}
            <!-- <adm-inline-svg class="make-a-call" src="call"></adm-inline-svg> -->
        </div>
        <div class="user-info">{{ user.email }}</div>
    </div>
</template>

<style lang="less" scoped>
.title {
    color: @Mako;
    font-size: 14px;
    margin-bottom: 12px;
}
.user {
    display: initial;

    .user-info {
        color: @DustyGray2;
        font-size: 14px;
        line-height: 22px;
    }
}
.make-a-call {
    cursor: pointer;
    display: inline-block !important;
    margin-left: 6px;
    ::v-deep svg {
        width: 16px;
        height: 16px;
    }
}
</style>

<script>
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
// import { GET_EMPLOYEE_ACCESS_DETAIL } from '@/store/getters.type';
import { IS_VALID_USER } from '@/store/getters.type';
import { VALIDATE_USER } from '@/store/action.type';
import { mapGetters } from 'vuex';

export default {
    name: 'user-info',
    components: {
        AdmInlineSvg
    },
    props: {
        user: {}
    },
    computed: {
        fullName() {
            return `${this.user.first_name} ${this.user.last_name}`;
        },
        ...mapGetters({
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL
            accessDetail: IS_VALID_USER
        }),
    },
    mounted() {
        this.validateUser();
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
        validateUser() {
            this.$store.dispatch(VALIDATE_USER);
        }
    }
};
</script>
