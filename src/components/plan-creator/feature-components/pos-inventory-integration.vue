<template>
    <div class="feature-component">
        <div class="form-row form-compact-items" v-if="formData">
            <div class="form-item">
                <nitrozen-input
                    :label="'Feature Text *'"
                    v-model="formData.display_text"
                >
                </nitrozen-input>
            </div>
        </div>
        <!-- <div class="form-row form-compact-items" v-if="config">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.is_active" @input="(value)=>formData.feature_config.enabled=value">
                    Enabled
                </nitrozen-checkbox>
            </div>
        </div> -->
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenCheckBox,
    NitrozenError
} from '@gofynd/nitrozen-vue';
export default {
    name: 'pos-inventory-integration',
    props: {
        config: {
            type: Object
        },
        formData: {
            type: Object
        }
    },
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError,
        'nitrozen-input': NitrozenInput
    }
};
</script>
