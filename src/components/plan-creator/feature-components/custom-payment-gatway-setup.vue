<template>
    <div class="feature-component">
        <!-- <div class="form-row form-compact-items" v-if="formData">
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
                <nitrozen-input
                    :label="config.limit.display_text"
                    v-model="formData.feature_config.limit"
                    :type="config.limit.type"
                >
                </nitrozen-input>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'custom-payment-gatway-setup',
    props: {
        config: {
            type: Object
        },
        formData: {
            type: Object
        }
    }
};
</script>
