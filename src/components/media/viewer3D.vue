<template>
    <div class="model">
        <model-viewer v-if="!list" :src="src"  :interaction-prompt="prompt" camera-controls class="viewer-3d">
        </model-viewer>

        <model-viewer v-else id="lazy-load" :src="src" class="viewer-3d">
            <div id="lazy-load-poster" slot="poster"></div>
        </model-viewer>
    </div>
</template>
<style lang="less" scoped >
.model {
    height: 100%;
    width: 100%;
}
.viewer-3d {
    position: relative;
    background: @White;
    width: 100%;
    height: 100%;
    #loading-poster {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        ::v-deep .container {
            background: transparent;
            width: 100%;
            height: 100%;
        }
        ::v-deep .loader {
            top: 0;
            left: 0;
        }
    }
}
</style>
<script>
import '@google/model-viewer';

export default {
    name: "viewer-3d",
    props: {
        src: {
            type: String,
            required: true
        },
        prompt: {
            type: String,
            default: 'auto'
        },
        list: {
            type: Boolean,
            default: false
        }
    }
}
</script>
