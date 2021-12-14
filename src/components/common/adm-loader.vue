<template>
    <div class="loader">
        <img src="/public/assets/loader.gif" />
        <div v-if="helperText">{{ helperText }}</div>
        <nitrozen-button
            v-if="action"
            theme="secondary"
            title="Cancel"
            @click="$emit('cancel')"
        >
            Cancel
        </nitrozen-button>
    </div>
</template>
<script>

import {
    NitrozenButton,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-loader',
    components: {
        NitrozenButton
    },
    props: {
        helperText: '',
        action: {
            default: () => {
                return false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.loader {
    img {
        height: 100px;
    }
    display: flex;
    flex-direction: column;
}
</style>
