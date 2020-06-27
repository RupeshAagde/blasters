<template>
    <span v-html="getSVG" class="inline-svg"></span>
</template>
<script>
import __SVG from './../../auto_gen/admin-svgs.js';
export default {
    name: 'admininlinesvg',
    props: {
        src: { type: String, required: true }
    },
    computed: {
        getSVG() {
            return __SVG[this.src];
        }
    }
};
</script>

<style lang="less" scoped>
.inline-svg {
    .flex-center();
}
</style>
