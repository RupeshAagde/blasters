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
                <nitrozen-input
                    :label="config.hard_limit.display"
                    v-model="formData.feature_config.hard_limit"
                    :type="config.hard_limit.type"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :label="config.soft_limit.display"
                    v-model="formData.feature_config.soft_limit"
                    :type="config.soft_limit.type"
                >
                </nitrozen-input>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
export default {
    name: 'sale-websites',
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
        'nitrozen-error': NitrozenError,
        'nitrozen-checkbox': NitrozenCheckBox
    }
};
</script>
