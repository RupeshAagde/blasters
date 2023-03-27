<template>
    <div class="item-form">
                        <div class="form-item">
                            <div class="form-title">Business Unit</div>
                            <nitrozen-dropdown
                                :disabled="true"
                                :items="businessUnitList"
                                v-model="businessUnit"
                            ></nitrozen-dropdown>
                        </div>
                        <div class="form-item">
                            <div class="form-title">Copy Config from</div>
                            <nitrozen-dropdown
                                :disabled="true"
                                :items="deviceList"
                                v-model="device"
                            ></nitrozen-dropdown>
                        </div>

                        <div class="form-item">
                            <div class="form-title">Paste Config in</div>
                            <nitrozen-dropdown
                                :items="deviceListToCopyConfig"
                                v-model="selectedDeviceListToCopy"
                                :multiple="true"
                                :label="' '"
                                :placeholder="'Select Devices'"
                            ></nitrozen-dropdown>
                            <nitrozen-error
                                v-bind:class="{ visible: errors['to'] }"
                            >
                                {{ errors['to'] }}
                            </nitrozen-error>
                        </div>
                    </div>
</template>

<style lang="less" scoped>
.item-form {
    margin-top: 100px;
    .form-item {
        margin-top: 16px;
    }
    .form-title {
        margin-top: 10px;
        font-weight: 400;
        font-size: 12px;
        margin-bottom: 10px;
    }
}
</style>

<script>
import {
    NitrozenDropdown,
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenError
} from '@gofynd/nitrozen-vue';
    
export default {
    name: 'copy-config',
    props: {
        selectedDeviceListToCopy,
        deviceListToCopyConfig,
        businessUnitList,
        businessUnit,
        deviceList,
        device
    },
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-error': NitrozenError,
        InlineSvg,
        PageEmpty,
        PageError,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mounted() {},
    data() {
        return {
            errors: {}
        };
    },
    methods: {}
};
</script>