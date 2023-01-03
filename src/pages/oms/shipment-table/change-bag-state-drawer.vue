<template>
    <div class="change-bag-state-body">
        <div class="dropdowns">
            <nitrozen-dropdown
                class=""
                label="Next Bag State"
                @change="selectedState"
                :items="bagState"
                v-model="bagStateValue"
            >
            </nitrozen-dropdown>
            <nitrozen-dropdown
                class=""
                label="Reason"
                @change="selectedReason"
                :items="reasons"
                v-model="reasonValue"
            >
            </nitrozen-dropdown>
        </div>
        <div class="user-input">
            <nitrozen-input
                :type="'textarea'"
                label="Remark"
                v-model="checkForNote"
                placeholder="(Min. 10 characters)"
                :disabled="false"
            ></nitrozen-input>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: "change-bag-state",
    props: {
    //    dpOptionsData: Object,
    },
    data() {
        return {
            bagStateValue: "",
            reasonValue: "",
            checkForNote: "",
            bagState: [
                {
                    text: "Placed",
                    value: "placed"
                },
                {
                    text: "Confirmed",
                    value: "confirmed"
                },
                {
                    text: "Delivered",
                    value: "delivered"
                }
            ],
            reasons: [
                {
                    text: "Broken Item",
                    value: "broken_item"
                },
                {
                    text: "Not working",
                    value: "not_working"
                },
                {
                    text: "Does not fit",
                    value: "fit"
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
        selectedState() {
            console.log("Selected bag stage:: :", this.bagStateValue)
        },
        selectedReason() {
            console.log("Selected reason:: :", this.reasonValue)
        }
    }

}
</script>

<style lang="less" scoped> 

.change-bag-state-body {
    .dropdowns {
        display: flex;
        gap: 16px;
        margin-bottom: 40px;
    }
}
</style>