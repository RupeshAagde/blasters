<template>
    <div class="option-container">
        <div class="dark-xxs cl-DustyGray2">{{ capitalize(options.key) }}</div>
        <div class="unit-box">
            <nitrozen-input
                class="unit-input"
                type="number"
                placeholder="auto"
                :showSuffix="true"
                :custom="true"
                v-model="options.value"
            >
                <nitrozen-dropdown
                    class="unit-dropdown"
                    :items="options.units"
                    v-model="options.unit"
                ></nitrozen-dropdown>
            </nitrozen-input>
        </div>
    </div>
</template>

<style lang="less" scoped>
.option-container {
    margin: 15px 0px;
}
.unit-box {
    display: flex;
    margin-top: 5px;
}
.unit-input {
    flex: 1;
    width: 40px;
}
.unit-dropdown {
    width: 80px;
}
</style>

<script>
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
export default {
    name: 'page-css-option',
    components: {
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput
    },
    props: {
        options: {}
    },
    methods: {
        capitalize(str) {
            return str && str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
};
</script>
