<template>
    <div class="feature-component">
        <div class="form-row form-compact-items" v-if="formData">
            <div class="form-item">
                <nitrozen-input
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
