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
import { NitrozenInput } from '@gofynd/nitrozen-vue';


export default {
    name: "bank-details-drawer",
    props: {
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
        NitrozenInput,
    },
}
</script>

<style lang="less" scoped> 

.bank-details-drawer-head {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

</style>