<template>
    <div class="feature-component">
        <div style="max-width: 700px;" class="form-row no-pad" v-if="formData">
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    :label="'Feature Text *'"
                    v-model="formData.display_text"
                >
                </nitrozen-input>
                <nitrozen-error
                    v-bind:class="{ visible: errors['display_text'] }"
                >
                    {{ errors['display_text'] || '-' }}
                </nitrozen-error>
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
    name: 'custom-payment-gatway-setup',
    props: {
        config: {
            type: Object
        },
        formData: {
            type: Object
        },
        disabled: {
            type: Boolean
        }
    },
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError,
        'nitrozen-input': NitrozenInput
    },
    data() {
        return {
            errors: {}
        };
    },
    methods: {
        validateData() {
            let is_valid = true;
            this.clearErrors();
            if (!this.formData.display_text) {
                this.errors['display_text'] = 'Required field';
            }
            return is_valid;
        },
        clearErrors() {
            this.errors = {};
        }
    }
};
</script>
