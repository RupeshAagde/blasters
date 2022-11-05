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
                <nitrozen-checkbox
                    v-model="formData.is_active"
                >
                    Enabled
                </nitrozen-checkbox>
            </div>
        </div> -->
        <div class="form-row form-compact-items" v-if="config">
            <div class="form-item">
                <nitrozen-dropdown
                    :disabled="disabled"
                    :label="'Support time'"
                    v-model="formData.feature_config.type"
                    :items="support_types"
                >
                </nitrozen-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
export default {
    name: 'sla',
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
    data() {
        return {
            support_types: [
                {
                    value: 'level0',
                    text: '24Hr'
                },
                {
                    value: 'level1',
                    text: '12Hr'
                },
                {
                    value: 'level2',
                    text: '8Hr'
                },
                {
                    value: 'level3',
                    text: '4Hr'
                }
            ],
            errors: {}
        };
    },
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox
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
