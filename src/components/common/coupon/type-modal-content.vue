<template>
    <div class="page-content global-font-family" v-show="selectedType">
        <div class="title bold-sm cl-Mako">{{ title }}</div>
        <div class="subtitle regular-xs cl-DustyGray2">{{ subtitle }}</div>
        <div class="title dark-xs cl-Mako">Example:</div>
        <pre class="sample-text" v-html="description"></pre>
    </div>
</template>

<style lang="less" scoped>
.page-content {
    font-family: Inter, sans-serif;
}
.title {
    margin-bottom: 12px;
}
.subtitle {
    margin-bottom: 20px;
}
.sample-text {
    font-family: inherit;
    .font-size(@font-xs);
    background: #f2f2f2;
    line-height: 20px;
    ::v-deep b {
        font-weight: 600;
    }
}
</style>

<script>
import { TYPE_DATA } from '../../../helper/coupon-helper';

export default {
    name: 'type-modal-content',
    props: {
        selectedType: {
            type: String
        }
    },
    computed: {
        title() {
            return TYPE_DATA[this.selectedType].title;
        },
        subtitle() {
            return TYPE_DATA[this.selectedType].subtitle;
        },
        description() {
            return TYPE_DATA[this.selectedType].description;
        }
    }
};
</script>
