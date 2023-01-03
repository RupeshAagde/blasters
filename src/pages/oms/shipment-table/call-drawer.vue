<template>
    <div class="call-drawer-head">
        <nitrozen-input
            class="call-from"
            :type="'textarea'"
            label="From"
            v-model="checkForCaller"
            placeholder="Caller"
            :disabled="false"
        ></nitrozen-input>

        <nitrozen-dropdown
            class="call-to"
            label="To"
            @change="selectedReciever"
            :items="toReciever"
            v-model="chosenReciever"
        >
        </nitrozen-dropdown>

        <nitrozen-input
            class="caller-id"
            :type="'textarea'"
            label="Via"
            v-model="checkForCallerId"
            placeholder="Caller ID"
            :disabled="false"
        ></nitrozen-input>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: "call-drawer",
    props: {
    //    dpOptionsData: Object,
    },
    data() {
        return {
            chosenReciever: "",
            checkForCaller: "",
            checkForCallerId: "",
            toReciever: [
                {
                    text: "8451986736",
                    value: "num1"
                },
                {
                    text: "29837498993",
                    value: "num2"
                }
            ],
            
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
    methods: {
        selectedReciever() {
            console.log("Selected bag stage:: :", this.chosenReciever)
        },
    }

}
</script>

<style lang="less" scoped> 

.call-drawer-head{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

::v-deep .nitrozen-form-input {
    .nitrozen-input-grp {
        .n-input-textarea {
            height: unset;
        }
    }
}

</style>