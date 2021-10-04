<template>
    <div v-if="link">
        <div class="link-container">
            <div @click.stop="" title="Click to open" class="link">
                <a target="_blank" :href="link">
                    {{ link }}
                </a>
            </div>
            <div
                title="Click to copy"
                id="pageLink"
                class="copy"
                @click.stop="copyToClipboard"
            >
                <inline-svg src="copy"></inline-svg>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.link-container {
    display: flex;
}
.link {
    font-size: 12px;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
        color: @RoyalBlue;
        &:hover {
            text-decoration: underline;
        }
    }
}
.copy {
    padding: 0 10px;
    cursor: pointer;
    ::v-deep svg {
        width: 14px;
        height: 14px;
    }
}
</style>

<script>
import inlinesvg from './inline-svg.vue';

import { copyToClipboard } from './../../helper/utils.js';

export default {
    name: 'Page-link',
    components: {
        'inline-svg': inlinesvg
    },
    props: {
        link: ''
    },
    methods: {
        copyToClipboard(e) {
            copyToClipboard(this.link);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        }
    }
};
</script>
