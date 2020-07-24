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
                <nitrozen-checkbox
                    v-model="formData.is_active"
                >
                    Enabled
                </nitrozen-checkbox>
            </div>
        </div> -->
        <div class="form-row form-compact-items" v-if="config">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.feature_config.email">
                    {{ config.email.display }}
                </nitrozen-checkbox>
            </div>
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.feature_config.call">
                    {{ config.call.display }}
                </nitrozen-checkbox>
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
    name: 'support',
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
