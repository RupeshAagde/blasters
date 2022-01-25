<template>
    <div>
        <mavon-editor
            v-model="value"
            :language="'en'"
            :placeholder="''"
            :defaultOpen="'preview'"
            :toolbarsFlag="false"
            :subfield="false"
            :boxShadow="false"
            :editable="editable"
            class="markdown-viewer"
            :imageClick="disableClick"
        />
    </div>
</template>
<style lang="less" scoped>
@import '../../../node_modules/mavon-editor/dist/css/index.css';
.markdown-viewer {
}
/deep/ .markdown-body {
    z-index: 1;
    ol {
        list-style: decimal;
    }
    ul {
        list-style: disc;
    }
}
/deep/.v-show-content {
    padding: 10px !important;
}
/deep/.markdown-body p {
    margin: 0px;
}
</style>
<script>
import { mavonEditor } from 'mavon-editor';
export default {
    name: 'markdown-viewer',
    components: {
        'mavon-editor': mavonEditor
    },
    props: {
        value: '',
        editable: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        disableClick() {}
    }
};
</script>
