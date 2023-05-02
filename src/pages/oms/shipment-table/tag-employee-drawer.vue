<template>
    <div class="tag-employee-drawer-head">
        <div class="title">
            <span>Select Fynd Store Employee to tag with this order</span>
        </div>
        <nitrozen-dropdown
            class="employee"
            label="Select Employee"
            @change="selectedEmployee"
            :items="employeeInfo"
            v-model="employee"
        >
        </nitrozen-dropdown>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: "tag-employee-drawer",
    props: {
    },
    data() {
        return {
            employee: "",
            employeeInfo: [
                {
                    text: "Rohit Gupta",
                    value: "awesomist"
                },
                {
                    text: "Luffy",
                    value: "King"
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
        selectedEmployee() {
            console.log("Selected bag stage:: :", this.employee);
        },
    }
}
</script>

<style lang="less" scoped> 

.tag-employee-drawer-head {
    .title {
        margin-bottom: 24px;
    }
}

</style>