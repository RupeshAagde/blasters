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
                <nitrozen-dropdown
                    :label="config.type.display"
                    v-model="formData.feature_config.type"
                    :items="
                        config.type.enum.map((item) => {
                            return { value: item, text: item };
                        })
                    "
                >
                </nitrozen-dropdown>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown
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
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown
    }
};
</script>
