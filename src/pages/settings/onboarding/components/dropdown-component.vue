<template>
    <loader v-if="pageLoading"></loader>
    <div class="margin inline" v-else>
        <div class="choice-dropdown">
            <nitrozen-dropdown
                v-model="lineItem.data.currentValue"
                :label="this.lineItem.text"
                :items="this.choicesList"
                :placeholder="this.lineItem.text"
                :disabled="!parentState"
            />
        </div>
    </div>
</template>

<script>
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';

export default {
    name: 'dropdown-component',
    components: {
        NitrozenDropdown
    },
    props: ['lineItem', 'parentState'],

    data() {
        return {
            pageLoading: false,
            choicesList: []
        };
    },
    mounted() {
        this.choicesList = this.getDropDownChoiceList(
            this.lineItem.additionalParams
        );
    },
    methods: {
        saveForm() {
            return this.lineItem.data.currentValue;
        },
        getDropDownChoiceList(items) {
            return items.map((item) => {
                return {
                    text: item.value,
                    value: item.key
                };
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';
.margin {
    margin: 24px 24px 0px;
}

.title {
    font-weight: 400;
    font-size: 14px;
    color: @Black;
}
.choice-dropdown {
    width: 400px;
}
::v-deep .nitrozen-dropdown-label {
    color: @Black;
}
</style>
