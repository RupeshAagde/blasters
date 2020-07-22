<template>
    <div class="feature-component">
        <div class="form-row form-compact-items" v-if="formData">
            <div class="form-item">
                <nitrozen-input
                    :label="'Display Text *'"
                    v-model="formData.display_text"
                >
                </nitrozen-input>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>
        <div class="form-row form-compact-items" v-if="config">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.feature_config.enabled">
                    {{ config.enabled.display }}
                </nitrozen-checkbox>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenCheckBox,
    NitrozenError
} from '@gofynd/nitrozen-vue';

export default {
    name: 'mobile-app',
    props: {
        config: {
            type: Object
        },
        formData: {
            type: Object
        }
    },
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError
    }
};
</script>
