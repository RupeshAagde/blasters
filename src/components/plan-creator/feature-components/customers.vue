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
        <div class="form-row form-compact-items" v-if="config">
            <div class="form-item">
                <nitrozen-input
                    :label="config.limit.display"
                    v-model="formData.feature_config.limit"
                    :type="config.limit.type"
                >
                </nitrozen-input>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenInput, NitrozenError } from '@gofynd/nitrozen-vue';

export default {
    name: 'customers',
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
        'nitrozen-error': NitrozenError
    }
};
</script>
