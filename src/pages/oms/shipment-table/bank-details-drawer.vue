<template>
    <div class="bank-details-drawer-head">
        <nitrozen-input
            class="search-input"
            label="Account Number*"
            type="text"
            :placeholder="`Enter Account Number`"
            v-model="accountNumber"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="IFSC Code*"
            type="text"
            :placeholder="`Enter IFSC Code`"
            v-model="ifscCode"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Bank Name*"
            type="text"
            :placeholder="`Enter Bank Name`"
            v-model="bankName"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Branch Name*"
            type="text"
            :placeholder="`Enter Branch Name`"
            v-model="branchName"
        ></nitrozen-input>
        
        <nitrozen-input
            class="search-input"
            label="Account Holder Name*"
            type="text"
            :placeholder="`Enter Account Holder Name`"
            v-model="accountHolderName"
        ></nitrozen-input>

        <nitrozen-input
            class="search-input"
            label="Remark"
            type="textarea"
            :placeholder="`Enter your remark here`"
            v-model="remark"
        ></nitrozen-input>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

/* Package imports */
import moment from 'moment';

export default {
    name: "bank-details-drawer",
    props: {
    //    dpOptionsData: Object,
    },
    data() {
        return {
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            branchName: "",
            accountHolderName: "",
            remark: "",
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
    mounted() {
        
    },
    computed: {
        
    },
    methods: {
        selectedEmployee() {
            console.log("Selected bag stage:: :", this.employee);
        },
    }

}
</script>

<style lang="less" scoped> 

.bank-details-drawer-head {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

</style>