<template>
    <ukt-modal
        :isOpen="showMdModal"
        :isCancelable="true"
        @closedialog="closeModal"
        :title="'Markdown Preview'"
    >
        <markdown-viewer :value="blogText"></markdown-viewer>
    </ukt-modal>
</template>

<style lang="less" scoped>
/deep/ .modal-container {
    min-width: 55% !important;
    min-height: 40% !important;
    max-height: 80% !important;
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
        background-color: @White;
    }
    &::-webkit-scrollbar {
        width: 5px;
        background-color: @White;
    }
    &::-webkit-scrollbar-thumb {
        background-color: @DarkGray;
    }
}
/deep/.v-note-panel {
    border: none !important;
}
</style>

<script>
import uktModal from '../common/utk-modal.vue'
import markdownViewer from '../common/ukt-markdown-viewer.vue';

export default {
    name: 'markdown-preview-modal',
    components: {
        'ukt-modal': uktModal,
        'markdown-viewer': markdownViewer
    },
    props: {
        markdownText: '',
        pageData: {},
        showMdModal: false
    },
    data() {
        return {
            blogText: ''
        };
    },
    watch: {
        showMdModal() {
            if (this.showMdModal) this.showPreview();
        }
    },
    methods: {
        showPreview() {
            let imageUrl = this.pageData.feature_image.secure_url;
            let markdownText = this.markdownText;
            if (!this.markdownText) {
                this.pageData.content = this.pageData.content || [];
                markdownText = this.pageData.content.find(
                    elem => elem.type === 'markdown'
                );
                markdownText = (markdownText && markdownText.value) || '';
            }
            this.blogText = imageUrl
                ? `<img src="${imageUrl}" style='width:100%;height:250px'\/><br><br>
                ${markdownText}`
                : markdownText;
        },
        closeModal() {
            this.blogText = '';
            this.$emit('closedialog');
        }
    }
};
</script>
