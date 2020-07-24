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
                <nitrozen-dropdown
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
            ]
        };
    },
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox
    }
};
</script>
